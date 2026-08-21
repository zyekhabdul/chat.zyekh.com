# RFC: Ecosystem Language Strategy & Global Distribution Blueprint (zyekh.com)

- **Status**: APPROVED / ACTIVE
- **Target**: `zyekh.com`, `chat.zyekh.com`, `shop.zyekh.com`, `zyekh.cloud`
- **Objective**: Maximum Global Virality, International Authority, and High-Conversion Domestic Reach.

---

## 1. Core Thesis & Strategic Architecture

### The Virality Bottleneck of Localized Sites
Mengunci landing page utama dalam Bahasa Indonesia membatasi jangkauan hanya ke pasar domestik (~0.5% pasar tech global) dan memblokir peluang viral di platform utama:
- **Product Hunt, Hacker News, Reddit (r/webdev, r/ArtificialInteligence), X/Twitter Tech**.
- **GitHub Stars & Global Open Source Contributors**.
- **Klien Remote & Investor Luar Negeri**.

### The "English-First Dual-Layer" Solution
1. **Layer 1 (Perception & Authority)**: Default UI & Copywriting 100% English (Stripe/Linear/Vercel standard).
2. **Layer 2 (Adaptive Utility)**: AI Core mendeteksi dan merespons bahasa user secara instan (auto-mirroring), didukung toggle switcher `[ EN | ID ]` di navbar.

---

## 2. Subdomain Architecture Matrix

| Subdomain | Default Language | Target Audience | Key Feature / Function |
| :--- | :--- | :--- | :--- |
| **`zyekh.com`** | English | Global Tech, Clients, Recruiter | Authority Hub, Personal Brand, Engineering Showcase, Ecosystem Index. |
| **`chat.zyekh.com`** | English UI + Multilingual AI | Global & Indonesian Users | Conversational AI Companion, Drive 5TB Portal, Instant Shared Chats (`/s/:id`). |
| **`shop.zyekh.com`** | English (USD / Multi-currency) | Global Creators & Merchants | High-Performance Liquid Themes, UI Kits, Developer Assets. |
| **`zyekh.cloud`** | English | Developers & DevOps Engineers | API Gateway, Microservice Docs, SDKs. |

---

## 3. Playbook: Cara Cepat Terkenal (Global & Domestik)

### A. The Global Virality Engine (English)
1. **GitHub "Trojan Horse"**:
   - Rilis open-source micro-tool (misal: widget chat ultra-ringan `chat-widget.js`, prompt caching engine, atau utility theme).
   - Buat README interaktif dengan badge, gif demo, dan link ke `chat.zyekh.com`.
2. **X / Twitter "Build in Public"**:
   - Posting video pendek/GIF: *"Built an ultra-fast AI chat with zero framework bloat & Cloudflare KV snapshot in <100ms TTFB"*.
   - Gunakan tagar #buildinpublic #indiehackers #webdev #ai.
3. **Show HN (Hacker News) & Product Hunt**:
   - Luncurkan `chat.zyekh.com` dengan angle: *"Fastest open conversational AI hub with zero-cookie serverless snapshots"*.

### B. The Domestic Growth Engine (Indonesia)
1. **Komunitas Telegram / WhatsApp / Discord**:
   - Bagikan studi kasus teknis dan solusi praktis (optimasi server, AI tooling).
2. **Bilingual Social Proof**:
   - Share link percakapan unik via fitur snapshot (`chat.zyekh.com/s/<id>`) ke grup lokal.

---

## 4. Technical Specification: Lightweight Micro-i18n

### A. Zero-Dependency Client Dictionary (`i18n.js`)
```javascript
export const translations = {
  en: {
    nav_chat: "AI Chat",
    nav_shop: "Theme Store",
    hero_title: "Next-Gen Intelligent AI Workspace",
    hero_desc: "Autonomous conversational platform powered by cutting-edge neural models.",
    btn_start: "Start Chatting",
    btn_share: "Share Conversation",
    status_online: "AI Engine Online"
  },
  id: {
    nav_chat: "AI Chat",
    nav_shop: "Toko Tema",
    hero_title: "Workspace AI Cerdas Generasi Baru",
    hero_desc: "Platform percakapan otonom bertenaga model neural mutakhir.",
    btn_start: "Mulai Percakapan",
    btn_share: "Bagikan Obrolan",
    status_online: "Mesin AI Aktif"
  }
};

export function applyLanguage(lang = 'en') {
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
  localStorage.setItem('zyekh_pref_lang', lang);
}
```

### B. AI Engine Auto-Mirror System Prompt Directive
```text
[LANGUAGE POLICY]
1. Automatically detect the primary language used in the user's latest message.
2. Respond fluently and naturally in the exact same language (e.g., Bahasa Indonesia for Indonesian prompts, English for English prompts).
3. Keep technical terminology, code snippets, and variable names in standard English.
```

---

## 5. SEO & Metadata Architecture (`hreflang` & OpenGraph)
```html
<title>Zyekh AI — Autonomous Intelligence & Conversational Platform</title>
<meta name="description" content="Next-generation AI workspace, high-performance themes, and engineering hub." />

<!-- Hreflang Canonical Tags -->
<link rel="alternate" hreflang="en" href="https://chat.zyekh.com/" />
<link rel="alternate" hreflang="id" href="https://chat.zyekh.com/?lang=id" />
<link rel="alternate" hreflang="x-default" href="https://chat.zyekh.com/" />

<!-- OpenGraph Global Tags -->
<meta property="og:title" content="Zyekh AI Platform" />
<meta property="og:description" content="Next-Gen Intelligent Workspace" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://chat.zyekh.com" />
```

---

## 6. Implementation Action Plan
1. **Step 1**: Pastikan semua UI copy default di `chat.zyekh.com` dan `zyekh.com` menggunakan English yang clean & punchy.
2. **Step 2**: Pasang toggle `[ EN | ID ]` di header `chat.zyekh.com` dan `zyekh.com`.
3. **Step 3**: Buat snapshot percakapan dan bagikan URL `/s/:id` ke channel komunitas untuk memicu viral loop.
