# [ IDEAS ] chat.zyekh.com — Feature & Architecture Proposals

Berdasarkan arsitektur `chat.zyekh.com` (Zero-Framework, Vanilla JS, Local-First Multi-Session Storage, Express Proxy Port 3001), berikut usulan pengembangan fitur masa depan termasuk adopsi kapabilitas kelas dunia seperti Claude (Anthropic):

---

## 1. Claude-Style Artifacts Canvas Engine
- [ PROPOSED ] **Side-by-Side Live Interactive Canvas**:
  - Panel drawer di sisi kanan antarmuka obrolan untuk memisahkan output substansial (kode, dokumen panjang, UI mockup, diagram) dari gelembung percakapan.
  - **Live Code Execution**: Dukungan syntax highlighting, copy-to-clipboard, dan eksekusi instan JS / Python via Pyodide WebWorker.
  - **Live HTML/CSS/SVG Sandbox**: Render preview halaman web interaktif atau grafik SVG langsung di dalam iframe terisolasi.
  - **Mermaid Architecture Diagrams**: Render otomatis diagram alur sistem dan sequence diagram.
  - **Artifact Versioning**: Navigasi riwayat perubahan artefak (v1, v2, v3) dengan opsi download atau export.

---

## 2. Extended Thinking / Reasoning Trace (Transparent CoT)
- [ PROPOSED ] **Collapsible `<thought>` Reasoning Drawer**:
  - Menampilkan rantai penalaran (*Chain-of-Thought*) AI sebelum memberikan respon akhir dalam elemen accordion lipat.
  - Memberikan transparansi penuh bagi pengguna untuk memverifikasi logika analisis, rencana penyelesaian masalah, dan evaluasi alternatif secara terstruktur.

---

## 3. Projects & Scoped Knowledge Bases (Project Memory)
- [ PROPOSED ] **Isolated Project Workspaces**:
  - Memungkinkan pengguna membuat "Projects" dengan instruksi khusus (*Custom System Prompt*) dan dokumen pengetahuan terikat.
  - **Client-Side Document Ingestion**: Parsing PDF, TXT, MD, CSV, dan source code lokal langsung di browser pengguna tanpa mengirim file mentah ke server eksternal.
  - **Local-First Vector Indexing**: Pengindeksan dokumen via IndexedDB / SQLite-Wasm untuk retrieval berbasis kemiripan semantik.

---

## 4. Conversation Branching & In-Place Prompt Edit
- [ PROPOSED ] **Message Forking & Prompt Iteration**:
  - Tombol edit pada setiap prompt pengguna untuk merevisi pertanyaan dan me-regenerasi jawaban.
  - Navigasi cabang obrolan (`< 1/2 >`) yang mempertahankan seluruh pohon percakapan tanpa menghapus riwayat sebelumnya.

---

## 5. Model Context Protocol (MCP) & Local Tool Invocation
- [ PROPOSED ] **Browser & Local System Tool Suite**:
  - Integrasi klien ke endpoint MCP lokal (Obsidian RAG, pencarian file sistem lokal, dan Web Search).
  - Eksekusi pemanggilan tool secara transparan dengan badge status (`[ TOOL: search_notes ]`, `[ EXECUTING ]`, `[ DONE ]`).

---

## 6. Adaptive Tone & Output Style Controls
- [ PROPOSED ] **Quick Tone & Conciseness Selector**:
  - Slider/dropdown penyesuaian gaya balasan per sesi:
    • `Concise / Caveman`: Jawaban ringkas, to the point, padat nilai teknis.
    • `Explanatory / Mentor`: Pembahasan mendalam, step-by-step reasoning.
    • `Code-First`: Prioritas kode fungsional dan minim basa-basi.
    • `Companion / Reflective`: Nada santai, empatik, dan eksploratif.

---

## 7. Context Persistence & Memory Intelligence
- [ PROPOSED ] **Client-Side Vector Memory (IndexedDB / SQLite-Wasm)**:
  - Menyimpan dan mengindeks seluruh riwayat obrolan secara semantik langsung di browser pengguna.
  - Memungkinkan pencarian riwayat obrolan dengan *fuzzy search* atau *semantic search* tanpa ketergantungan server cloud.

---

## 8. Audio Voice Interaction
- [ PROPOSED ] **Web Speech API & Streaming Audio**:
  - Tombol mikrofon untuk *Speech-to-Text* langsung dari browser pengguna.
  - Audio synthesizer lokal untuk mendengarkan balasan AI secara alami.

---

## 9. Export & Knowledge Base Integration
- [ PROPOSED ] **One-Click Export to Obsidian Markdown & PDF**:
  - Fitur ekspor sesi obrolan atau artefak langsung menjadi file format Obsidian Vault (`.md` dengan frontmatter YAML) atau PDF siap arsip.

---

## 10. Mobile App & App Store Distribution (PWA / TWA / Capacitor)
- [ PROPOSED ] **Trusted Web Activity (TWA) / Google Play Store APK**:
  - Mengemas `chat.zyekh.com` menjadi Android App Bundle (`.aab` / `.apk`) resmi via Google Bubblewrap / TWA tanpa overhead framework native yang berat.
  - Memanfaatkan Service Worker & Web App Manifest (`manifest.json`) untuk performa native-like, zero-lag launch, dan update otomatis tanpa perlu update berkala dari store.
  - **Offline Resilience**: Cache shell UI dan local memory storage (IndexedDB) agar obrolan offline tetap dapat dibuka.
  - **Native Features**: Push Notifications untuk AI responses/reminders, Web Share Target, dan ikon badge di launcher pengguna.
  - **Apple App Store & iOS Strategy**: PWA Home-Screen install banner dengan iOS splash screens, atau Capacitor wrapper untuk integrasi Apple Store compliance.
