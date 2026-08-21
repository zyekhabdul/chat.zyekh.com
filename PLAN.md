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
