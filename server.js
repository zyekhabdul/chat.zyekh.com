import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

import fs from 'fs/promises';
import fsSync from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data/shares directory exists
const SHARES_DIR = path.join(__dirname, 'data', 'shares');
if (!fsSync.existsSync(SHARES_DIR)) {
  fsSync.mkdirSync(SHARES_DIR, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;
const CANDIDATE_TARGETS = [
  process.env.CLOUDFLARE_AI_GATEWAY_URL,
  process.env.CORE_API_URL ? process.env.CORE_API_URL.replace('/api/chat', '').replace('/api', '') : null,
  'http://zyekh-ai-core-nblqvy:3000',
  'http://zyekh-ai-core:3000',
  'http://172.17.0.1:3000',
  'http://127.0.0.1:3000',
  'https://api.zyekh.com'
].filter(Boolean);

// In-Memory Semantic Prompt Cache (5-Minute TTL & 500 Entry Cap)
const AI_RESPONSE_CACHE = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;

function getCacheKey(req) {
  if (req.method === 'GET') return `GET:${req.originalUrl}`;
  if (req.method === 'POST' && req.originalUrl === '/api/chat' && req.body) {
    const model = req.body.model || 'default';
    const persona = req.body.persona || 'mentor';
    const msg = req.body.message || (Array.isArray(req.body.messages) ? JSON.stringify(req.body.messages) : '');
    return `POST:/api/chat:${model}:${persona}:${String(msg).trim().toLowerCase()}`;
  }
  return null;
}

function setCache(key, status, contentType, data) {
  if (!key || status !== 200) return;
  if (AI_RESPONSE_CACHE.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = AI_RESPONSE_CACHE.keys().next().value;
    AI_RESPONSE_CACHE.delete(oldestKey);
  }
  AI_RESPONSE_CACHE.set(key, {
    status,
    contentType,
    data,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
}

app.use(express.json({ limit: '10mb' }));

// Global Security & CSP Middleware (Permits Cloudflare Web Analytics)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://cdn.jsdelivr.net https://esm.run; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://api.zyekh.com https://chat.zyekh.com https://shop.zyekh.com https://cloudflareinsights.com https://huggingface.co https://raw.githubusercontent.com https://cdn.jsdelivr.net https://esm.run; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self';"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// === Serverless & Resilient Snapshot Storage Adapter (Tahap 5.2) ===
const SHARE_SNAPSHOT_CACHE = new Map();
const SHARE_CACHE_TTL_MS = 15 * 60 * 1000; // 15-Minute In-Memory LRU Cache
const MAX_SHARE_ENTRIES = 1000;

const CF_KV_CONFIG = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
  apiToken: process.env.CLOUDFLARE_API_TOKEN
};

async function saveSnapshot(shareId, shareData) {
  // 1. In-Memory LRU Cache
  if (SHARE_SNAPSHOT_CACHE.size >= MAX_SHARE_ENTRIES) {
    const oldest = SHARE_SNAPSHOT_CACHE.keys().next().value;
    SHARE_SNAPSHOT_CACHE.delete(oldest);
  }
  SHARE_SNAPSHOT_CACHE.set(shareId, {
    data: shareData,
    expiresAt: Date.now() + SHARE_CACHE_TTL_MS
  });

  const payloadStr = JSON.stringify(shareData, null, 2);

  // 2. Cloudflare KV Remote Edge Storage (If Configured)
  if (CF_KV_CONFIG.accountId && CF_KV_CONFIG.namespaceId && CF_KV_CONFIG.apiToken) {
    try {
      const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_KV_CONFIG.accountId}/storage/kv/namespaces/${CF_KV_CONFIG.namespaceId}/values/${shareId}`;
      const kvResp = await fetch(kvUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${CF_KV_CONFIG.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: payloadStr,
        signal: AbortSignal.timeout(5000)
      });
      if (kvResp.ok) return { storage: 'cloudflare-kv' };
    } catch (kvErr) {
      console.warn('[KV STORAGE WARN] Cloudflare KV unreachable, fallback to disk:', kvErr.message);
    }
  }

  // 3. Local Filesystem Disk Fallback
  const filePath = path.join(SHARES_DIR, `${shareId}.json`);
  await fs.writeFile(filePath, payloadStr, 'utf-8');
  return { storage: 'local-disk' };
}

async function getSnapshot(shareId) {
  // 1. Check In-Memory Cache (0.5ms TTFB)
  const cached = SHARE_SNAPSHOT_CACHE.get(shareId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  } else if (cached) {
    SHARE_SNAPSHOT_CACHE.delete(shareId);
  }

  // 2. Check Cloudflare KV Remote Edge (If Configured)
  if (CF_KV_CONFIG.accountId && CF_KV_CONFIG.namespaceId && CF_KV_CONFIG.apiToken) {
    try {
      const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_KV_CONFIG.accountId}/storage/kv/namespaces/${CF_KV_CONFIG.namespaceId}/values/${shareId}`;
      const kvResp = await fetch(kvUrl, {
        headers: { 'Authorization': `Bearer ${CF_KV_CONFIG.apiToken}` },
        signal: AbortSignal.timeout(5000)
      });
      if (kvResp.ok) {
        const raw = await kvResp.json();
        SHARE_SNAPSHOT_CACHE.set(shareId, { data: raw, expiresAt: Date.now() + SHARE_CACHE_TTL_MS });
        return raw;
      }
    } catch (kvErr) {
      console.warn('[KV RETRIEVAL WARN]', kvErr.message);
    }
  }

  // 3. Local Filesystem Disk Fallback
  const filePath = path.join(SHARES_DIR, `${shareId}.json`);
  const content = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(content);
  SHARE_SNAPSHOT_CACHE.set(shareId, { data, expiresAt: Date.now() + SHARE_CACHE_TTL_MS });
  return data;
}

// === Programmatic SEO: Share Conversation Endpoints ===
app.post('/api/share', async (req, res) => {
  try {
    const { shareId: existingId, title, messages, modelUsed, authorName } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid messages list.' });
    }

    let shareId = existingId ? String(existingId).replace(/[^a-zA-Z0-9_-]/g, '') : null;
    if (!shareId || !shareId.startsWith('s_')) {
      shareId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    }

    const shareData = {
      id: shareId,
      title: title || 'Zyekh AI Conversation',
      createdAt: new Date().toISOString(),
      modelUsed: modelUsed || 'gemini-3.7-flash-high',
      authorName: authorName || 'User',
      messages: messages.slice(0, 100)
    };

    const result = await saveSnapshot(shareId, shareData);

    return res.json({
      success: true,
      shareId,
      storage: result.storage,
      url: `/s/${shareId}`,
      fullUrl: `https://chat.zyekh.com/s/${shareId}`
    });
  } catch (err) {
    console.error('[SHARE ERROR]', err);
    res.status(500).json({ success: false, error: 'Failed to store conversation snapshot.' });
  }
});

app.get('/api/share/:id', async (req, res) => {
  try {
    const shareId = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '');
    const data = await getSnapshot(shareId);
    res.json(data);
  } catch {
    res.status(404).json({ success: false, error: 'Conversation snapshot not found.' });
  }
});

