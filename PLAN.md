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

---

## Phase 8: Industry Standard Capsule Starter Pills & Clean Hero Evolution (`[ DONE ]`)

### Chunk 8.1: Clean Capsule Starter Pills CSS Architecture (`[ DONE ]`)
- **Target Files**: [assets/css/app.css](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/css/app.css)
- **Scope**:
  - Replaced heavy bento cards with responsive horizontal capsule pills.
- **DoD**: 0 CSS errors, vertical space reduced by 75%.

### Chunk 8.2: Streamlined Starter Pills Rendering & I18N Schema (`[ DONE ]`)
- **Target Files**: [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Implemented sleek capsule buttons and prompt dispatch.
- **DoD**: 1-click prompt execution functional.

### Chunk 8.3: Cache Query String Bumping (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html)
- **Scope**:
  - Bumped stylesheet query to `app.css?v=20260821_v407` and script query to `app.js?v=20260821_v446`.
- **DoD**: Cache strings updated.

### Chunk 8.4: Empirical Verification, Docker Rebuild & RAG Checkpoint (`[ DONE ]`)
- **Target Files**: Local Git Tree, Obsidian Vault Memory
- **Scope**:
  - Verified 0 emoji, 0 syntax error, container converged, commit `a420db9` pushed.
- **DoD**: Exit code 0 on all commands.

---

## Phase 9: Multi-Category Interactive Starter Tabs & Universal Onboarding Architecture (`[ DONE ]`)

### Chunk 9.1: Multi-Category Segment Tabs CSS Architecture (`[ DONE ]`)
- **Target Files**: [assets/css/app.css](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/css/app.css)
- **Scope**:
  - Implemented `.starter-tabs-nav` segmented control container.
- **DoD**: Responsive tab bar functional.

### Chunk 9.2: Multi-Category Schema & Interactive Tab Switcher Engine (`[ DONE ]`)
- **Target Files**: [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Expanded `I18N_DICT` with 4 structured categories (General, Creative, Research, Dev).
- **DoD**: Instant 0ms category switching across 4 segments.

### Chunk 9.3: Cache Version Bumping & HTML Verification (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html)
- **Scope**:
  - Bumped stylesheet query to `app.css?v=20260821_v408` and script query to `app.js?v=20260821_v447`.
- **DoD**: Cache strings incremented.

### Chunk 9.4: Empirical Verification, Docker Rebuild & Local Commit Checkpoint (`[ DONE ]`)
- **Target Files**: Local Git Tree, Obsidian Vault Memory
- **Scope**:
  - Verified 0 emoji, 0 syntax error, container converged, commit `3ae7980` pushed.
- **DoD**: Exit code 0 on all tests.

---

## Phase 10: Segmented Control Dock vs Interactive Action Cards Distinction (`[ DONE ]`)

### Chunk 10.1: Segmented Dock & Action Card Grid CSS Overhaul (`[ DONE ]`)
- **Target Files**: [assets/css/app.css](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/css/app.css)
- **Scope**:
  - Refactored `.starter-tabs-nav` into a single cohesive pill dock and prompt cards into a 2x2 grid with interactive arrows.
- **DoD**: 100% visual differentiation achieved.

### Chunk 10.2: Prompt Card Markup & Template Alignment in JS (`[ DONE ]`)
- **Target Files**: [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Updated `renderWelcomeScreen()` with `.starter-pill-content` and `.starter-pill-arrow`.
- **DoD**: Cards render cleanly with action arrows.

### Chunk 10.3: Cache Query String Bumping (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html)
- **Scope**:
  - Bumped stylesheet query to `app.css?v=20260821_v409` and script query to `app.js?v=20260821_v448`.
- **DoD**: Cache strings incremented cleanly.

### Chunk 10.4: Empirical Verification, Docker Rebuild & Direct Remote Push (`[ DONE ]`)
- **Target Files**: Local Git Tree, Remote Repositories (`origin`, `gitlab`)
- **Scope**:
  - Pushed to remote repositories (commit `4479abb`).
- **DoD**: Remote push completed and live on Cloudflare.

---

## Phase 11: Elimination of Terminal Bracket Syntax & Consumer Polish Standard (`[ DONE ]`)

### Chunk 11.1: Removal of Brackets in Prompt Starters & Toasts (JS Layer) (`[ DONE ]`)
- **Target Files**: [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Removed bracket prefixes from starter prompts and all toast messages.
- **DoD**: 0 bracket tokens in starter cards and toasts.

### Chunk 11.2: Modal Header Badges & Keyboard Hints HTML Standardization (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html), [assets/css/app.css](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/css/app.css)
- **Scope**:
  - Converted modal badges to clean uppercase and input hints to `<kbd>`.
- **DoD**: Semantics and styling updated.

### Chunk 11.3: Cache Version Bumping (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html)
- **Scope**:
  - Bumped to `app.css?v=20260821_v410` and `app.js?v=20260821_v449`.
- **DoD**: Cache strings incremented.

### Chunk 11.4: Empirical Verification, Docker Rebuild & Remote Push (`[ DONE ]`)
- **Target Files**: Local Git Tree, Remote Repositories (`origin`, `gitlab`)
- **Scope**:
  - Verified 0 errors and pushed commit `3b39f1d`.
- **DoD**: Live on Cloudflare edge.

---

## Phase 12: Responsive Mobile 1-Row Category Dock with Compact Labels (Option A) (`[ DONE ]`)

### Chunk 12.1: Dual-Label Dictionary & Template Update in JS (`[ DONE ]`)
- **Target Files**: [assets/js/app.js](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/js/app.js)
- **Scope**:
  - Added short label keys and updated `renderWelcomeScreen()` markup.
- **DoD**: Dual labels rendered cleanly.

### Chunk 12.2: Responsive Dock CSS (Desktop Inline-Flex vs Mobile 4-Column Grid) (`[ DONE ]`)
- **Target Files**: [assets/css/app.css](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/css/app.css)
- **Scope**:
  - Configured 4-column responsive grid on mobile viewports.
- **DoD**: 0 horizontal scrolling on mobile viewports.

### Chunk 12.3: Cache Version Bumping (`[ DONE ]`)
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html)
- **Scope**:
  - Bumped to `app.css?v=20260821_v411` and `app.js?v=20260821_v450`.
- **DoD**: Cache versions incremented.

### Chunk 12.4: Empirical Verification, Docker Rebuild & Direct Remote Push (`[ DONE ]`)
- **Target Files**: Local Git Tree, Remote Repositories (`origin`, `gitlab`)
- **Scope**:
  - Verified and pushed commit `a9d6d65`.
- **DoD**: Live on Cloudflare edge.

---

## Phase 13: Category Dock Border-Radius Harmonization (Geometric Corner Rhythm) (`[ IN_PROGRESS ]`)

### Chunk 13.1: Harmonize Dock and Tab Button Border Radii
- **Target Files**: [assets/css/app.css](file:///home/fuckadmin/Projects/chat.zyekh.com/assets/css/app.css)
- **Scope**:
  - Change `.starter-tabs-nav` from `border-radius: var(--radius-full)` to `border-radius: var(--radius-md)` (8px).
  - Change `.starter-tab-btn` from `border-radius: var(--radius-full)` to `border-radius: var(--radius-sm)` (6px).
  - Update mobile `@media (max-width: 520px)` to use `border-radius: var(--radius-md)`.
- **DoD**: 100% geometric corner harmony with prompt cards (8px), navbar buttons (8px), and input bar (12px).

### Chunk 13.2: Cache Version Bumping
- **Target Files**: [index.html](file:///home/fuckadmin/Projects/chat.zyekh.com/index.html), [404.html](file:///home/fuckadmin/Projects/chat.zyekh.com/404.html)
- **Scope**:
  - Bump stylesheet query to `app.css?v=20260821_v412`.
  - Bump script query to `app.js?v=20260821_v451`.
- **DoD**: Cache versions incremented cleanly.

### Chunk 13.3: Empirical Verification, Docker Rebuild & Direct Remote Push
- **Target Files**: Local Git Tree, Remote Repositories (`origin`, `gitlab`)
- **Scope**:
  - Verify syntax and 0 emoji.
  - Rebuild docker image and update service.
  - Commit and push to remotes.
- **DoD**: Remote push completed, verified on live edge.
