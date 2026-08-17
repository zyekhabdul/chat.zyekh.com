# [ IDEAS ] chat.zyekh.com — Feature & Architecture Proposals

Berdasarkan arsitektur `chat.zyekh.com` (Zero-Framework, Vanilla JS, Local-First Multi-Session Storage, Express Proxy Port 3001), berikut usulan pengembangan fitur masa depan:

---

## 1. Context Persistence & Memory Intelligence
- [ PROPOSED ] **Client-Side Vector Memory (IndexedDB / SQLite-Wasm)**:
  - Menyimpan dan mengindeks seluruh riwayat obrolan secara semantik langsung di browser pengguna.
  - Memungkinkan pencarian riwayat obrolan dengan *fuzzy search* atau *semantic search* tanpa mengirim data ke server.

---

## 2. In-Browser Code Sandbox & Runner
- [ PROPOSED ] **Zero-Server Code Sandbox Execution**:
  - Menambahkan tombol "Run Code" pada blok kode JavaScript dan Python (via Pyodide WebWorker) di dalam jendela obrolan.
  - Pengguna dapat mengeksekusi dan menguji algoritma hasil diskusi langsung di antarmuka obrolan secara instan dan aman.

---

## 3. Dynamic Multi-Persona Preset Selector
- [ PROPOSED ] **UI Persona Switcher Bar**:
  - Menyediakan dropdown/tab cepat di navbar untuk berganti persona:
    • `Companion`: Teman santai, reflektif, dan brainstorming ide.
    • `Tech Mentor`: Arsitektur software, performa, dan zero-dependency.
    • `Cloud Assistant`: Navigasi dan pencarian file Google Drive 5TB.
    • `Savage Debugger`: Peninjau kode kritis dengan analisis mendalam.

---

## 4. Audio Voice Interaction
- [ PROPOSED ] **Web Speech API & Streaming Audio**:
  - Tombol mikrofon untuk *Speech-to-Text* langsung dari browser pengguna.
  - Audio synthesizer lokal untuk mendengarkan balasan AI.

---

## 5. Export & Knowledge Base Integration
- [ PROPOSED ] **One-Click Export to Obsidian Markdown & PDF**:
  - Fitur ekspor sesi obrolan langsung menjadi file format Obsidian Vault (`.md` dengan frontmatter YAML) atau PDF siap arsip.
