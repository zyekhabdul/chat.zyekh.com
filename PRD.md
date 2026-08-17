# PRODUCT REQUIREMENT DOCUMENT (PRD) — CHAT.ZYEKH.COM (AI COMPANION)

## 1. Executive Summary & Problem Statement
- **Product Name**: Zyekh AI Companion Web App (`chat.zyekh.com`)
- **Target Audience**: Pengguna individu, pengembang software, dan kreator yang membutuhkan teman diskusi interaktif, refleksi harian, brainstorming konsep, dan asisten riset AI berkecepatan tinggi.
- **Core Problem**: Bot chat konvensional umumnya kaku, terikat konteks transaksi toko, membebani browser dengan bundle framework SPA yang lambat (>1MB), serta membocorkan data/telemetri ke pihak ketiga.
- **Value Proposition**: Web app percakapan AI mandiri yang ringan (*zero-framework vanilla HTML5/CSS/JS*), berfokus pada privasi (*local-first multi-session history*), dan didukung engine AI lokal berkecepatan tinggi tanpa ketergantungan API pihak ketiga yang berbayar.

---

## 2. Technical Stack & Architectural Constraints
- **Runtime / Frontend**: Vanilla HTML5, ESNext JavaScript (Local-First Architecture), Modern CSS Custom Properties.
- **Backend & Proxy**: Node.js (Express Port 3001) bertindak sebagai API Reverse Proxy ke backend pusat `zyekh-ai-core` (Port 3000).
- **Styling Architecture**: Modern Dark Cyberpunk / Slate Palette, CSS Variables, Flexbox/CSS Grid, Full Responsive Mobile Drawer.
- **Performance Targets**: Lighthouse 100/100, First Contentful Paint < 200ms, Core Web Vitals (LCP < 1.0s, CLS 0, INP < 50ms).
- **External Dependencies**: Zero runtime framework dependencies (Strict Ponytail / YAGNI minimalist principle).
- **Strict No-Emoji Standard**: 100% bebas emoji grafis pada seluruh kode sumber, dokumentasi, dan respon sistem. Menggunakan simbol terstruktur ASCII/Unicode (`[ VERIFIED ]`, `[ NOTE ]`, `•`, `->`).

---

## 3. Functional Requirements & Feature Specification

### Feature Group 1: Multi-Session Management (Local-First)
- **User Story**: Sebagai pengguna, saya ingin riwayat percakapan saya tersimpan otomatis di browser lokal sehingga privasi terjamin dan saya dapat beralih antar topik obrolan dengan mudah.
- **Acceptance Criteria**:
  - [x] Menyimpan percakapan ke `localStorage` dengan skema `zyekh_companion_sessions` dan `zyekh_active_companion_session_id`.
  - [x] Otomatis membuat judul sesi dari cuplikan pesan pertama.
  - [x] Fitur pembuatan sesi baru (*New Chat*), penghapusan sesi (*Delete Session*), dan pembersihan obrolan aktif (*Clear Current Chat*).

### Feature Group 2: Interaktivitas & Dynamic Companion Experience
- **User Story**: Sebagai pengguna, saya ingin antarmuka obrolan yang responsif, menyajikan rekomendasi topik starter, serta indikator status pengetikan yang mulus.
- **Acceptance Criteria**:
  - [x] Starter suggestion cards pada layar awal (*Welcome Screen*) untuk inisiasi prompt instan.
  - [x] Auto-resizing textarea input (`max-height: 140px`) dengan penanganan keyboard `Enter` (kirim) dan `Shift+Enter` (baris baru).
  - [x] Indikator pengetikan animasi saat menunggu respon dari AI backend.
  - [x] Drawer navigasi mobile responsif untuk resolusi layar smartphone (`<= 768px`).

### Feature Group 3: Code Highlighting & Markdown Parser
- **User Story**: Sebagai pengembang, saya ingin potongan kode program dan format teks dirender dengan rapi serta dapat disalin dengan 1 klik.
- **Acceptance Criteria**:
  - [x] Parser regex internal mendukung blok kode (`pre code`), inline code, teks tebal, hyperlink, dan bullet point.
  - [x] Tombol interaktif *Copy to Clipboard* pada setiap blok kode dengan umpan balik visual (*Copied!*).

### Feature Group 4: Reverse Proxy & Omnichannel Embeddable Widget
- **User Story**: Sebagai pengelola sistem, saya ingin aplikasi dapat disematkan di domain lain dan mudah diakses melalui SSH Port Forwarding tanpa kendala CORS.
- **Acceptance Criteria**:
  - [x] Reverse proxy internal `/api/*` di `server.js` meneruskan request ke `http://127.0.0.1:3000`.
  - [x] Script mandiri `chat-widget.js` dapat disematkan di halaman web eksternal dengan konfigurasi multi-persona (`companion`, `tech_mentor`, `cloud_assistant`, `cs_store`).

---

## 4. Non-Functional Requirements & Security Rails
- **Accessibility (a11y)**: Semantic HTML5, kontras warna >= 4.5:1, dukungan navigasi keyboard penuh, atribut `aria-label` pada tombol ikon.
- **Security & Privacy**: Zero telemetry, tidak ada API key yang diekspos di sisi klien (*zero client-side credential leakage*).
- **Deployment & Hosting**: Mendukung GitHub Actions Pages deployment, static CNAME routing (`chat.zyekh.com`), serta bypass Jekyll (`.nojekyll`).
- **SPA Fallback**: Penyediaan `404.html` agar rute direct link pada GitHub Pages tidak menghasilkan broken page.

---

## 5. Machine-Verifiable Definition of Done (DoD)
- [x] 0 Syntax / Linter Errors pada `server.js` dan seluruh file JavaScript.
- [x] 0 Karakter Emoji grafis di seluruh codebase (terverifikasi via `check_emojis.py`).
- [x] File `.nojekyll` dan `404.html` tersedia di root direktori untuk GitHub Pages.
- [x] GitHub Actions automated deployment workflow aktif di `.github/workflows/deploy.yml`.
- [x] Dokumentasi standar (`GEMINI.md`, `DEVELOPMENT.md`, `PRD.md`) terintegrasi.
- [x] RAG Memory tersinkronisasi di Obsidian Vault (`00-AGY-Memory/chat-zyekh-com/`).
