# DEVELOPMENT.md — Architectural & Development Guide

## 1. Quick Start (Local Development)
```bash
# 1. Pastikan backend zyekh-ai-core aktif di port 3000
curl -Is http://127.0.0.1:3000/api/health

# 2. Masuk ke direktori chat.zyekh.com
cd /home/fuckadmin/Projects/chat.zyekh.com

# 3. Jalankan server lokal (Port 3001)
npm start
```
Buka browser di `http://localhost:3001`.

---

## 2. API Proxy Routing
* Seluruh request ke `/api/*` secara otomatis diproxy oleh `server.js` ke `http://127.0.0.1:3000/api/*`.
* Pada environment production GitHub Pages (`chat.zyekh.com`), `API_BASE` secara default mengarah ke `https://api.zyekh.com`.

---

## 3. Deployment & CI/CD
* **GitHub Pages**: Dikonfigurasi dengan `CNAME` (`chat.zyekh.com`), `.nojekyll`, dan `404.html` (SPA fallback).
* **Automated Workflow**: `.github/workflows/deploy.yml` mendistribusikan aset statis secara otomatis ke GitHub Pages.

---

## 4. Quality Gates & Verification
Sebelum melakukan commit, selalu jalankan validasi:
```bash
# Verifikasi 0 emoji di seluruh codebase
python3 check_emojis.py

# Verifikasi server syntax
node -c server.js
node -c assets/js/app.js
node -c chat-widget.js
```
