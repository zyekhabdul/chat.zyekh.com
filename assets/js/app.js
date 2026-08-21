(function () {
  'use strict';

  // Config & State
  const isChatDomain = window.location.hostname === 'chat.zyekh.com' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isChatDomain ? '' : 'https://api.zyekh.com';
  const SESSIONS_KEY = 'zyekh_companion_sessions';
  const ACTIVE_SESSION_KEY = 'zyekh_active_companion_session_id';
  const ACTIVE_MODEL_KEY = 'zyekh_active_model';
  const PROFILE_KEY = 'zyekh_user_profile';
  const THEME_KEY = 'theme';

  // Default Model Definitions (Gateway port 8317 fallback)
  const DEFAULT_MODELS = [
    {
      id: 'gemini-3.7-flash-high',
      name: 'Gemini 3.7 Flash High',
      description: 'High-speed reasoning with native thinking trace',
      provider: 'Google',
      badge: 'Default / Fast',
      isDefault: true,
      capabilities: ['chat', 'reasoning', 'coding', 'fast']
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      description: 'Ultra lightweight & low-latency conversational model',
      provider: 'Google',
      badge: 'Lightweight',
      isDefault: false,
      capabilities: ['chat', 'fast', 'economy']
    },
    {
      id: 'claude-sonnet-4-6',
      name: 'Claude 3.7 Sonnet',
      description: 'Premier coding, architecture design, and nuanced writing',
      provider: 'Anthropic',
      badge: 'Coding & PRD',
      isDefault: false,
      capabilities: ['chat', 'coding', 'artifacts', 'complex']
    },
    {
      id: 'claude-opus-4-6-thinking',
      name: 'Claude 3.7 Opus Thinking',
      description: 'Deep strategic analysis and extended chain-of-thought',
      provider: 'Anthropic',
      badge: 'Deep Reasoning',
      isDefault: false,
      capabilities: ['chat', 'deep-reasoning', 'research']
    },
    {
      id: 'gemini-pro-agent',
      name: 'Gemini Pro Agent',
      description: 'Advanced contextual reasoning and multi-step tool execution',
      provider: 'Google',
      badge: 'Pro Agent',
      isDefault: false,
      capabilities: ['chat', 'reasoning', 'tools']
    },
    {
      id: 'gpt-oss-120b-medium',
      name: 'GPT OSS 120B',
      description: 'Open-weights high-throughput conversational inference',
      provider: 'Open Source',
      badge: 'Open Weights',
      isDefault: false,
      capabilities: ['chat', 'open-weights']
    }
  ];

  // Cyberpunk Preset Avatars (8 Crisp Geometric SVGs)
  const CYBER_AVATARS = [
    { id: 'cyber_neon', name: 'Cyber Neon', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#10b981" stroke-width="2"/><path d="M12 20 L20 12 L28 20 L20 28 Z" fill="#10b981"/><circle cx="20" cy="20" r="3" fill="#09090b"/></svg>' },
    { id: 'visor_core', name: 'Visor Core', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#3b82f6" stroke-width="2"/><rect x="10" y="16" width="20" height="8" rx="2" fill="#3b82f6"/><line x1="6" y1="20" x2="34" y2="20" stroke="#60a5fa" stroke-width="1.5"/></svg>' },
    { id: 'terminal_mono', name: 'Monolith', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#fafafa" stroke-width="2"/><path d="M14 15 L20 20 L14 25" stroke="#fafafa" stroke-width="2.5" fill="none" stroke-linecap="round"/><line x1="22" y1="25" x2="27" y2="25" stroke="#fafafa" stroke-width="2.5"/></svg>' },
    { id: 'quantum_orb', name: 'Quantum', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#a855f7" stroke-width="2"/><circle cx="20" cy="20" r="7" fill="none" stroke="#c084fc" stroke-width="2"/><ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="#a855f7" stroke-width="1" transform="rotate(30 20 20)"/></svg>' },
    { id: 'grid_pulse', name: 'Pulse', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#f59e0b" stroke-width="2"/><polyline points="10,20 16,20 19,13 23,27 26,20 30,20" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'neural_hex', name: 'Hex Core', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#ec4899" stroke-width="2"/><polygon points="20,11 28,16 28,24 20,29 12,24 12,16" fill="none" stroke="#f472b6" stroke-width="2"/><circle cx="20" cy="20" r="2.5" fill="#f472b6"/></svg>' },
    { id: 'shield_matrix', name: 'Shield', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#06b6d4" stroke-width="2"/><path d="M20 12 L28 15 V22 C28 26 20 29 20 29 C20 29 12 26 12 22 V15 Z" fill="none" stroke="#22d3ee" stroke-width="2"/></svg>' },
    { id: 'zenith_star', name: 'Zenith', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#e4e4e7" stroke-width="2"/><polygon points="20,10 23,17 30,20 23,23 20,30 17,23 10,20 17,17" fill="#fafafa"/></svg>' }
  ];

  let sessions = loadSessions();
  let currentSessionId = localStorage.getItem(ACTIVE_SESSION_KEY);
  let availableModels = [...DEFAULT_MODELS];
  let activeModelId = localStorage.getItem(ACTIVE_MODEL_KEY) || DEFAULT_MODELS[0].id;
  let userProfile = loadUserProfile();
  let searchQuery = '';

  if (!currentSessionId || !sessions.find((s) => s.id === currentSessionId)) {
    currentSessionId = getOrCreateActiveSession();
  }

  // DOM Elements
  const historyList = document.getElementById('historyList');
  const sessionSearchInput = document.getElementById('sessionSearchInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const btnNewChat = document.getElementById('btnNewChat');
  const btnMenuToggle = document.getElementById('btnMenuToggle');
  const btnClearChat = document.getElementById('btnClearChat');
  const btnExportChat = document.getElementById('btnExportChat');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  // Model Selector DOM
  const modelSelectorWrap = document.getElementById('modelSelectorWrap');
  const btnModelSelector = document.getElementById('btnModelSelector');
  const activeModelName = document.getElementById('activeModelName');
  const activeModelBadge = document.getElementById('activeModelBadge');
  const modelDropdown = document.getElementById('modelDropdown');
  const modelOptionsList = document.getElementById('modelOptionsList');
  const hintActiveModel = document.getElementById('hintActiveModel');

  // Profile Modal DOM
  const btnProfileToggle = document.getElementById('btnProfileToggle');
  const btnSidebarEditProfile = document.getElementById('btnSidebarEditProfile');
  const profileModalBackdrop = document.getElementById('profileModalBackdrop');
  const btnProfileModalClose = document.getElementById('btnProfileModalClose');
  const btnProfileModalCancel = document.getElementById('btnProfileModalCancel');
  const profileForm = document.getElementById('profileForm');
  const profileNameInput = document.getElementById('profileNameInput');
  const profileInstructionsInput = document.getElementById('profileInstructionsInput');
  const profileAvatarPreview = document.getElementById('profileAvatarPreview');
  const avatarPresetsGrid = document.getElementById('avatarPresetsGrid');
  const avatarCustomBox = document.getElementById('avatarCustomBox');
  const profileAvatarUrlInput = document.getElementById('profileAvatarUrlInput');
  const profileAvatarFileInput = document.getElementById('profileAvatarFileInput');
  const fileUploadHint = document.getElementById('fileUploadHint');

  // Nav & Sidebar Profile Thumbnails
  const navProfileThumb = document.getElementById('navProfileThumb');
  const navProfileName = document.getElementById('navProfileName');
  const sidebarProfileThumb = document.getElementById('sidebarProfileThumb');
  const sidebarProfileName = document.getElementById('sidebarProfileName');

  // Sidebar Controls
  function openSidebar() {
    sidebar?.classList.add('open');
    sidebarBackdrop?.classList.add('open');
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarBackdrop?.classList.remove('open');
  }

  function toggleSidebar() {
    if (sidebar?.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // Toast Notification System
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  }

  // Initialization
  async function init() {
    initTheme();
    initUserProfileUI();
    renderHistoryList();
    loadSessionToView(currentSessionId);
    await initModels();

    // Event: Theme Toggle
    btnThemeToggle?.addEventListener('click', toggleTheme);

    // Event: Search Filter
    sessionSearchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderHistoryList();
    });

    // Event: Obrolan Baru
    btnNewChat?.addEventListener('click', () => {
      const activeSess = getSession(currentSessionId);
      if (activeSess && activeSess.messages.length === 0) {
        chatInput?.focus();
        closeSidebar();
        return;
      }

      const newId = 'sess_' + Date.now();
      const newSess = {
        id: newId,
        title: 'Obrolan Baru',
        createdAt: new Date().toISOString(),
        messages: []
      };
      sessions.unshift(newSess);
      saveSessions();
      searchQuery = '';
      if (sessionSearchInput) sessionSearchInput.value = '';
      loadSessionToView(newId);
      closeSidebar();
      chatInput?.focus();
      showToast('[ INFO ] Sesi obrolan baru siap digunakan');
    });

    // Event: Bersihkan Obrolan Aktif
    btnClearChat?.addEventListener('click', () => {
      const sess = getSession(currentSessionId);
      if (sess && sess.messages.length > 0) {
        sess.messages = [];
        sess.title = 'Obrolan Baru';
        saveSessions();
        renderHistoryList();
        loadSessionToView(currentSessionId);
        showToast('[ INFO ] Riwayat obrolan aktif telah dibersihkan');
      }
    });

    // Event: Ekspor Chat ke Markdown
    btnExportChat?.addEventListener('click', exportChatSession);

    // Event: Model Selector Toggle & Dropdown
    btnModelSelector?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleModelDropdown();
    });

    // Event: Profile Modal Toggle
    btnProfileToggle?.addEventListener('click', openProfileModal);
    btnSidebarEditProfile?.addEventListener('click', () => {
      closeSidebar();
      openProfileModal();
    });
    btnProfileModalClose?.addEventListener('click', closeProfileModal);
    btnProfileModalCancel?.addEventListener('click', closeProfileModal);
    profileForm?.addEventListener('submit', handleProfileSave);

    // Event: Avatar Type Radio Changes
    document.querySelectorAll('input[name="avatarType"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        handleAvatarTypeChange(e.target.value);
      });
    });

    // Event: Custom Avatar URL / File Upload
    profileAvatarUrlInput?.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) updateAvatarPreview('url', url);
    });

    profileAvatarFileInput?.addEventListener('change', handleFileUpload);
    profileNameInput?.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      const activeType = document.querySelector('input[name="avatarType"]:checked')?.value || 'initial';
      if (activeType === 'initial') {
        updateAvatarPreview('initial', name.charAt(0).toUpperCase() || 'U');
      }
    });

    // Event: Sidebar Mobile Toggle & Backdrop Dismiss
    btnMenuToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    sidebarBackdrop?.addEventListener('click', closeSidebar);

    // Global Click Dismiss for Dropdowns & Modals
    document.addEventListener('click', (e) => {
      if (modelSelectorWrap?.classList.contains('open') && !modelSelectorWrap.contains(e.target)) {
        closeModelDropdown();
      }
      if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !btnMenuToggle?.contains(e.target)) {
        closeSidebar();
      }
      if (profileModalBackdrop?.classList.contains('open') && e.target === profileModalBackdrop) {
        closeProfileModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModelDropdown();
        closeSidebar();
        closeProfileModal();
      }
    });

    // Event: Submit Pesan
    chatForm?.addEventListener('submit', handleSendMessage);

    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
      }
    });

    // Event: Auto-resize Textarea
    chatInput?.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
    });
  }

  // === Dynamic Models Management ===
  async function initModels() {
    try {
      const res = await fetch(`${API_BASE}/api/models`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.models) && data.models.length > 0) {
          availableModels = data.models;
        }
      }
    } catch (err) {
      console.warn('[MODELS] Gagal mengambil model dari gateway, menggunakan fallback internal:', err.message);
    }

    if (!availableModels.find(m => m.id === activeModelId)) {
      activeModelId = availableModels[0]?.id || 'gemini-3.7-flash-high';
    }

    updateActiveModelUI();
    renderModelDropdown();
  }

  function updateActiveModelUI() {
    const model = availableModels.find(m => m.id === activeModelId) || availableModels[0];
    if (model) {
      if (activeModelName) activeModelName.textContent = model.name;
      if (activeModelBadge) activeModelBadge.textContent = model.badge || model.provider;
      if (hintActiveModel) hintActiveModel.textContent = `Model: ${model.name}`;
    }
  }

  function renderModelDropdown() {
    if (!modelOptionsList) return;
    modelOptionsList.innerHTML = '';

    availableModels.forEach((model) => {
      const isActive = model.id === activeModelId;
      const card = document.createElement('div');
      card.className = `model-option-card ${isActive ? 'active' : ''}`;
      card.innerHTML = `
        <div class="model-opt-header">
          <span class="model-opt-title">${escapeHtml(model.name)}</span>
          <span class="model-opt-badge">${escapeHtml(model.badge || model.provider)}</span>
        </div>
        <p class="model-opt-desc">${escapeHtml(model.description || '')}</p>
        <div class="model-opt-caps">
          ${(model.capabilities || []).map(c => `<span class="cap-pill">${escapeHtml(c)}</span>`).join('')}
        </div>
      `;

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveModel(model.id);
        closeModelDropdown();
      });

      modelOptionsList.appendChild(card);
    });
  }

  function setActiveModel(id) {
    activeModelId = id;
    localStorage.setItem(ACTIVE_MODEL_KEY, id);
    updateActiveModelUI();
    renderModelDropdown();
    const model = availableModels.find(m => m.id === id);
    showToast(`[ MODEL ] Beralih ke ${model?.name || id}`);
  }

  function toggleModelDropdown() {
    if (modelSelectorWrap?.classList.contains('open')) {
      closeModelDropdown();
    } else {
      modelSelectorWrap?.classList.add('open');
      modelDropdown?.classList.add('open');
      btnModelSelector?.setAttribute('aria-expanded', 'true');
    }
  }

  function closeModelDropdown() {
    modelSelectorWrap?.classList.remove('open');
    modelDropdown?.classList.remove('open');
    btnModelSelector?.setAttribute('aria-expanded', 'false');
  }

  // === User Profile & Custom Avatar (PP) Management ===
  function loadUserProfile() {
    try {
      const d = localStorage.getItem(PROFILE_KEY);
      return d ? JSON.parse(d) : { name: 'User', avatarType: 'initial', avatarValue: '', instructions: '' };
    } catch (e) {
      return { name: 'User', avatarType: 'initial', avatarValue: '', instructions: '' };
    }
  }

  function saveUserProfile(profile) {
    userProfile = profile;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    initUserProfileUI();
  }

  function initUserProfileUI() {
    const name = userProfile.name || 'User';
    if (navProfileName) navProfileName.textContent = name;
    if (sidebarProfileName) sidebarProfileName.textContent = name;

    renderAvatarToElement(navProfileThumb, userProfile);
    renderAvatarToElement(sidebarProfileThumb, userProfile);
  }

  function renderAvatarToElement(targetEl, profile) {
    if (!targetEl) return;
    targetEl.innerHTML = '';

    if (profile.avatarType === 'preset') {
      const preset = CYBER_AVATARS.find(a => a.id === profile.avatarValue);
      if (preset) {
        targetEl.innerHTML = preset.svg;
        return;
      }
    } else if (profile.avatarType === 'url' && profile.avatarValue) {
      const img = document.createElement('img');
      img.src = profile.avatarValue;
      img.alt = profile.name || 'User';
      img.onerror = () => {
        targetEl.textContent = (profile.name || 'U').charAt(0).toUpperCase();
      };
      targetEl.appendChild(img);
      return;
    }

    // Default: Initial Letter
    targetEl.textContent = (profile.name || 'U').charAt(0).toUpperCase();
  }

  function openProfileModal() {
    if (!profileForm) return;
    profileNameInput.value = userProfile.name || 'User';
    profileInstructionsInput.value = userProfile.instructions || '';
    
    // Set radio
    const activeRadio = document.querySelector(`input[name="avatarType"][value="${userProfile.avatarType || 'initial'}"]`);
    if (activeRadio) activeRadio.checked = true;

    handleAvatarTypeChange(userProfile.avatarType || 'initial');
    renderAvatarPresets();

    if (userProfile.avatarType === 'url' && profileAvatarUrlInput) {
      profileAvatarUrlInput.value = userProfile.avatarValue.startsWith('data:') ? '' : userProfile.avatarValue;
    }

    updateAvatarPreview(userProfile.avatarType, userProfile.avatarValue);

    profileModalBackdrop?.classList.add('open');
    profileNameInput?.focus();
  }

  function closeProfileModal() {
    profileModalBackdrop?.classList.remove('open');
  }

  function handleAvatarTypeChange(type) {
    if (avatarPresetsGrid) avatarPresetsGrid.style.display = type === 'preset' ? 'grid' : 'none';
    if (avatarCustomBox) avatarCustomBox.style.display = type === 'url' ? 'flex' : 'none';

    if (type === 'initial') {
      updateAvatarPreview('initial', (profileNameInput?.value || 'U').charAt(0).toUpperCase());
    } else if (type === 'preset') {
      const selected = userProfile.avatarValue || CYBER_AVATARS[0].id;
      updateAvatarPreview('preset', selected);
    } else if (type === 'url') {
      updateAvatarPreview('url', profileAvatarUrlInput?.value || userProfile.avatarValue);
    }
  }

  function renderAvatarPresets() {
    if (!avatarPresetsGrid) return;
    avatarPresetsGrid.innerHTML = '';

    CYBER_AVATARS.forEach((preset) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `avatar-preset-btn ${userProfile.avatarValue === preset.id ? 'active' : ''}`;
      btn.title = preset.name;
      btn.innerHTML = preset.svg;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        userProfile.avatarValue = preset.id;
        updateAvatarPreview('preset', preset.id);
      });

      avatarPresetsGrid.appendChild(btn);
    });
  }

  function updateAvatarPreview(type, val) {
    renderAvatarToElement(profileAvatarPreview, {
      name: profileNameInput?.value || 'User',
      avatarType: type,
      avatarValue: val
    });
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('[ ERROR ] Ukuran file maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        userProfile.avatarValue = base64;
        updateAvatarPreview('url', base64);
        if (fileUploadHint) fileUploadHint.textContent = `File siap: ${file.name}`;
      }
    };
    reader.readAsDataURL(file);
  }

  function handleProfileSave(e) {
    e.preventDefault();
    const name = profileNameInput?.value.trim() || 'User';
    const instructions = profileInstructionsInput?.value.trim() || '';
    const avatarType = document.querySelector('input[name="avatarType"]:checked')?.value || 'initial';
    
    let avatarVal = '';
    if (avatarType === 'preset') {
      const activePreset = document.querySelector('.avatar-preset-btn.active');
      avatarVal = userProfile.avatarValue || CYBER_AVATARS[0].id;
    } else if (avatarType === 'url') {
      avatarVal = profileAvatarUrlInput?.value.trim() || userProfile.avatarValue || '';
    }

    saveUserProfile({
      name,
      avatarType,
      avatarValue: avatarVal,
      instructions
    });

    closeProfileModal();
    // Re-render current chat to update avatars in conversation
    loadSessionToView(currentSessionId);
    showToast('[ VERIFIED ] Pengaturan profil berhasil disimpan');
  }

  // Theme Management
  function initTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeUI(activeTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    updateThemeUI(next);
    showToast(`[ THEME ] Mode diubah ke ${next === 'light' ? 'Terang (Light)' : 'Gelap (Dark)'}`);
  }

  function updateThemeUI(theme) {
    if (themeLabel) {
      themeLabel.textContent = theme === 'light' ? 'Light' : 'Dark';
    }
  }

  // Session Helpers
  function loadSessions() {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSessions() {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  function getOrCreateActiveSession() {
    if (sessions.length > 0) {
      return sessions[0].id;
    }
    const id = 'sess_' + Date.now();
    const newSess = {
      id,
      title: 'Obrolan Baru',
      createdAt: new Date().toISOString(),
      messages: []
    };
    sessions = [newSess];
    saveSessions();
    return id;
  }

  function getSession(id) {
    return sessions.find((s) => s.id === id);
  }

  function renderHistoryList() {
    if (!historyList) return;
    historyList.innerHTML = '';

    const filtered = searchQuery 
      ? sessions.filter((s) => s.title.toLowerCase().includes(searchQuery))
      : sessions;

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'history-empty';
      empty.textContent = searchQuery ? '[ INFO ] Tidak ada riwayat yang cocok' : '[ INFO ] Belum ada riwayat obrolan';
      historyList.appendChild(empty);
      return;
    }

    filtered.forEach((sess) => {
      const item = document.createElement('div');
      item.className = `history-item ${sess.id === currentSessionId ? 'active' : ''}`;
      item.innerHTML = `
        <span style="overflow:hidden; text-overflow:ellipsis; flex:1;">${escapeHtml(sess.title)}</span>
        <button class="btn-del-sess" title="Hapus Obrolan" aria-label="Hapus">&times;</button>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-del-sess')) {
          e.stopPropagation();
          deleteSession(sess.id);
          return;
        }
        loadSessionToView(sess.id);
        closeSidebar();
      });

      historyList.appendChild(item);
    });
  }

  function deleteSession(id) {
    sessions = sessions.filter((s) => s.id !== id);
    if (sessions.length === 0) {
      currentSessionId = getOrCreateActiveSession();
    } else if (currentSessionId === id) {
      currentSessionId = sessions[0].id;
    }
    saveSessions();
    renderHistoryList();
    loadSessionToView(currentSessionId);
    showToast('[ INFO ] Sesi obrolan dihapus');
  }

  function loadSessionToView(sessionId) {
    currentSessionId = sessionId;
    localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
    renderHistoryList();

    const sess = getSession(sessionId);
    if (!sess) return;

    chatMessages.innerHTML = '';

    if (sess.messages.length === 0) {
      renderWelcomeScreen();
    } else {
      sess.messages.forEach((msg) => {
        appendMessageElement(msg.role, msg.content, msg.modelUsed);
      });
    }
    chatInput?.focus();
  }

  // Welcome Screen
  function renderWelcomeScreen() {
    const welcome = document.createElement('div');
    welcome.className = 'chat-welcome';
    welcome.innerHTML = `
      <span class="welcome-badge">ZYEKH AI COMPANION</span>
      <h2 class="welcome-title">Hai ${escapeHtml(userProfile.name || 'Sobat')}! Mau bahas apa hari ini?</h2>
      <p class="welcome-subtitle">AI Companion siap berdiskusi, brainstorming arsitektur, riset teknis, dan refleksi harian dengan 6 model AI pilihan.</p>
      <div class="suggestions-grid">
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Hai! Kenalin kemampuan kamu dan model apa saja yang bisa digunakan?')">
          <div>
            <span class="suggestion-cat">[ PERKENALAN ]</span>
            <h3 class="suggestion-title">Fitur &amp; Multi-Model</h3>
            <p class="suggestion-desc">Eksplorasi kemampuan model Gemini 3.7, Claude Sonnet/Opus, dan GPT OSS.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Gw lagi punya ide proyek software baru, bantu susun arsitektur teknisnya yuk!')">
          <div>
            <span class="suggestion-cat">[ ARSITEKTUR ]</span>
            <h3 class="suggestion-title">Brainstorming Arsitektur</h3>
            <p class="suggestion-desc">Desain sistem monorepo, zero-dependency engine, dan validasi skala.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Bantu audit performa web dan strategi Core Web Vitals LCP < 1s!')">
          <div>
            <span class="suggestion-cat">[ CODING ]</span>
            <h3 class="suggestion-title">Optimasi &amp; Deep Coding</h3>
            <p class="suggestion-desc">Analisis kode presisi, algoritma efisien, dan debugging bebas bloat.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Gimana tips produktivitas dan fokus ngoding jangka panjang?')">
          <div>
            <span class="suggestion-cat">[ REFLEKSI ]</span>
            <h3 class="suggestion-title">Refleksi &amp; Produktivitas</h3>
            <p class="suggestion-desc">Manajemen fokus, konsistensi kerja, dan ritme rekayasa berkelanjutan.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
      </div>
    `;
    chatMessages.appendChild(welcome);
  }

  window.sendSuggestedPrompt = function (text) {
    if (chatInput && chatForm) {
      chatInput.value = text;
      chatForm.requestSubmit();
    }
  };

  // Message Handling
  async function handleSendMessage(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    let sess = getSession(currentSessionId);
    if (!sess) {
      currentSessionId = getOrCreateActiveSession();
      sess = getSession(currentSessionId);
    }

    if (sess.messages.length === 0) {
      chatMessages.innerHTML = '';
      sess.title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      renderHistoryList();
    }

    sess.messages.push({ role: 'user', content: text });
    saveSessions();
    appendMessageElement('user', text);

    chatInput.value = '';
    chatInput.style.height = 'auto';
    btnSend.disabled = true;
    showTypingIndicator();

    try {
      // If user has custom instructions, prepend contextual hint
      let messagePayload = text;
      if (userProfile.instructions && sess.messages.length === 1) {
        messagePayload = `[User Instructions: ${userProfile.instructions}]\n\n${text}`;
      }

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messagePayload,
          chatId: currentSessionId,
          persona: 'companion',
          channel: 'chat.zyekh.com',
          model: activeModelId
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      removeTypingIndicator();

      const botReply = data && data.reply ? data.reply : 'Maaf, terjadi kendala saat merespon obrolan.';
      const usedModel = data && data.modelUsed ? data.modelUsed : activeModelId;
      sess.messages.push({ role: 'assistant', content: botReply, modelUsed: usedModel });
      saveSessions();
      appendMessageElement('bot', botReply, usedModel);
    } catch (err) {
      removeTypingIndicator();
      appendMessageElement('bot', `[ ERROR ] Gagal terhubung ke Zyekh AI Core API (${err.message}). Pastikan server aktif.`);
    } finally {
      btnSend.disabled = false;
      chatInput?.focus();
    }
  }

  function appendMessageElement(role, text, modelUsed) {
    const row = document.createElement('div');
    row.className = `message-row ${role === 'user' ? 'user' : 'bot'}`;

    const avatar = document.createElement('div');
    avatar.className = `avatar ${role === 'user' ? 'user' : 'bot'}`;

    if (role === 'user') {
      renderAvatarToElement(avatar, userProfile);
    } else {
      avatar.textContent = 'Z';
    }

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = role === 'user' ? escapeHtml(text).replace(/\n/g, '<br>') : formatMarkdown(text);

    if (role === 'bot' || role === 'assistant') {
      const metaBar = document.createElement('div');
      metaBar.className = 'message-meta-bar';

      const modelLabel = availableModels.find(m => m.id === modelUsed)?.name || modelUsed || activeModelId;
      metaBar.innerHTML = `
        <span class="model-used-tag">[ ${escapeHtml(modelLabel)} ]</span>
        <div class="message-actions-bar">
          <button class="btn-msg-action btn-copy-msg" type="button" title="Salin Pesan">Salin</button>
        </div>
      `;

      metaBar.querySelector('.btn-copy-msg')?.addEventListener('click', (e) => {
        navigator.clipboard.writeText(text);
        const btn = e.target;
        btn.textContent = 'Tersalin!';
        showToast('[ VERIFIED ] Pesan berhasil disalin ke clipboard');
        setTimeout(() => (btn.textContent = 'Salin'), 2000);
      });

      content.appendChild(metaBar);
    }

    row.appendChild(avatar);
    row.appendChild(content);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Attach copy button to code blocks
    content.querySelectorAll('.copy-code-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wrapper = btn.closest('.code-block-wrapper') || btn.closest('pre');
        const code = wrapper?.querySelector('code')?.innerText || '';
        if (code) {
          navigator.clipboard.writeText(code);
          btn.textContent = 'Copied!';
          showToast('[ VERIFIED ] Kode berhasil disalin ke clipboard');
          setTimeout(() => (btn.textContent = 'Copy'), 2000);
        }
      });
    });
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'message-row bot';
    row.id = 'activeTypingRow';
    row.innerHTML = `
      <div class="avatar bot">Z</div>
      <div class="message-content" style="display:flex; gap:6px; padding:12px 18px; align-items:center;">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('activeTypingRow');
    if (el) el.remove();
  }

  // Export Chat Session to Markdown
  function exportChatSession() {
    const sess = getSession(currentSessionId);
    if (!sess || sess.messages.length === 0) {
      showToast('[ INFO ] Tidak ada riwayat obrolan untuk diekspor');
      return;
    }

    let md = `# ${sess.title}\n\n`;
    md += `- **Date**: ${sess.createdAt || new Date().toISOString()}\n`;
    md += `- **Platform**: Zyekh AI Companion (chat.zyekh.com)\n`;
    md += `- **User**: ${userProfile.name || 'User'}\n\n---\n\n`;

    sess.messages.forEach((msg) => {
      const speaker = msg.role === 'user' ? `### [ ${userProfile.name || 'User'} ]` : `### [ Zyekh AI (${msg.modelUsed || 'Assistant'}) ]`;
      md += `${speaker}\n\n${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zyekh-chat-${sess.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('[ VERIFIED ] Riwayat obrolan berhasil diekspor ke Markdown');
  }

  // Utilities
  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Rich Markdown Engine with Thought Accordions
  function formatMarkdown(text) {
    if (!text) return '';

    // 1. Escape HTML
    let str = escapeHtml(text);

    // 2. Extract Thought Blocks (<thought>...</thought> or :::thought ... :::)
    str = str.replace(/(?:&lt;thought&gt;([\s\S]*?)&lt;\/thought&gt;|:::thought\s*([\s\S]*?):::)/gi, (_, t1, t2) => {
      const thoughtText = (t1 || t2 || '').trim();
      return `<details class="thought-box"><summary class="thought-summary">Rantai Penalaran (Thought Process)</summary><div class="thought-content">${thoughtText.replace(/\n/g, '<br>')}</div></details>`;
    });

    const codeBlocks = [];
    const inlineCodes = [];

    // 3. Extract Code blocks
    str = str.replace(/```([a-zA-Z0-9_\-#+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const idx = codeBlocks.length;
      const displayLang = (lang || 'CODE').toUpperCase();
      codeBlocks.push(
        `<div class="code-block-wrapper">` +
        `<div class="code-block-header">` +
          `<span class="code-lang">${displayLang}</span>` +
          `<button class="copy-code-btn" type="button" aria-label="Copy Code">Copy</button>` +
        `</div>` +
        `<pre><code class="language-${lang || 'plaintext'}">${code.trimEnd()}</code></pre>` +
        `</div>`
      );
      return `___CODEBLOCK_${idx}___`;
    });

    // 4. Extract Inline code
    str = str.replace(/`([^`]+)`/g, (match, code) => {
      const idx = inlineCodes.length;
      inlineCodes.push(`<code>${code}</code>`);
      return `___INLINECODE_${idx}___`;
    });

    // 5. Tables
    str = str.replace(/((?:\|[^\n]+\|\r?\n?){2,})/g, (tableMatch) => {
      const lines = tableMatch.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return tableMatch;
      
      let tableHtml = '<table>';
      let isHeaderDone = false;

      lines.forEach((line, idx) => {
        if (/^\|[-:\s|]+\|$/.test(line)) {
          isHeaderDone = true;
          return;
        }
        const cells = line.split('|').slice(1, -1).map(c => c.trim());
        if (!isHeaderDone && idx === 0) {
          tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      });
      tableHtml += '</tbody></table>';
      return tableHtml;
    });

    // 6. Horizontal rules
    str = str.replace(/^(?:---|___|\*\*\*)$/gm, '<hr />');

    // 7. Blockquotes / Callouts (> text)
    str = str.replace(/^&gt;\s?(.*)$/gm, '<div class="callout"><p>$1</p></div>');

    // 8. Headings
    str = str.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    str = str.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    str = str.replace(/^# (.*$)/gm, '<h4>$1</h4>');

    // 9. Bold & Italic
    str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 10. Links
    str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // 11. Lists
    str = str.replace(/((?:^[ \t]*(?:[•\-\*]|\d+\.)[ \t]+[^\n]+\r?\n?)+)/gm, (listMatch) => {
      const lines = listMatch.trim().split('\n');
      const isOrdered = /^[ \t]*\d+\./.test(lines[0]);
      const items = lines.map(line => {
        const content = line.replace(/^[ \t]*(?:[•\-\*]|\d+\.)[ \t]+/, '');
        return `<li>${content}</li>`;
      }).join('');
      return isOrdered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
    });

    // 12. Newlines
    str = str.replace(/(?<!<\/li>|<\/ul>|<\/ol>|<\/h[1-6]>|<\/table>|<\/tbody>|<\/tr>|<\/thead>|<\/div>|<\/p>|<hr \/>|<\/details>|<\/summary>)\n/g, '<br>');

    // 13. Restore Code blocks & Inline codes
    str = str.replace(/___CODEBLOCK_(\d+)___/g, (_, idx) => codeBlocks[Number(idx)] || '');
    str = str.replace(/___INLINECODE_(\d+)___/g, (_, idx) => inlineCodes[Number(idx)] || '');

    return str;
  }

  // Run
  document.addEventListener('DOMContentLoaded', init);
})();
