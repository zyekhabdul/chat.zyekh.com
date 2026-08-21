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
  process.env.CORE_API_URL ? process.env.CORE_API_URL.replace('/api/chat', '').replace('/api', '') : null,
  'http://zyekh-ai-core-nblqvy:3000',
  'http://zyekh-ai-core:3000',
  'http://172.17.0.1:3000',
  'http://127.0.0.1:3000',
  'https://api.zyekh.com'
].filter(Boolean);

app.use(express.json({ limit: '10mb' }));

// Global Security & CSP Middleware (Permits Cloudflare Web Analytics)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://api.zyekh.com https://chat.zyekh.com https://shop.zyekh.com https://cloudflareinsights.com; frame-ancestors 'none'; base-uri 'self';"
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

// === Programmatic SEO: Share Conversation Endpoints ===
app.post('/api/share', async (req, res) => {
  try {
    const { shareId: existingId, title, messages, modelUsed, authorName } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Daftar pesan tidak valid.' });
    }

    let shareId = existingId ? String(existingId).replace(/[^a-zA-Z0-9_-]/g, '') : null;
    if (!shareId || !shareId.startsWith('s_')) {
      shareId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    }

    const shareData = {
      id: shareId,
      title: title || 'Percakapan Zyekh AI',
      createdAt: new Date().toISOString(),
      modelUsed: modelUsed || 'gemini-3.7-flash-high',
      authorName: authorName || 'Pengguna',
      messages: messages.slice(0, 100)
    };

    const filePath = path.join(SHARES_DIR, `${shareId}.json`);
    await fs.writeFile(filePath, JSON.stringify(shareData, null, 2), 'utf-8');

    return res.json({
      success: true,
      shareId,
      url: `/s/${shareId}`,
      fullUrl: `https://chat.zyekh.com/s/${shareId}`
    });
  } catch (err) {
    console.error('[SHARE ERROR]', err);
    res.status(500).json({ success: false, error: 'Gagal menyimpan snapshot percakapan.' });
  }
});

app.get('/api/share/:id', async (req, res) => {
  try {
    const shareId = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(SHARES_DIR, `${shareId}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(content));
  } catch {
    res.status(404).json({ success: false, error: 'Snapshot percakapan tidak ditemukan.' });
  }
});

// SSR Prerendered HTML for Shared Conversation (Programmatic SEO & Social Graph)
app.get(['/s/:id', '/share/:id'], async (req, res) => {
  try {
    const shareId = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(SHARES_DIR, `${shareId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const title = escapeHtml(data.title || 'Percakapan Zyekh AI');
    const firstUserMsg = data.messages.find(m => m.role === 'user')?.content || 'Pertanyaan teknis seputar AI dan programming.';
    const firstBotMsg = data.messages.find(m => m.role === 'assistant' || m.role === 'bot')?.content || 'Jawaban analisis AI Zyekh.';
    const desc = escapeHtml(firstBotMsg.slice(0, 160).replace(/\n/g, ' '));
    const shareUrl = `https://chat.zyekh.com/s/${shareId}`;

    const renderedMessages = data.messages.map((m) => {
      const isUser = m.role === 'user';
      const roleLabel = isUser ? escapeHtml(data.authorName || 'Pengguna') : 'Zyekh AI Companion';
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
<html lang="id">
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
  <meta property="og:site_name" content="Zyekh AI Companion" />
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
        "name": "${escapeHtml(data.authorName || 'Pengguna')}"
      },
      "suggestedAnswer": [
        {
          "@type": "Answer",
          "text": "${escapeHtml(firstBotMsg.slice(0, 500))}",
          "dateCreated": "${data.createdAt}",
          "url": "${shareUrl}#answer",
          "author": {
            "@type": "Organization",
            "name": "Zyekh AI Companion",
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
        <span>ZYEKH AI COMPANION</span>
      </a>
      <a href="/?import_share=${shareId}" class="shared-btn-cta">
        Lanjutkan Obrolan Ini &rarr;
      </a>
    </header>

    <h1 class="shared-title">${title}</h1>
    <div class="shared-meta">
      Model: ${escapeHtml(data.modelUsed)} &bull; ${new Date(data.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>

    <section class="shared-feed" id="answer">
      ${renderedMessages}
    </section>

    <div class="shared-footer-cta">
      <h4>Mulai Obrolan Baru Anda Sendiri</h4>
      <p>Diskusi interaktif, brainstorming teknis, dan asisten riset AI tanpa batas tanpa pelacakan data.</p>
      <a href="/" class="shared-btn-cta">Buka Zyekh AI Companion</a>
    </div>
  </main>
</body>
</html>`;

    res.send(html);
  } catch (err) {
    console.error('[SHARED VIEW ERROR]', err);
    res.status(404).send('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="background:#09090b;color:#fafafa;font-family:sans-serif;padding:2rem;text-align:center;"><h2>Percakapan Tidak Ditemukan</h2><p style="color:#a1a1aa;margin:1rem 0;">Snapshot percakapan ini mungkin sudah dihapus atau tidak valid.</p><a href="/" style="color:#fafafa;">Kembali ke Halaman Utama</a></body></html>');
  }
});

// API Reverse Proxy ke zyekh-ai-core (Port 3000)
// Mendukung Swarm discovery, bridge docker host, localhost dev, dan production fallback
app.all('/api/*', async (req, res) => {
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
      const response = await fetch(targetUrl, { ...fetchOptions, signal: AbortSignal.timeout(35000) });
      const data = await response.text();
      return res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(data);
    } catch (err) {
      lastError = err;
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
