# PLAN.md — CHAT.ZYEKH.COM SEO & GROWTH MASTER ENGINE

## Master Status: ALL 6 PHASES COMPLETE (`[ COMPLETED ]`)

---

## Phase 1: Technical SEO Baseline & Schema.org Graph (`[ DONE ]`)
- `sitemap.xml`: W3C XML Sitemap deployed with daily change frequency.
- `robots.txt`: Permissive search engine crawler policy pointing to sitemap.
- `index.html` & `404.html`: Rich Schema.org JSON-LD `@graph` (`WebApplication`, `SoftwareApplication`, `FAQPage`, `Person` author).
- Open Graph, Twitter Social Cards, and canonical URL enforcement.

---

## Phase 2: Omnichannel Widget Backlink Flywheel (`[ DONE ]`)
- `chat-widget.js`: Embedded 14KB script passing permanent contextual SEO backlink to `https://chat.zyekh.com/?utm_source=widget`.
- Deep-Link Header Action: Quick-expand into full web app at `chat.zyekh.com`.
- Embed Integration Modal (`#widgetModal`): 1-click persona configuration and embed code generator for external site owners.

---

## Phase 3: Programmatic SEO (P-SEO) via Shared Snapshots (`[ DONE ]`)
- `server.js`: `/api/share` POST endpoint saving JSON transcripts to isolated `data/shares/` storage.
- Dynamic SSR Route (`/s/:id` & `/share/:id`): Prerendered static HTML with Schema.org `QAPage` structured data for search engine long-tail indexing.
- 1-Click Import: Visitors on shared links can continue discussions directly in their local app session.
- Frontend Share Dialog (`#shareModal`): 1-click snapshot creation and URL copying.

---

## Phase 4: Developer Community Launches & Ecosystem Synergy (`[ DONE ]`)
- **Ecosystem Cross-Linking**: `zyekh.com` updated with `AI Companion` quick-tool pill and footer links.
- **Widget Integration**: `zyekh.com` upgraded to use the latest 14KB widget with SEO backlink attribution.
- **Launch Kit Ready**: `COMMUNITY_LAUNCH_KIT.md` containing Show HN pitch, Dev.to/Medium engineering article draft, and Reddit distribution blueprints.

---

## Phase 5: Global Growth & Open-Source Showcase (`[ DONE ]`)

### Chunk 5.1: Open-Source GitHub Showcase Integration (`[ DONE ]`)
- Added GitHub Repository action button with SVG icon to `.navbar-actions` linking to `https://github.com/zyekhabdul/chat.zyekh.com`.
- Added `OPEN SOURCE` badge to `.sidebar-header`.

### Chunk 5.2: Global English UI & Multi-Language Ingestion (`[ DONE ]`)
- Standardized UI chrome (New Chat, Search conversations, Export, Share, Theme, Clear, Profile modal, Embed modal, WebGPU modal) to clean English.
- Upgraded starter suggestion prompts to high-value English developer prompts while maintaining automatic multi-language AI responses.
- Set `<html lang="en">` with English meta descriptions and Open Graph tags.

### Chunk 5.3: Schema.org & Programmatic SEO Alignment (`[ DONE ]`)
- Updated Schema.org `@graph` JSON-LD descriptions and FAQ items to English.
- Aligned SSR shared chat templates (`/s/:id` and `/share/:id`) with English actions.

### Chunk 5.4: Empirical Quality Gate & Local Checkpoint (`[ DONE ]`)
- Bumped cache query strings (`app.css?v=20260821_v402`, `app.js?v=20260821_v442`).
- Terminal verification passed with 0 emoji violations and 0 syntax errors.
- Local commit created and Obsidian RAG memory synchronized.

---

## Phase 6: Micro-i18n Dual-Layer Switcher & Hreflang SEO Tags (`[ DONE ]`)

