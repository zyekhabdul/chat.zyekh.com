# RFC: Automated Testing, I18N Parity, SEO Validation & Quality Assurance Suite

- **RFC Number**: RFC-003
- **Status**: PROPOSED (Awaiting Human Approval)
- **Target Repository**: `chat.zyekh.com`
- **Scope**: Developer Tooling, CI/CD Quality Gates, Automated E2E Testing, I18N Parity, Schema Validator, Asset Budgets

---

## 1. Data-Backed Rationale (Why)

### A. Empirical Audit Findings
1. **I18N Dictionary Drift**:
   - `assets/js/app.js` menggunakan dictionary terisolasi `I18N_DICT = { en: {...}, id: {...} }`.
   - Seiring bertambahnya fitur, penambahan key baru pada salah satu bahasa tanpa validasi otomatis dapat menyebabkan nilai `undefined` pada UI, tombol tanpa teks, atau kegagalan interpolasi template string (`{name}`, `{model}`).
2. **Interactive UI Regression Vulnerability**:
   - Skrip pengujian saat ini (`snap_viewports.py`) hanya memvalidasi dimensi layout dan deteksi *horizontal overflow*.
   - Alur interaktif penting (pergantian model AI via dropdown, pergantian bahasa EN/ID, pengiriman prompt starter, pembukaan modal profil, dan clipboard copying) belum memiliki regression testing terotomatisasi.
3. **Schema.org & SEO Validation Overhead**:
   - Structured data JSON-LD `@graph` pada `index.html`, `404.html`, dan dynamic SSR `/s/:id` (`QAPage`, `WebApplication`, `FAQPage`) membutuhkan validasi sintaksis dan integritas entitas secara otomatis sebelum rilis produksi.
4. **Asset Budget Enforcement (Ponytail / YAGNI Principle)**:
   - Tanpa *hard budget assertion*, mutasi kode berkelanjutan berisiko menambah ukuran file melebihi batas performa optimal (< 50KB CSS, < 90KB JS, < 25KB Widget).

---

## 2. Impact & Risk Assessment

### A. Value & Performance Benefits
- **Zero-Friction Verification**: AI Agent dan developer dapat memvalidasi 100% fungsionalitas sistem (sintaks, emoji, i18n, E2E, SEO, asset budget) dalam < 5 detik via `npm test`.
- **Eliminasi Human Regression**: Menghilangkan kemungkinan rilis yang merusak navigasi, dictionary, atau structured data SEO.
- **Empirical Gate Compliance**: Memenuhi mandat global rule `empirical-verification.md` dengan bukti empiris terminal (exit code 0).

### B. Risk Assessment & Mitigations
- **Breaking Risk**: 0% (Hanya menambah skrip validator dan testing di `scripts/`, tidak mengubah logika inti frontend atau backend).
- **Execution Overhead**: Ringan (Playwright headless tests dan Python linters dirancang untuk selesai dalam rentang 2-4 detik).

---

## 3. Modular Specification & Execution Blueprint

### Component 1: `scripts/lint_i18n_parity.py` (I18N Parity Linter)
- **Fungsi**: Memverifikasi dictionary `I18N_DICT` di `assets/js/app.js`:
  - Kesamaan jumlah dan identitas key antara `en` dan `id`.
  - Kesamaan parameter placeholder (`{name}`, `{model}`, `{err}`).
  - Kesamaan struktur array `starters` per kategori (`general`, `creative`, `research`, `dev`).
- **DoD**: Exit code 0 jika kedua bahasa sinkron 100%.

### Component 2: `scripts/test_e2e_flow.py` (Headless Core Interaction Test)
- **Fungsi**: Menjalankan pengujian interaksi berbasis Playwright headless:
  - Buka halaman web lokal `http://localhost:3001` atau `index.html`.
  - Test 1: Language Switcher toggle (EN -> ID -> EN) dan verifikasi perubahan teks UI.
  - Test 2: Model Selector dropdown open & select (verifikasi perubahan label & active class).
  - Test 3: Starter Card click (verifikasi input terisi dan prompt terkirim).
  - Test 4: Modal open/close lifecycle (Profile Modal, Embed Modal, Card Modal).
- **DoD**: Seluruh 4 skenario interaktif lulus dengan exit code 0.

### Component 3: `scripts/validate_schema_seo.py` (Structured Data & Meta Auditor)
- **Fungsi**: Mengekstrak dan memvalidasi JSON-LD dari `index.html`, `404.html`, dan endpoint SSR `/s/:id`:
  - Memverifikasi `@context: "https://schema.org"`.
  - Memverifikasi keberadaan tipe wajib: `WebApplication`, `FAQPage`, `QAPage`, `Person`.
  - Memverifikasi Canonical link, meta robots, dan Hreflang alternates (`en`, `id`, `x-default`).
- **DoD**: Validasi JSON-LD dan meta tags mengembalikan 0 error.

### Component 4: `scripts/check_asset_budgets.py` (Asset Size Budget Watcher)
- **Fungsi**: Memeriksa ukuran file aset statis terhadap batas maksimal:
  - `assets/css/app.css` <= 50,000 bytes.
  - `assets/js/app.js` <= 90,000 bytes.
  - `chat-widget.js` <= 25,000 bytes.
  - `assets/js/chat-widget.min.js` <= 20,000 bytes.
- **DoD**: Exit code 0 jika seluruh aset berada di bawah batas budget.

### Component 5: Unified Pipeline Integrations (`package.json`)
- Konfigurasi perintah NPM:
  ```json
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "lint": "python3 scripts/lint_design_rules.py",
    "lint:i18n": "python3 scripts/lint_i18n_parity.py",
    "test:seo": "python3 scripts/validate_schema_seo.py",
    "test:e2e": "python3 scripts/test_e2e_flow.py",
    "test:budget": "python3 scripts/check_asset_budgets.py",
    "test": "npm run lint && npm run lint:i18n && npm run test:seo && npm run test:budget && npm run snap && npm run test:e2e",
    "bump": "node scripts/bump_assets.js",
    "snap": "python3 scripts/snap_viewports.py",
    "release": "bash scripts/release.sh"
  }
  ```

---

## 4. RAG Decision Recording
- **Jika Disetujui**: Ditambahkan ke `PLAN.md` (Phase 19) dan diimplementasikan secara batch sesuai aturan Hyper-Granular Chunking.
- **Jika Ditolak**: Alasan penolakan dicatat ke `00-AGY-Memory/chat-zyekh-com/DECISIONS.md`.
