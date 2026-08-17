import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_TARGET = 'http://127.0.0.1:3000';

app.use(express.json({ limit: '10mb' }));

// API Reverse Proxy ke zyekh-ai-core (Port 3000)
// Mendukung SSH Port Forwarding (hanya butuh forward 1 port 3001)
app.all('/api/*', async (req, res) => {
  const targetUrl = `${API_TARGET}${req.originalUrl}`;
  try {
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

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(data);
  } catch (err) {
    console.error(`[PROXY ERROR] Gagal meneruskan ke ${targetUrl}:`, err.message);
    res.status(502).json({
      success: false,
      error: 'Gateway error: Tidak dapat terhubung ke Zyekh AI Core API (Port 3000).'
    });
  }
});

// Serve static assets
app.use(express.static(__dirname));

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[CHAT-ZYEKH-COM] [ VERIFIED ] Web App aktif di http://localhost:${PORT}`);
  console.log(`[CHAT-ZYEKH-COM] [ PROXY ] Reverse Proxy /api -> ${API_TARGET}/api`);
});