// SSR Prerendered HTML for Shared Conversation (Programmatic SEO & Social Graph)
app.get(['/s/:id', '/share/:id'], async (req, res) => {
  try {
    const shareId = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '');
    const data = await getSnapshot(shareId);

    const title = escapeHtml(data.title || 'Zyekh AI Conversation');
    const firstUserMsg = data.messages.find(m => m.role === 'user')?.content || 'Technical question on AI architecture and software engineering.';
    const firstBotMsg = data.messages.find(m => m.role === 'assistant' || m.role === 'bot')?.content || 'AI response and analysis.';
    const desc = escapeHtml(firstBotMsg.slice(0, 160).replace(/\n/g, ' '));
    const shareUrl = `https://chat.zyekh.com/s/${shareId}`;

    const renderedMessages = data.messages.map((m) => {
      const isUser = m.role === 'user';
      const roleLabel = isUser ? escapeHtml(data.authorName || 'User') : 'Zyekh AI';
      const avatarLabel = isUser ? (data.authorName ? data.authorName.charAt(0).toUpperCase() : 'U') : 'Z';
      const escapedText = escapeHtml(m.content).replace(/\n/g, '<br>');

      return `
        <article class="shared-msg-row ${isUser ? 'user' : 'bot'}">
          <div class="shared-avatar">${avatarLabel}</div>
          <div class="shared-msg-body">
            <header class="shared-msg-header">${roleLabel}</header>
            <div class="shared-msg-text">${escapedText}</div>
          </div>
        </article>
      `;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Zyekh AI Shared Chat</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${shareUrl}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />

  <!-- Open Graph / Social Media -->
  <meta property="og:title" content="${title} — Zyekh AI Shared Chat" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${shareUrl}" />
  <meta property="og:site_name" content="Zyekh AI" />
  <meta property="og:image" content="https://chat.zyekh.com/assets/icons/apple-icon-180x180.png" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title} — Zyekh AI" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://chat.zyekh.com/assets/icons/apple-icon-180x180.png" />

  <!-- Schema.org QAPage Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": "${title}",
      "text": "${escapeHtml(firstUserMsg.slice(0, 300))}",
      "answerCount": 1,
      "dateCreated": "${data.createdAt}",
      "author": {
        "@type": "Person",
        "name": "${escapeHtml(data.authorName || 'User')}"
      },
      "suggestedAnswer": [
        {
          "@type": "Answer",
          "text": "${escapeHtml(firstBotMsg.slice(0, 500))}",
          "dateCreated": "${data.createdAt}",
          "url": "${shareUrl}#answer",
          "author": {
            "@type": "Organization",
            "name": "Zyekh AI",
            "url": "https://chat.zyekh.com/"
          }
        }
      ]
    }
  }
  </script>

  <link rel="stylesheet" href="/assets/fonts/fonts.min.css?v=20260821_v315" />
  <style>
    :root { --bg-dark: #09090b; --bg-card: #141417; --border: #27272a; --text: #fafafa; --text-muted: #a1a1aa; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg-dark); color: var(--text); font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; padding: 1.5rem 1rem; }
    .shared-container { max-width: 860px; margin: 0 auto; }
    .shared-header-bar { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; flex-wrap: wrap; gap: 12px; }
    .shared-brand { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 8px; }
    .shared-btn-cta { background: var(--text); color: var(--bg-dark); padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-decoration: none; transition: opacity 0.15s; }
    .shared-btn-cta:hover { opacity: 0.9; }
    .shared-title { font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; }
    .shared-meta { font-size: 0.8rem; color: var(--text-muted); font-family: monospace; margin-bottom: 1.75rem; }
    .shared-feed { display: flex; flex-direction: column; gap: 1.25rem; }
    .shared-msg-row { display: flex; gap: 12px; }
    .shared-msg-row.user { flex-direction: row-reverse; }
    .shared-avatar { width: 32px; height: 32px; border-radius: 6px; background: var(--bg-card); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }
    .shared-msg-row.user .shared-avatar { background: var(--text); color: var(--bg-dark); }
    .shared-msg-body { max-width: calc(100% - 44px); background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 0.85rem 1.15rem; }
    .shared-msg-row.user .shared-msg-body { background: #18181b; }
    .shared-msg-header { font-size: 0.72rem; font-family: monospace; color: var(--text-muted); margin-bottom: 4px; }
    .shared-msg-text { font-size: 0.92rem; word-break: break-word; }
    .shared-footer-cta { margin-top: 2.5rem; padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card); text-align: center; }
    .shared-footer-cta h4 { font-family: 'Outfit', sans-serif; font-size: 1.1rem; margin-bottom: 0.5rem; }
    .shared-footer-cta p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; }
  </style>
</head>
<body>
  <main class="shared-container">
    <header class="shared-header-bar">
      <a href="/" class="shared-brand">
        <span>ZYEKH AI</span>
      </a>
      <a href="/?import_share=${shareId}" class="shared-btn-cta">
        Continue This Chat &rarr;
      </a>
    </header>

    <h1 class="shared-title">${title}</h1>
    <div class="shared-meta">
      Model: ${escapeHtml(data.modelUsed)} &bull; ${new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>

    <section class="shared-feed" id="answer">
      ${renderedMessages}
    </section>

    <div class="shared-footer-cta">
      <h4>Start Your Own Conversation</h4>
      <p>High-speed, private multi-model AI for coding, research, and system design.</p>
      <a href="/" class="shared-btn-cta">Open Zyekh AI</a>
    </div>
  </main>
</body>
</html>`;

    res.send(html);
  } catch (err) {
    console.error('[SHARED VIEW ERROR]', err);
    res.status(404).send('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="background:#09090b;color:#fafafa;font-family:sans-serif;padding:2rem;text-align:center;"><h2>Conversation Not Found</h2><p style="color:#a1a1aa;margin:1rem 0;">This conversation snapshot does not exist or has expired.</p><a href="/" style="color:#fafafa;">Return to Home</a></body></html>');
  }
});

// API Reverse Proxy ke zyekh-ai-core (Port 3000) & Cloudflare AI Gateway
// Mendukung Semantic Prompt Cache, Swarm discovery, streaming passthrough, dan failover
app.all('/api/*', async (req, res) => {
  // 1. Semantic In-Memory & Edge Prompt Cache Lookup
  const cacheKey = getCacheKey(req);
  if (cacheKey) {
    const cached = AI_RESPONSE_CACHE.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return res
        .status(cached.status)
        .set('Content-Type', cached.contentType)
        .set('cf-aig-cache-status', 'HIT')
        .set('X-Cache-Lookup', 'MEMORY-EDGE-HIT')
        .send(cached.data);
    } else if (cached) {
      AI_RESPONSE_CACHE.delete(cacheKey);
    }
  }

  const fetchOptions = {
    method: req.method,
    headers: {
      'Content-Type': req.headers['content-type'] || 'application/json',
      'Accept': req.headers['accept'] || 'application/json'
    }
  };

  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    fetchOptions.body = JSON.stringify(req.body);
  }

  let lastError = null;
  for (const baseTarget of CANDIDATE_TARGETS) {
    const targetUrl = `${baseTarget}${req.originalUrl}`;
    try {
      const startTime = Date.now();
      const response = await fetch(targetUrl, { ...fetchOptions, signal: AbortSignal.timeout(35000) });
      const cType = response.headers.get('content-type') || 'application/json';
      const cacheStatus = response.headers.get('cf-aig-cache-status') || 'MISS';

      // Streaming SSE Pass-Through
      if (response.body && cType.includes('text/event-stream')) {
        res.writeHead(response.status, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
          'cf-aig-cache-status': cacheStatus
        });
        const reader = response.body.getReader ? response.body.getReader() : null;
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          return res.end();
        } else if (response.body.pipe) {
          return response.body.pipe(res);
        }
      }

      // JSON / Text Data
      const data = await response.text();
      if (response.status === 200) {
        setCache(cacheKey, response.status, cType, data);
      }

      return res
        .status(response.status)
        .set('Content-Type', cType)
        .set('cf-aig-cache-status', cacheStatus)
        .set('X-Response-Time', `${Date.now() - startTime}ms`)
        .send(data);
    } catch (err) {
      lastError = err;
      console.warn(`[PROXY FAILOVER] Target ${baseTarget} gagal (${err.message}). Beralih ke kandidat berikutnya...`);
    }
  }

  console.error('[PROXY ERROR] Seluruh target AI Core tidak dapat dihubungi:', lastError?.message);
  res.status(502).json({
    success: false,
    error: 'Gateway error: Tidak dapat terhubung ke Zyekh AI Core API.'
  });
});

// Serve static assets
app.use(express.static(__dirname));

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[CHAT-ZYEKH-COM] [ VERIFIED ] Web App aktif di http://localhost:${PORT}`);
  console.log(`[CHAT-ZYEKH-COM] [ PROXY ] Candidate Targets: ${CANDIDATE_TARGETS.join(', ')}`);
});
