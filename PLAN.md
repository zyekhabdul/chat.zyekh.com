# PLAN.md — OPTION B ADVANCED UX & PARITY ENHANCEMENTS

## Objective
Implement Option B advanced UX and design system parity enhancements for `chat.zyekh.com`, adhering strictly to `zyekh.com` design standards, zero-emoji policy, and minimalist architecture.

---

## Execution Chunks

### Chunk 1: Rich Markdown Parser & Code Block Language Header
- **Scope**: `assets/js/app.js`
- **Details**:
  - Tables: Convert markdown tables (`| col1 | col2 |`) into semantic HTML `<table>` elements.
  - Callouts: Convert blockquotes (`> text`) into `<div class="callout"><p>text</p></div>`.
  - Headings: Convert `###`, `##`, `#` into clean `<h3>`, `<h2>`, `<h4>` elements.
  - Code Block Headers: Extract language identifier (e.g., `BASH`, `PYTHON`, `JS`), wrap in `.code-block-wrapper` with `.code-block-header` containing `.code-lang` badge and `.copy-code-btn`.
- **DoD**: All markdown constructs render into valid HTML elements, `node -c assets/js/app.js` exits with 0.

### Chunk 2: Pure Monochrome Toast Notification System
- **Scope**: `assets/css/app.css` & `assets/js/app.js`
- **Details**:
  - Styles: `.toast-container` and `.toast` with pure monochrome zinc tokens (`#141417`, `#27272a`, `#fafafa`), smooth transition.
  - Logic: `showToast(message)` helper with auto-dismiss (2200ms).
  - Triggers: Code copied (`[ VERIFIED ] Kode berhasil disalin`), Chat cleared (`[ INFO ] Obrolan telah dibersihkan`), Session deleted (`[ INFO ] Sesi obrolan dihapus`), New session created (`[ INFO ] Sesi baru siap digunakan`).
- **DoD**: Toast component displays and auto-dismisses smoothly on user actions.

### Chunk 3: Sidebar Session Search & Filter Bar
- **Scope**: `index.html`, `404.html`, `assets/css/app.css`, `assets/js/app.js`
- **Details**:
  - DOM: Add `#sessionSearchInput` search bar inside sidebar.
  - Logic: Real-time search filtering across session titles in `renderHistoryList()`. Empty state message when 0 matches found.
  - Styles: Compact zinc input matching `shared.css`.
- **DoD**: Filtering works instantaneously, replicated identically in `404.html`.

### Chunk 4: Input Microcopy & Keyboard Hints
- **Scope**: `index.html`, `404.html`, `assets/css/app.css`
- **Details**:
  - DOM: Add `.chat-input-hints` under the chat form (`[ Enter ] Kirim • [ Shift + Enter ] Baris Baru`).
  - Styles: Subtle font styling with `var(--text-faint)`, auto-hidden on mobile screens (`<= 640px`).
- **DoD**: Microcopy visible on desktop and hidden on mobile.

### Chunk 5: Table & Callout CSS Presentation
- **Scope**: `assets/css/app.css`
- **Details**:
  - Add rules for `.message-content table`, `th`, `td`, `.callout`, `.code-block-wrapper`, `.code-block-header`, `.code-lang`.
  - Maintain `min-width: 0` grid/flex blowout prevention.
- **DoD**: Tables, callouts, and code blocks render with crisp zinc styling without breaking responsive layouts.

### Chunk 6: Verification & Final Quality Gate
- **Scope**: Codebase
- **Details**:
  - Execute `python3 check_emojis.py` (0 emojis).
  - Validate syntax for all JS/HTML files.
  - Bump cache versions to `?v=20260821_v303`.
  - Create checkpoint commit.
- **DoD**: All tests pass with exit code 0.
