# PLAN.md — CHAT.ZYEKH.COM MODERNIZATION (MULTI-MODEL & USER CUSTOMIZATION)

## Objective
Implement dynamic multi-model AI switching, user profile customization (Avatar / PP, Display Name, Custom System Prompt), thought reasoning accordions, and session markdown export for `chat.zyekh.com` while maintaining zero runtime framework dependencies, zero emoji violations, and sub-200ms latency.

---

## Execution Chunks

### Chunk 1: Dynamic Model Switcher Component
- **Target Files**: `index.html` (lines ~125-148), `404.html`, `assets/css/app.css`, `assets/js/app.js`
- **Implementation Steps**:
  1. Add `#modelSelectorWrap` in navbar containing a styled model selector button with active model badge (`#currentModelBadge`), dropdown panel (`#modelDropdownList`), and capability pills (`[ Reasoning ]`, `[ Fast ]`, `[ Coding ]`).
  2. In `app.js`, fetch models via `GET ${API_BASE}/api/models`. Fallback to local default list if offline.
  3. Store selected model ID in `localStorage.getItem('zyekh_active_model')` (default: `gemini-3.7-flash-high`).
  4. Pass `model: activeModelId` inside `POST ${API_BASE}/api/chat` payload.
  5. Add badge indicators on assistant message rows showing which model generated the reply.
- **DoD**: Model selector dropdown renders all 6 models, updates state instantly, and sends selected model ID in chat payload.

### Chunk 2: User Profile & Avatar (PP) Customization Modal
- **Target Files**: `index.html`, `404.html`, `assets/css/app.css`, `assets/js/app.js`
- **Implementation Steps**:
  1. Add `#btnProfileToggle` in navbar and sidebar footer showing user avatar thumbnail and display name.
  2. Create `#profileModal` with form:
     - Display Name input (`#profileNameInput`, default: "User").
     - Avatar Picker: Preset SVG cyberpunk avatars, initial letter avatar, or custom image URL input.
     - Custom System Instructions (`#profileInstructionsInput`, e.g. "Jawab ringkas dan to the point").
  3. Store profile in `localStorage.getItem('zyekh_user_profile')`.
  4. Render custom user avatar (image or initial badge) on all `user` message bubbles.
  5. Include custom instructions in chat payload if configured.
- **DoD**: Profile modal opens/closes cleanly, changes persist in localStorage, and avatar updates dynamically across all chat messages.

### Chunk 3: Thought Reasoning Accordion & Enhanced Message Toolbar
- **Target Files**: `assets/js/app.js`, `assets/css/app.css`
- **Implementation Steps**:
  1. Parse `<thought>...</thought>` or `:::thought ... :::` blocks in `formatMarkdown()` into collapsible `<details class="thought-box"><summary class="thought-summary">Rantai Penalaran (Thought Process)</summary><div class="thought-content">...</div></details>`.
  2. Add message action buttons under bot responses:
     - `Copy Message` (`[ VERIFIED ] Pesan disalin`).
     - `Export Chat to Markdown` (`#btnExportChat`).
- **DoD**: Thought trace renders inside collapsible box; Export Chat downloads formatted `.md` file.

### Chunk 4: CSS Polish & Glassmorphic Slate Theme Parity
- **Target Files**: `assets/css/app.css`
- **Implementation Steps**:
  1. Add styling rules for `.model-selector-wrap`, `.model-dropdown`, `.model-option`, `.model-badge`, `.profile-modal`, `.avatar-picker-grid`, `.thought-box`, `.thought-summary`.
  2. Ensure full responsive compatibility on mobile screens (`<= 768px`) with drawer and modal overlays.
- **DoD**: Visual inspection confirms high-contrast cyberpunk slate dark/light styling with 0 CSS bugs.

### Chunk 5: Verification, Cache Busting & Checkpoint
- **Target Files**: `index.html`, `404.html`, `server.js`, `assets/js/app.js`
- **Implementation Steps**:
  1. Synchronize `404.html` with `index.html`.
  2. Bump cache bust queries to `?v=20260821_v310`.
  3. Run `python3 check_emojis.py` (0 emojis).
  4. Run `node -c server.js` and `node -c assets/js/app.js`.
  5. Rebuild & update container `chat-zyekh-com-2yrzqt` in Dokploy Swarm.
  6. Empirical curl verification of UI and API.
  7. Commit changes locally.
- **DoD**: 0 linter errors, 0 emoji violations, container healthy, and all features empirically verified.
