# RFC: OMNICHANNEL CHAT WIDGET ADAPTIVE THEME & CHAT RESET ENGINE

- **Target Repository**: `chat.zyekh.com` & `zyekh.com`
- **Target Files**: `chat-widget.js` -> `chat-widget.min.js`
- **Status**: `[ PROPOSED / READY FOR NEXT SESSION ]`
- **Author**: Antigravity AI Engine

---

## 1. Executive Summary & Problem Analysis

Berdasarkan audit visual pada screenshot terbaru pengguna (`Screenshot from 2026-08-21 15-03-26.png`), ditemukan 2 keterbatasan fungsional pada widget omnichannel saat ini:

### Issue A: Skema Warna Statis / Tidak Responsif Siang & Malam (Light/Dark Mode)
- **Gejala Visual**: Ketika website induk (`zyekh.com`) berada dalam **Mode Terang (Light Mode)** dengan latar putih, widget obrolan tetap terkunci pada warna gelap hardcoded (`#09090b`, `#141417`, `#fafafa`), menciptakan kontras visual yang terisolasi dan tidak harmonis.
- **Penyebab Teknis**: Seluruh token warna di dalam string CSS `chat-widget.js` menggunakan nilai heksadesimal statis tanpa abstraksi CSS Custom Properties (`var(--zw-...)`) dan tidak memiliki listener untuk perubahan atribut `data-theme="light|dark"` pada host.

### Issue B: Ketiadaan Tombol Reset / Pembersih Percakapan
- **Gejala Fungsional**: Pengguna tidak dapat membersihkan riwayat obrolan di dalam widget untuk memulai topik baru dari awal seperti pada versi aplikasi penuh `chat.zyekh.com`.
- **Penyebab Teknis**: Kontainer header widget (`.zyekh-chat-header-actions`) hanya memuat tombol *Expand App* (`<a>`) dan *Close* (`<button>`), tanpa tombol *Reset Action* yang terhubung ke endpoint `/api/chat/reset`.

---

## 2. Technical Blueprint & Architecture Design

### Part 1: Adaptive CSS Custom Properties & Dynamic Host Observer

#### 1. Tokenisasi Variabel CSS Scoped (`.zyekh-chat-window`)
Seluruh styling widget dialihkan ke variabel scoped independen agar tidak mencemari stylesheet global host:

```css
.zyekh-chat-window {
  --zw-bg: #09090b;
  --zw-bg-header: #141417;
  --zw-bg-bubble-user: #18181b;
  --zw-bg-bubble-bot: #141417;
  --zw-bg-input: #09090b;
  --zw-border: #27272a;
  --zw-text: #fafafa;
  --zw-text-muted: #a1a1aa;
  --zw-text-faint: #71717a;
  --zw-btn-bg: #fafafa;
  --zw-btn-text: #09090b;
  --zw-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  --zw-toggle-bg: #141417;
  --zw-toggle-color: #fafafa;
  --zw-toggle-border: #27272a;
}

/* Light Theme Variables */
[data-theme="light"] .zyekh-chat-window,
.zyekh-chat-window.theme-light {
  --zw-bg: #ffffff;
  --zw-bg-header: #f4f4f5;
  --zw-bg-bubble-user: #e4e4e7;
  --zw-bg-bubble-bot: #f4f4f5;
  --zw-bg-input: #ffffff;
  --zw-border: #e4e4e7;
  --zw-text: #09090b;
  --zw-text-muted: #52525b;
  --zw-text-faint: #71717a;
  --zw-btn-bg: #09090b;
  --zw-btn-text: #fafafa;
  --zw-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  --zw-toggle-bg: #ffffff;
  --zw-toggle-color: #09090b;
  --zw-toggle-border: #e4e4e7;
}
```

#### 2. Real-Time MutationObserver Host Listener
Agar widget langsung berganti warna ketika pengguna menekan tombol switch tema di navbar `zyekh.com` tanpa reload:

```javascript
function syncWidgetTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light' ||
    (!document.documentElement.getAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  
  if (isLight) {
    chatWindow.classList.add('theme-light');
    chatToggle.classList.add('theme-light');
  } else {
    chatWindow.classList.remove('theme-light');
    chatToggle.classList.remove('theme-light');
  }
}

// Inisialisasi awal
syncWidgetTheme();

// Observasi mutasi atribut data-theme
const themeObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === 'attributes' && m.attributeName === 'data-theme') {
      syncWidgetTheme();
    }
  }
});
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// Observasi perubahan preferensi OS
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', syncWidgetTheme);
}
```

---

### Part 2: In-Header Chat Reset & Clean Engine

#### 1. Penambahan Markup Tombol Refresh
Menambahkan tombol aksi reset di samping tombol expand dan close:

```html
<div class="zyekh-chat-header-actions">
  <button class="zyekh-chat-action-btn zyekh-chat-reset" id="zyekhChatReset" aria-label="Bersihkan Percakapan" title="Bersihkan Percakapan">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
      <path d="M21 3v5h-5"></path>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
      <path d="M8 16H3v5"></path>
    </svg>
  </button>
  <a href="https://chat.zyekh.com/?utm_source=widget_expand" target="_blank" rel="noopener" class="zyekh-chat-action-btn" title="Buka Aplikasi Penuh">
    <!-- SVG Expand -->
  </a>
  <button class="zyekh-chat-action-btn zyekh-chat-close" aria-label="Tutup Obrolan">
    <!-- SVG Close -->
  </button>
</div>
```

#### 2. Logika Pembersihan Memori & Reset UI
```javascript
async function resetWidgetChat() {
  // 1. Bersihkan kontainer UI
  messagesContainer.innerHTML = '';

  // 2. Beri tahu backend untuk menghapus context memori sesi
  try {
    fetch(`${apiBase}/api/chat/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: userId, persona: activePersona, channel: 'web' })
    }).catch(() => {});
  } catch (e) {}

  // 3. Tampilkan kembali sapaan awal sesuai persona
  renderInitialGreeting();
  chatInput.value = '';
  chatInput.focus();
}
```

---

## 3. Checklist Eksekusi Sesi Berikutnya

- [ ] Update `chat.zyekh.com/chat-widget.js` dengan CSS custom properties, MutationObserver, dan tombol reset.
- [ ] Kompilasi ulang ke `zyekh.com/assets/js/chat-widget.min.js` (Terser).
- [ ] Bump Service Worker cache `CACHE_VERSION` di `zyekh.com/sw.js` dan query string di `index.html`.
- [ ] Deploy container `chat-zyekh-com-2yrzqt` dan Cloudflare Pages `zyekh-com.pages.dev`.
- [ ] Purge CDN cache dan lakukan verifikasi empiris.