### Chunk 6.1: SEO Hreflang Tags & Navbar Language Toggle UI (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html)
- **Scope**:
  - Added SEO `<link rel="alternate" hreflang="en" ...>`, `<link rel="alternate" hreflang="id" ...>`, and `x-default` canonical tags to `<head>` as specified in RFC Section 5.
  - Added language switcher toggle `<button class="btn-action" id="btnLangToggle" type="button" title="Switch Language (English / Bahasa Indonesia)" aria-label="Switch Language"><span id="activeLangTag">EN</span></button>` in `.navbar-actions`.
- **DoD**: Markup validated, button visible and responsive across all viewports.

### Chunk 6.2: Zero-Dependency Client Micro-i18n Engine (`[ DONE ]`)
- **Target Files**: [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Implemented zero-dependency dictionary (`I18N_DICT = { en: {...}, id: {...} }`) covering all UI chrome, placeholder texts, hints, modal headers, starter prompt cards, and toast notifications.
  - Implemented `applyLanguage(lang)` function with automatic `localStorage.setItem('zyekh_pref_lang', lang)` and URL query parameter detection (`?lang=id`).
  - Wired `#btnLangToggle` click listener to toggle seamlessly between `en` and `id` without full page reload.
  - Dynamically re-renders welcome screen suggestion cards and history list on language change.
- **DoD**: Instant language toggling without page reload, zero dependencies added.

### Chunk 6.3: Empirical Quality Gate & Local Checkpoint (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html), Obsidian Vault
- **Scope**:
  - Bumped cache query strings (`app.css?v=20260821_v403`, `app.js?v=20260821_v443`).
  - Terminal verification passed with 0 emoji violations and 0 syntax errors.
  - Local commit created and Obsidian RAG memory synchronized.
- **DoD**: 0 emojis, 0 syntax errors, local commit created.

---

## Phase 7: Viral Engine & Interactive Layout Evolution (`[ DONE ]`)

### Chunk 7.1: Viral Starter Bento Cards & Copywriting (`[ DONE ]`)
- **Target Files**: [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Replaced academic starters with 4 high-virality action cards: `[ ROAST MODE ]` (Architecture & Tech Stack roast), `[ ASCII BLUEPRINT ]` (Visual ASCII terminal architecture), `[ ZERO-BLOAT ]` (Dependency stripping), `[ BENCHMARK ]` (Multi-model reasoning challenge).
  - Translated dynamically into English and Indonesian via `I18N_DICT`.
- **DoD**: 4 interactive viral starters functional across EN/ID without page reload.

### Chunk 7.2: Native HTML5 Canvas Visual Card Exporter (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html), [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Implemented 100% client-side 1200x630 Canvas 2D card renderer generating high-resolution PNG snapshots with terminal title bar, model tag badge, auto-wrapped typography, and local-first privacy footer.
  - Added `Card` action button to bot messages opening `#cardModalBackdrop`.
  - Implemented 1-click clipboard PNG copying and PNG file download.
- **DoD**: AI responses exportable as Ray.so/Carbon-style visual cards with 0 external dependencies.

### Chunk 7.3: 1-Click Social Intent Sharing Buttons (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html), [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Integrated 1-click intent share buttons (`Post to X`, `Telegram`, `Threads`) into `#shareModal`.
  - Dynamically encodes share snapshot URLs into social platform intents.
- **DoD**: Instant sharing to social networks in 1 click without manual URL copy-pasting.

### Chunk 7.4: Viral Referral Backlink on Embed Widget (`[ DONE ]`)
- **Target Files**: [chat-widget.js](file:///home/fuckadmin/Projects/chat.zyekh.com/chat-widget.js)
- **Scope**:
  - Upgraded embed widget footer attribution with organic backlink referral `utm_source=embed_widget&utm_medium=viral_referral&utm_campaign=open_source`.
- **DoD**: All external sites embedding the widget pass organic referral traffic to `chat.zyekh.com`.

### Chunk 7.5: Empirical Verification & Checkpoint (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html), Obsidian Memory
- **Scope**:
  - Bumped cache query strings (`app.css?v=20260821_v405`, `app.js?v=20260821_v444`).
  - Terminal verification passed with 0 emoji violations and 0 syntax errors.
  - Local commit and Obsidian RAG memory synchronized.
- **DoD**: 0 syntax errors, 0 emojis, local commit created.
