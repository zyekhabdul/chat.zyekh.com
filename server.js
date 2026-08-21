import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
