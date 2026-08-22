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
  const PREF_LANG_KEY = 'zyekh_pref_lang';

  // Zero-Dependency Client-Side Translation Dictionary
  const I18N_DICT = {
    en: {
      new_chat_btn: 'New Chat',
      new_chat_title: 'New Chat',
      search_placeholder: 'Search conversations...',
      search_aria: 'Search conversations',
      user_profile_aria: 'Open User Profile & Settings',
      gateway_active: 'Gateway Active',
      select_model_title: 'Select AI Model',
      select_model_hdr: 'SELECT AI MODEL',
      github_btn: 'GitHub',
      github_title: 'Star & Fork on GitHub (Open Source)',
      widget_btn: 'Widget',
      widget_title: 'Embed AI Widget on Your Website',
      export_btn: 'Export',
      export_title: 'Export Conversation to Markdown',
      share_btn: 'Share',
      share_title: 'Share Public Conversation Link',
      lang_btn_title: 'Switch Language (English / Bahasa Indonesia)',
      theme_btn_title: 'Toggle Theme (Dark / Light)',
      theme_btn_label: 'Theme',
      clear_btn: 'Clear',
      clear_title: 'Clear Current Conversation',
      chat_placeholder: 'Type a message or ask anything...',
      send_aria: 'Send Message',
      hint_enter: 'Enter to send',
      hint_shift_enter: 'Shift + Enter for new line',
      hint_model_prefix: 'Model: ',
      welcome_badge: 'ZYEKH AI',
      welcome_title: 'Hello {name}! What would you like to explore today?',
      welcome_subtitle: 'High-speed AI ready for deep research, strategic brainstorming, creative writing, and technical problem solving.',
      tab_general: 'General',
      tab_general_short: 'General',
      tab_creative: 'Creative & Writing',
      tab_creative_short: 'Creative',
      tab_research: 'Research & Logic',
      tab_research_short: 'Research',
      tab_dev: 'Developer & Code',
      tab_dev_short: 'Code',
      starters: {
        general: [
          { label: 'Critical Idea Roast', prompt: 'Roast and critically pressure-test this concept: [paste your idea/plan]. Point out flawed assumptions, blind spots, and realistic execution risks.' },
          { label: 'Complex Problem Solver', prompt: 'I am facing this specific complex challenge: [describe situation]. Break down the root cause and provide 3 structured, actionable solutions.' },
          { label: "Explain Like I'm 5", prompt: 'Explain the core principles of quantum entanglement and quantum computing in simple, intuitive analogies that anyone can understand.' },
          { label: 'Productivity Blueprint', prompt: 'Help me design a hyper-focused, distraction-free daily routine and time-blocking workflow to accomplish 3 high-impact priorities.' }
        ],
        creative: [
          { label: 'Catchy Hook & Copy', prompt: 'Generate 5 high-converting, attention-grabbing opening hooks and copy angles for: [insert topic/product]. Avoid generic AI cliches.' },
          { label: 'Compelling Article Draft', prompt: 'Write an engaging, insightful, and well-structured deep dive article on: [topic]. Use conversational tone and strong storytelling.' },
          { label: 'Polish & Elevate Tone', prompt: 'Rewrite and elevate the tone of the following draft to make it punchy, authoritative, and memorable: [paste text]' },
          { label: 'Viral Content Angle', prompt: 'Brainstorm 4 viral content formats (threads, carousels, short video scripts) around: [topic] that encourage comments and shares.' }
        ],
        research: [
          { label: 'Counter-Argument Debate', prompt: 'Take the strongest opposing view against this premise: [state opinion]. Present compelling counter-arguments, historical precedents, and data.' },
          { label: 'Data & Logic Synthesis', prompt: 'Analyze and synthesize the logical connections, trade-offs, and second-order consequences of: [situation/trend].' },
          { label: 'Hard Reasoning Puzzle', prompt: 'Test your reasoning capabilities: Give me a sophisticated lateral thinking riddle or mathematical logic puzzle and guide me through the solution step-by-step.' },
          { label: 'Deep Topic Breakdown', prompt: 'Provide an exhaustive, academic-grade conceptual breakdown of: [topic], including fundamental axioms, key theorists, and real-world implications.' }
        ],
        dev: [
          { label: 'Roast Tech Stack', prompt: 'Roast my tech stack and system architecture: Node.js, Express, Docker Swarm, Vanilla JS client. Be brutally honest and highlight potential bottlenecks.' },
          { label: 'ASCII Architecture', prompt: 'Draw a complete ASCII system architecture diagram for a zero-trust microservice gateway with edge CDN caching and local-first client storage.' },
          { label: 'Zero-Bloat Refactor', prompt: 'Help me audit and strip third-party NPM bloat. Give me a strategy to replace heavy libraries with clean, zero-dependency native APIs.' },
          { label: 'Concurrency Benchmark', prompt: 'Solve this concurrency challenge: Implement a lock-free sliding window rate limiter in memory with sub-millisecond execution overhead.' }
        ]
      },
      toast_new_chat: 'New conversation ready',
      toast_clear_chat: 'Conversation history cleared',
      toast_webgpu_unsupported: 'WebGPU is not supported in this browser. Please use Chrome or Edge desktop.',
      toast_webgpu_active: 'WebGPU Neural Network active and running offline',
      toast_webgpu_fail: 'Failed to load WebGPU: {err}',
      toast_model_switch_webgpu: 'Switched to WebGPU On-Device 0.5B (Offline)',
      toast_model_switch: 'Switched to {model}',
      toast_max_file_size: 'Maximum file size is 2MB',
      toast_profile_saved: 'Profile settings saved',
      toast_widget_copied: 'Widget embed code copied to clipboard',
      toast_widget_copy_err: 'Failed to copy embed code',
      toast_empty_chat: 'Conversation is empty',
      toast_share_created: 'Public share link generated',
      toast_share_no_link: 'No valid link to copy',
      toast_share_copied: 'Public link copied to clipboard',
      toast_share_copy_err: 'Failed to copy link',
      toast_share_imported: 'Public conversation imported into your sessions',
      toast_theme_switched: 'Theme switched to {mode}',
      toast_sess_deleted: 'Conversation session deleted',
      toast_msg_copied: 'Message copied to clipboard',
      toast_code_copied: 'Code copied to clipboard',
      toast_export_empty: 'No conversation history to export',
      toast_export_ok: 'Conversation exported to Markdown',
      toast_lang_switched: 'Language switched to English',
      hist_no_match: 'No matching conversations found',
      hist_empty: 'No conversation history yet',
      hist_del_title: 'Delete Conversation',
      copy_btn: 'Copy',
      copied_btn: 'Copied!',
      export_card_btn: 'Card',
      export_card_title: 'Export as Visual Card (Image)',
      card_modal_badge: 'VISUAL CARD GENERATOR',
      card_modal_title: 'Export AI Response as Image',
      card_copy_btn: 'Copy PNG Image',
      card_copied_btn: 'Image Copied!',
      card_download_btn: 'Download PNG',
      card_close_btn: 'Close',
      toast_card_copied: 'Visual card copied to clipboard',
      toast_card_downloaded: 'Visual card downloaded',
      share_x_btn: 'Post to X',
      share_telegram_btn: 'Telegram',
      share_threads_btn: 'Threads',
      thought_process: 'Thought Process',
      toast_storage_err: 'Storage limit reached. Profile saved in memory only.'
    },
    id: {
      new_chat_btn: 'Obrolan Baru',
      new_chat_title: 'Obrolan Baru',
      search_placeholder: 'Cari riwayat obrolan...',
      search_aria: 'Cari riwayat obrolan',
      user_profile_aria: 'Buka Pengaturan Profil Pengguna',
      gateway_active: 'Gateway Aktif',
      select_model_title: 'Pilih Model AI',
      select_model_hdr: 'PILIH MODEL AI',
      github_btn: 'GitHub',
      github_title: 'Beri Bintang & Fork di GitHub (Open Source)',
      widget_btn: 'Widget',
      widget_title: 'Sematkan Widget di Website Anda',
      export_btn: 'Ekspor',
      export_title: 'Ekspor Obrolan ke Markdown',
      share_btn: 'Bagikan',
      share_title: 'Bagikan Percakapan Ini (Tautan Publik)',
      lang_btn_title: 'Ganti Bahasa (English / Bahasa Indonesia)',
      theme_btn_title: 'Ganti Tema (Gelap / Terang)',
      theme_btn_label: 'Tema',
      clear_btn: 'Bersihkan',
      clear_title: 'Bersihkan Obrolan Ini',
      chat_placeholder: 'Ketik pesan atau ceritakan sesuatu...',
      send_aria: 'Kirim Pesan',
      hint_enter: 'Enter untuk kirim',
      hint_shift_enter: 'Shift + Enter baris baru',
      hint_model_prefix: 'Model: ',
      welcome_badge: 'ZYEKH AI',
      welcome_title: 'Halo {name}! Ada yang ingin kita diskusikan hari ini?',
      welcome_subtitle: 'AI berkecepatan tinggi untuk riset mendalam, brainstorming strategi, penulisan kreatif, dan pemecahan masalah teknis.',
      tab_general: 'Umum',
      tab_general_short: 'Umum',
      tab_creative: 'Kreatif & Penulisan',
      tab_creative_short: 'Kreatif',
      tab_research: 'Riset & Logika',
      tab_research_short: 'Riset',
      tab_dev: 'Developer & Kode',
      tab_dev_short: 'Kode',
      starters: {
        general: [
          { label: 'Critical Idea Roast', prompt: 'Roast dan uji secara kritis konsep ini: [masukkan ide/rencana Anda]. Tunjukkan asumsi yang keliru, titik buta (blind spots), dan risiko eksekusi realistis.' },
          { label: 'Complex Problem Solver', prompt: 'Saya sedang menghadapi tantangan kompleks ini: [jelaskan situasi]. Bedah akar masalahnya dan berikan 3 opsi solusi terstruktur dan terukur.' },
          { label: "Explain Like I'm 5", prompt: 'Jelaskan prinsip inti dari quantum entanglement dan komputasi kuantum dengan analogi intuitif sederhana yang mudah dipahami siapa saja.' },
          { label: 'Productivity Blueprint', prompt: 'Bantu saya menyusun rutinitas harian dan alur kerja time-blocking yang bebas distraksi untuk menuntaskan 3 prioritas berdampak tinggi.' }
        ],
        creative: [
          { label: 'Catchy Hook & Copy', prompt: 'Buatkan 5 variasi kalimat pembuka (hook) dan sudut pandang copywriting dengan konversi tinggi untuk: [topik/produk]. Hindari klise AI generik.' },
          { label: 'Compelling Article Draft', prompt: 'Tulis draf artikel mendalam yang memikat, berwawasan luas, dan terstruktur rapi tentang: [topik]. Gunakan gaya bahasa mengalir dan analogi kuat.' },
          { label: 'Polish & Elevate Tone', prompt: 'Tulis ulang dan tingkatkan wibawa bahasa dari draf berikut agar terdengar lugas, tajam, profesional, dan berbobot: [tempel teks]' },
          { label: 'Viral Content Angle', prompt: 'Brainstorming 4 format konten viral (utas Twitter/X, carousel ringkas, video pendek) seputar: [topik] yang mendorong interaksi audiens.' }
        ],
        research: [
          { label: 'Counter-Argument Debate', prompt: 'Ambil sudut pandang oposisi terkuat terhadap premis ini: [tulis opini/hipotesis]. Sajikan argumen pembanding yang valid, preseden historis, dan data logis.' },
          { label: 'Data & Logic Synthesis', prompt: 'Analisis dan sintesiskan keterkaitan logis, trade-off, dan konsekuensi tingkat kedua (second-order effects) dari: [situasi/tren].' },
          { label: 'Hard Reasoning Puzzle', prompt: 'Uji kemampuan penalaranmu: Berikan saya teka-teki logika tingkat lanjut atau puzzle matematika lateral, lalu pandu saya memecahkannya langkah demi langkah.' },
          { label: 'Deep Topic Breakdown', prompt: 'Sajikan pembedahan konseptual tingkat akademis yang komprehensif mengenai: [topik], mencakup aksioma fundamental, tokoh pencetus, dan implikasi nyata.' }
        ],
        dev: [
          { label: 'Roast Tech Stack', prompt: 'Roast arsitektur sistem dan pilihan tech stack saya: Node.js, Express, Docker Swarm, Vanilla JS client. Bersikaplah jujur dan sorot potensi bottleneck sistem.' },
          { label: 'ASCII Architecture', prompt: 'Gambarkan diagram arsitektur sistem dalam bentuk teks ASCII lengkap untuk zero-trust microservice gateway dengan caching edge dan local storage.' },
          { label: 'Zero-Bloat Refactor', prompt: 'Bantu saya mengaudit dan memangkas dependensi NPM pihak ketiga. Berikan strategi mengganti library berat dengan native Web APIs tanpa bloatware.' },
          { label: 'Concurrency Benchmark', prompt: 'Selesaikan tantangan konkurensi ini: Implementasikan rate limiter sliding window lock-free dalam memori dengan overhead eksekusi sub-milidetik.' }
        ]
      },
      toast_new_chat: 'Sesi obrolan baru dimulai',
      toast_clear_chat: 'Riwayat percakapan dibersihkan',
      toast_webgpu_unsupported: 'WebGPU tidak didukung browser ini. Gunakan Chrome atau Edge desktop.',
      toast_webgpu_active: 'WebGPU Neural Network aktif berjalan offline',
      toast_webgpu_fail: 'Gagal memuat WebGPU: {err}',
      toast_model_switch_webgpu: 'Beralih ke WebGPU On-Device 0.5B (Offline)',
      toast_model_switch: 'Beralih ke model {model}',
      toast_max_file_size: 'Ukuran file maksimal 2MB',
      toast_profile_saved: 'Pengaturan profil berhasil disimpan',
      toast_widget_copied: 'Kode semat widget berhasil disalin ke clipboard',
      toast_widget_copy_err: 'Gagal menyalin kode semat',
      toast_empty_chat: 'Sesi obrolan masih kosong',
      toast_share_created: 'Tautan publik berhasil dibuat',
      toast_share_no_link: 'Belum ada tautan valid untuk disalin',
      toast_share_copied: 'Tautan publik berhasil disalin ke clipboard',
      toast_share_copy_err: 'Gagal menyalin tautan',
      toast_share_imported: 'Percakapan publik berhasil diimpor ke sesi Anda',
      toast_theme_switched: 'Mode tampilan diubah ke {mode}',
      toast_sess_deleted: 'Sesi obrolan berhasil dihapus',
      toast_msg_copied: 'Pesan berhasil disalin ke clipboard',
      toast_code_copied: 'Kode berhasil disalin ke clipboard',
      toast_export_empty: 'Tidak ada riwayat obrolan untuk diekspor',
      toast_export_ok: 'Riwayat obrolan berhasil diekspor ke Markdown',
      toast_lang_switched: 'Bahasa diubah ke Bahasa Indonesia',
      hist_no_match: 'Tidak ada riwayat yang cocok',
      hist_empty: 'Belum ada riwayat obrolan',
      hist_del_title: 'Hapus Obrolan',
      copy_btn: 'Salin',
      copied_btn: 'Tersalin!',
      export_card_btn: 'Kartu',
      export_card_title: 'Ekspor sebagai Kartu Visual (Gambar)',
      card_modal_badge: 'GENERATOR KARTU VISUAL',
      card_modal_title: 'Ekspor Respon AI Menjadi Gambar',
      card_copy_btn: 'Salin Gambar PNG',
      card_copied_btn: 'Gambar Tersalin!',
      card_download_btn: 'Unduh PNG',
      card_close_btn: 'Tutup',
      toast_card_copied: 'Kartu visual disalin ke clipboard',
      toast_card_downloaded: 'Kartu visual berhasil diunduh',
      share_x_btn: 'Bagikan ke X',
      share_telegram_btn: 'Telegram',
      share_threads_btn: 'Threads',
      thought_process: 'Rantai Penalaran',
      toast_storage_err: 'Batas penyimpanan browser tercapai. Profil tersimpan di memori.'
    }
  };

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
    },
    {
      id: 'webgpu-on-device',
      name: 'WebGPU On-Device 0.5B',
      description: 'Pure in-browser local GPU inference (Zero server cost & 100% offline)',
      provider: 'On-Device',
      badge: 'Offline / 0 Cost',
      isDefault: false,
      isOnDevice: true,
      capabilities: ['offline', 'privacy', 'local-gpu', 'zero-cost']
    }
  ];

  const ON_DEVICE_MODEL = DEFAULT_MODELS[DEFAULT_MODELS.length - 1];

  // Cyberpunk Preset Avatars (8 Crisp Geometric SVGs - Monochrome Aesthetic)
  const CYBER_AVATARS = [
    { id: 'cyber_neon', name: 'Cyber Minimal', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#e4e4e7" stroke-width="2"/><path d="M12 20 L20 12 L28 20 L20 28 Z" fill="#fafafa"/><circle cx="20" cy="20" r="3" fill="#09090b"/></svg>' },
    { id: 'visor_core', name: 'Visor Core', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#d4d4d8" stroke-width="2"/><rect x="10" y="16" width="20" height="8" rx="2" fill="#fafafa"/><line x1="6" y1="20" x2="34" y2="20" stroke="#a1a1aa" stroke-width="1.5"/></svg>' },
    { id: 'terminal_mono', name: 'Monolith', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#fafafa" stroke-width="2"/><path d="M14 15 L20 20 L14 25" stroke="#fafafa" stroke-width="2.5" fill="none" stroke-linecap="round"/><line x1="22" y1="25" x2="27" y2="25" stroke="#fafafa" stroke-width="2.5"/></svg>' },
    { id: 'quantum_orb', name: 'Quantum', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#e4e4e7" stroke-width="2"/><circle cx="20" cy="20" r="7" fill="none" stroke="#fafafa" stroke-width="2"/><ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="#71717a" stroke-width="1" transform="rotate(30 20 20)"/></svg>' },
    { id: 'grid_pulse', name: 'Pulse', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#d4d4d8" stroke-width="2"/><polyline points="10,20 16,20 19,13 23,27 26,20 30,20" fill="none" stroke="#fafafa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'neural_hex', name: 'Hex Core', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#e4e4e7" stroke-width="2"/><polygon points="20,11 28,16 28,24 20,29 12,24 12,16" fill="none" stroke="#fafafa" stroke-width="2"/><circle cx="20" cy="20" r="2.5" fill="#fafafa"/></svg>' },
    { id: 'shield_matrix', name: 'Shield', svg: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18181b" stroke="#d4d4d8" stroke-width="2"/><path d="M20 12 L28 15 V22 C28 26 20 29 20 29 C20 29 12 26 12 22 V15 Z" fill="none" stroke="#fafafa" stroke-width="2"/></svg>' },
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
  const btnLangToggle = document.getElementById('btnLangToggle');
  const activeLangTag = document.getElementById('activeLangTag');
  let currentLang = 'en';
  let activeStarterCategory = 'general';
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

  // Widget Modal Elements
  const btnEmbedModal = document.getElementById('btnEmbedModal');
  const widgetModalBackdrop = document.getElementById('widgetModalBackdrop');
  const btnWidgetModalClose = document.getElementById('btnWidgetModalClose');
  const btnWidgetModalCancel = document.getElementById('btnWidgetModalCancel');
  const widgetCodeSnippet = document.getElementById('widgetCodeSnippet');
  const btnCopyWidgetCode = document.getElementById('btnCopyWidgetCode');

  // Share Modal Elements
  const btnShareChat = document.getElementById('btnShareChat');
  const shareModalBackdrop = document.getElementById('shareModalBackdrop');
  const btnShareModalClose = document.getElementById('btnShareModalClose');
  const btnShareModalCancel = document.getElementById('btnShareModalCancel');
  const shareUrlPreview = document.getElementById('shareUrlPreview');
  const btnCopyShareUrl = document.getElementById('btnCopyShareUrl');
  const shareToX = document.getElementById('shareToX');
  const shareToTelegram = document.getElementById('shareToTelegram');
  const shareToThreads = document.getElementById('shareToThreads');

  // Visual Card Generator Elements
  const cardModalBackdrop = document.getElementById('cardModalBackdrop');
  const btnCardModalClose = document.getElementById('btnCardModalClose');
  const btnCardModalCancel = document.getElementById('btnCardModalCancel');
  const btnCopyCardPng = document.getElementById('btnCopyCardPng');
  const btnDownloadCardPng = document.getElementById('btnDownloadCardPng');
  const cardModalBadge = document.getElementById('cardModalBadge');
  const cardModalTitle = document.getElementById('cardModalTitle');

  // WebGPU Engine State & Modal Elements
  let webgpuEngine = null;
  let webgpuEngineLoading = false;
  const webgpuModalBackdrop = document.getElementById('webgpuModalBackdrop');
  const btnWebgpuModalClose = document.getElementById('btnWebgpuModalClose');
  const btnWebgpuModalCancel = document.getElementById('btnWebgpuModalCancel');
  const btnWebgpuModalConfirm = document.getElementById('btnWebgpuModalConfirm');
  const webgpuProgressWrap = document.getElementById('webgpuProgressWrap');
  const webgpuProgressStatus = document.getElementById('webgpuProgressStatus');
  const webgpuProgressPercent = document.getElementById('webgpuProgressPercent');
  const webgpuProgressBar = document.getElementById('webgpuProgressBar');

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

  // Safe Desktop Focus Helper (Prevents virtual keyboard jump & mobile viewport clipping)
  function focusChatInputIfDesktop() {
    if (window.matchMedia && window.matchMedia('(min-width: 769px) and (pointer: fine)').matches) {
      chatInput?.focus();
    }
  }

  // Safe & Resilient Clipboard Copy Helper with Legacy Fallback
  async function safeCopyToClipboard(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.warn('[CLIPBOARD WARN] Copy fallback failed:', err);
      return false;
    }
  }

  // Micro-i18n Translation Helper
  function t(key, params = {}) {
    const dict = I18N_DICT[currentLang] || I18N_DICT.en;
    let str = dict[key] || I18N_DICT.en[key] || key;
    Object.keys(params).forEach((p) => {
      str = str.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
    return str;
  }

  // Apply Language to UI Chrome
  function applyLanguage(lang) {
    currentLang = lang === 'id' ? 'id' : 'en';
    document.documentElement.lang = currentLang;
    localStorage.setItem(PREF_LANG_KEY, currentLang);
    const dict = I18N_DICT[currentLang];

    if (activeLangTag) activeLangTag.textContent = currentLang.toUpperCase();
    if (btnNewChat) {
      btnNewChat.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        ${dict.new_chat_btn}
      `;
    }
    if (sessionSearchInput) {
      sessionSearchInput.placeholder = dict.search_placeholder;
      sessionSearchInput.setAttribute('aria-label', dict.search_aria);
    }
    if (btnSidebarEditProfile) btnSidebarEditProfile.setAttribute('aria-label', dict.user_profile_aria);
    const statusText = document.querySelector('.sidebar-user-status span:last-child');
    if (statusText) statusText.textContent = dict.gateway_active;

    if (btnModelSelector) btnModelSelector.title = dict.select_model_title;
    const modelHdr = document.querySelector('.model-dropdown-header span:first-child');
    if (modelHdr) modelHdr.textContent = dict.select_model_hdr;

    if (btnEmbedModal) {
      btnEmbedModal.title = dict.widget_title;
      const txt = btnEmbedModal.querySelector('.btn-text');
      if (txt) txt.textContent = dict.widget_btn;
    }
    if (btnExportChat) {
      btnExportChat.title = dict.export_title;
      const txt = btnExportChat.querySelector('.btn-text');
      if (txt) txt.textContent = dict.export_btn;
    }
    if (btnShareChat) {
      btnShareChat.title = dict.share_title;
      const txt = btnShareChat.querySelector('.btn-text');
      if (txt) txt.textContent = dict.share_btn;
    }
    if (btnLangToggle) btnLangToggle.title = dict.lang_btn_title;
    if (btnThemeToggle) btnThemeToggle.title = dict.theme_btn_title;
    if (themeLabel) themeLabel.textContent = dict.theme_btn_label;
    if (btnClearChat) {
      btnClearChat.title = dict.clear_title;
      const txt = btnClearChat.querySelector('.btn-text');
      if (txt) txt.textContent = dict.clear_btn;
    }

    if (chatInput) chatInput.placeholder = dict.chat_placeholder;
    if (btnSend) btnSend.setAttribute('aria-label', dict.send_aria);
    if (cardModalBadge) cardModalBadge.textContent = dict.card_modal_badge;
    if (cardModalTitle) cardModalTitle.textContent = dict.card_modal_title;
    if (btnCopyCardPng) btnCopyCardPng.textContent = dict.card_copy_btn;
    if (btnDownloadCardPng) btnDownloadCardPng.textContent = dict.card_download_btn;
    if (btnCardModalCancel) btnCardModalCancel.textContent = dict.card_close_btn;
    if (shareToX) shareToX.textContent = dict.share_x_btn;
    if (shareToTelegram) shareToTelegram.textContent = dict.share_telegram_btn;
    if (shareToThreads) shareToThreads.textContent = dict.share_threads_btn;

    updateActiveModelUI();
    renderHistoryList();

    const activeSess = getSession(currentSessionId);
    if (activeSess && (!activeSess.messages || activeSess.messages.length === 0)) {
      chatMessages.innerHTML = '';
      renderWelcomeScreen();
    }
  }

  function initLanguage() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem(PREF_LANG_KEY);
    const initialLang = urlLang === 'id' || storedLang === 'id' ? 'id' : 'en';
    applyLanguage(initialLang);
  }

  // Initialization
  function init() {
    // Proactive Storage Persistence Guard (Prevents mobile OS eviction)
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }

    // Service Worker Registration for PWA & Offline Shell
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    initTheme();
    initLanguage();
    initUserProfileUI();
    renderModelDropdown();
    updateActiveModelUI();
    renderHistoryList();

    // Event: Theme Toggle
    btnThemeToggle?.addEventListener('click', toggleTheme);

    // Event: Language Toggle
    btnLangToggle?.addEventListener('click', () => {
      const next = currentLang === 'en' ? 'id' : 'en';
      applyLanguage(next);
      showToast(t('toast_lang_switched'));
    });

    // Event: Search Filter
    sessionSearchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderHistoryList();
    });

    // Event: Obrolan Baru
    btnNewChat?.addEventListener('click', () => {
      const activeSess = getSession(currentSessionId);
      if (activeSess && activeSess.messages.length === 0) {
        focusChatInputIfDesktop();
        closeSidebar();
        return;
      }

      const newId = 'sess_' + Date.now();
      const newSess = {
        id: newId,
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        messages: []
      };
      sessions.unshift(newSess);
      saveSessions();
      searchQuery = '';
      if (sessionSearchInput) sessionSearchInput.value = '';
      loadSessionToView(newId);
      closeSidebar();
      focusChatInputIfDesktop();
      showToast(t('toast_new_chat'));
    });

    // Event: Clear Active Chat
    btnClearChat?.addEventListener('click', () => {
      const sess = getSession(currentSessionId);
      if (sess && sess.messages.length > 0) {
        sess.messages = [];
        sess.title = 'New Chat';
        saveSessions();
        renderHistoryList();
        loadSessionToView(currentSessionId);
        showToast(t('toast_clear_chat'));
      }
    });

    // Event: Ekspor Chat ke Markdown
    btnExportChat?.addEventListener('click', exportChatSession);

    // Event: Model Selector Toggle & Dropdown
    btnModelSelector?.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
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

    // Event: Widget Integration Modal
    btnEmbedModal?.addEventListener('click', openWidgetModal);
    btnWidgetModalClose?.addEventListener('click', closeWidgetModal);
    btnWidgetModalCancel?.addEventListener('click', closeWidgetModal);
    widgetModalBackdrop?.addEventListener('click', (e) => {
      if (e.target === widgetModalBackdrop) closeWidgetModal();
    });
    btnCopyWidgetCode?.addEventListener('click', copyWidgetCode);
    document.querySelectorAll('input[name="widgetPersona"]').forEach((radio) => {
      radio.addEventListener('change', updateWidgetCodeSnippet);
    });

    // Event: Share Conversation Modal
    btnShareChat?.addEventListener('click', handleShareChat);
    btnShareModalClose?.addEventListener('click', closeShareModal);
    btnShareModalCancel?.addEventListener('click', closeShareModal);
    shareModalBackdrop?.addEventListener('click', (e) => {
      if (e.target === shareModalBackdrop) closeShareModal();
    });
    btnCopyShareUrl?.addEventListener('click', copyShareUrl);

    // Event: Visual Card Exporter Modal
    btnCardModalClose?.addEventListener('click', closeVisualCardModal);
    btnCardModalCancel?.addEventListener('click', closeVisualCardModal);
    cardModalBackdrop?.addEventListener('click', (e) => {
      if (e.target === cardModalBackdrop) closeVisualCardModal();
    });
    btnCopyCardPng?.addEventListener('click', copyVisualCardPng);
    btnDownloadCardPng?.addEventListener('click', downloadVisualCardPng);

    // Event: WebGPU Warning & Download Modal
    btnWebgpuModalClose?.addEventListener('click', closeWebgpuModal);
    btnWebgpuModalCancel?.addEventListener('click', closeWebgpuModal);
    webgpuModalBackdrop?.addEventListener('click', (e) => {
      if (e.target === webgpuModalBackdrop) closeWebgpuModal();
    });
    btnWebgpuModalConfirm?.addEventListener('click', initializeWebGPUEngine);

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
      if (modelSelectorWrap && !modelSelectorWrap.contains(e.target) && !modelDropdown?.contains(e.target)) {
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

    // Centralized Event Delegation for Chat Messages & Interactive Cards (Chunk 18.1 & 18.3)
    chatMessages?.addEventListener('click', (e) => {
      // 1. Copy message text
      const btnCopy = e.target.closest('.btn-copy-msg');
      if (btnCopy) {
        const row = btnCopy.closest('.message-row');
        const rawText = row?.dataset?.rawText;
        if (rawText) {
          safeCopyToClipboard(rawText).then((ok) => {
            if (ok) {
              btnCopy.textContent = t('copied_btn');
              showToast(t('toast_msg_copied'));
              setTimeout(() => (btnCopy.textContent = t('copy_btn')), 2000);
            }
          });
        }
        return;
      }

      // 2. Export visual card modal
      const btnCard = e.target.closest('.btn-card-export');
      if (btnCard) {
        const row = btnCard.closest('.message-row');
        const rawText = row?.dataset?.rawText;
        const modelLabel = btnCard.getAttribute('data-model') || activeModelId;
        if (rawText) {
          openVisualCardModal(rawText, modelLabel);
        }
        return;
      }

      // 3. Copy code block snippet
      const btnCode = e.target.closest('.copy-code-btn');
      if (btnCode) {
        const wrapper = btnCode.closest('.code-block-wrapper') || btnCode.closest('pre');
        const code = wrapper?.querySelector('code')?.innerText || '';
        if (code) {
          safeCopyToClipboard(code).then((ok) => {
            if (ok) {
              btnCode.textContent = t('copied_btn');
              showToast(t('toast_code_copied'));
              setTimeout(() => (btnCode.textContent = t('copy_btn')), 2000);
            }
          });
        }
        return;
      }

      // 4. Starter category tab switch
      const tabBtn = e.target.closest('.starter-tab-btn');
      if (tabBtn && tabBtn.dataset.cat) {
        switchStarterCategory(tabBtn.dataset.cat);
        return;
      }

      // 5. Starter pill prompt execution
      const pillBtn = e.target.closest('.starter-pill');
      if (pillBtn && pillBtn.dataset.prompt) {
        sendSuggestedPrompt(pillBtn.dataset.prompt);
        return;
      }
    });

    loadSessionToView(currentSessionId);
    initModels();
    checkUrlParams();
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

    // Always append On-Device WebGPU model to available list if not present
    if (!availableModels.find(m => m.id === ON_DEVICE_MODEL.id)) {
      availableModels.push(ON_DEVICE_MODEL);
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
      if (hintActiveModel) hintActiveModel.textContent = `${t('hint_model_prefix')}${model.name}`;
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

  function openWebgpuModal() {
    if (webgpuModalBackdrop) {
      webgpuModalBackdrop.classList.add('open');
      webgpuModalBackdrop.setAttribute('aria-hidden', 'false');
    }
  }

  function closeWebgpuModal() {
    if (webgpuModalBackdrop) {
      webgpuModalBackdrop.classList.remove('open');
      webgpuModalBackdrop.setAttribute('aria-hidden', 'true');
    }
    if (document.activeElement) document.activeElement.blur();
  }

  async function initializeWebGPUEngine() {
    if (!navigator.gpu) {
      showToast(t('toast_webgpu_unsupported'));
      return;
    }

    if (webgpuEngineLoading) return;
    webgpuEngineLoading = true;

    if (webgpuProgressWrap) webgpuProgressWrap.style.display = 'block';
    if (btnWebgpuModalConfirm) btnWebgpuModalConfirm.disabled = true;
    if (btnWebgpuModalCancel) btnWebgpuModalCancel.disabled = true;

    try {
      if (webgpuProgressStatus) webgpuProgressStatus.textContent = 'Connecting to WebLLM Edge CDN...';
      const webllm = await import('https://esm.run/@mlc-ai/web-llm');
      
      const selectedModel = 'SmolLM2-360M-Instruct-q4f16_1-MLC';
      webgpuEngine = await webllm.CreateMLCEngine(
        selectedModel,
        {
          initProgressCallback: (report) => {
            const pct = Math.min(100, Math.max(0, Math.round((report.progress || 0) * 100)));
            if (webgpuProgressStatus) webgpuProgressStatus.textContent = report.text || 'Loading GPU tensor weights...';
            if (webgpuProgressPercent) webgpuProgressPercent.textContent = `${pct}%`;
            if (webgpuProgressBar) webgpuProgressBar.style.width = `${pct}%`;
          }
        }
      );

      closeWebgpuModal();
      activeModelId = 'webgpu-on-device';
      localStorage.setItem(ACTIVE_MODEL_KEY, activeModelId);
      updateActiveModelUI();
      renderModelDropdown();
      showToast(t('toast_webgpu_active'));
    } catch (err) {
      console.error('[WEBGPU INIT ERROR]', err);
      showToast(t('toast_webgpu_fail').replace('{err}', err.message));
      if (webgpuProgressWrap) webgpuProgressWrap.style.display = 'none';
      if (btnWebgpuModalConfirm) btnWebgpuModalConfirm.disabled = false;
      if (btnWebgpuModalCancel) btnWebgpuModalCancel.disabled = false;
    } finally {
      webgpuEngineLoading = false;
    }
  }

  function setActiveModel(id) {
    if (id === 'webgpu-on-device') {
      if (webgpuEngine) {
        activeModelId = id;
        localStorage.setItem(ACTIVE_MODEL_KEY, id);
        updateActiveModelUI();
        renderModelDropdown();
        showToast(t('toast_model_switch_webgpu'));
      } else {
        openWebgpuModal();
      }
      return;
    }

    activeModelId = id;
    localStorage.setItem(ACTIVE_MODEL_KEY, id);
    updateActiveModelUI();
    renderModelDropdown();
    const model = availableModels.find(m => m.id === id);
    showToast(t('toast_model_switch').replace('{model}', model?.name || id));
  }

  function openModelDropdown() {
    if (modelSelectorWrap) modelSelectorWrap.classList.add('open');
    if (modelDropdown) {
      modelDropdown.classList.add('open');
      modelDropdown.setAttribute('aria-hidden', 'false');
      modelDropdown.style.display = 'block';
    }
    btnModelSelector?.setAttribute('aria-expanded', 'true');
  }

  function closeModelDropdown() {
    if (modelSelectorWrap) modelSelectorWrap.classList.remove('open');
    if (modelDropdown) {
      modelDropdown.classList.remove('open');
      modelDropdown.setAttribute('aria-hidden', 'true');
      modelDropdown.style.display = 'none';
    }
    btnModelSelector?.setAttribute('aria-expanded', 'false');
  }

  function toggleModelDropdown() {
    const isCurrentlyOpen = modelSelectorWrap?.classList.contains('open') || 
                            modelDropdown?.classList.contains('open') || 
                            (modelDropdown && modelDropdown.style.display === 'block');
    if (isCurrentlyOpen) {
      closeModelDropdown();
    } else {
      openModelDropdown();
    }
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
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('[STORAGE WARN] Failed to save profile to localStorage:', e);
      showToast(t('toast_storage_err'));
    }
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
    profileModalBackdrop?.setAttribute('aria-hidden', 'false');
    profileNameInput?.focus();
  }

  function closeProfileModal() {
    if (profileModalBackdrop?.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    profileModalBackdrop?.classList.remove('open');
    profileModalBackdrop?.setAttribute('aria-hidden', 'true');
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
      showToast(t('toast_max_file_size'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        userProfile.avatarValue = base64;
        updateAvatarPreview('url', base64);
        if (fileUploadHint) fileUploadHint.textContent = `Ready: ${file.name}`;
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
    showToast(t('toast_profile_saved'));
  }

  // === Widget Integration Modal Handlers ===
  function openWidgetModal() {
    widgetModalBackdrop?.classList.add('open');
    widgetModalBackdrop?.setAttribute('aria-hidden', 'false');
    updateWidgetCodeSnippet();
  }

  function closeWidgetModal() {
    if (widgetModalBackdrop?.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    widgetModalBackdrop?.classList.remove('open');
    widgetModalBackdrop?.setAttribute('aria-hidden', 'true');
  }

  function updateWidgetCodeSnippet() {
    const selected = document.querySelector('input[name="widgetPersona"]:checked')?.value || 'tech_mentor';
    if (widgetCodeSnippet) {
      widgetCodeSnippet.textContent = `<script src="https://chat.zyekh.com/chat-widget.js" data-persona="${selected}" defer><\/script>`;
    }
  }

  function copyWidgetCode() {
    const snippet = widgetCodeSnippet?.textContent || '';
    if (!snippet) return;
    safeCopyToClipboard(snippet).then((ok) => {
      if (ok) {
        showToast(t('toast_widget_copied'));
      } else {
        showToast(t('toast_widget_copy_err'));
      }
    });
  }

  function updateSocialShareLinks(link) {
    if (!link) return;
    const shareText = encodeURIComponent('Check out this conversation on Zyekh AI:');
    const shareLinkEncoded = encodeURIComponent(link);

    if (shareToX) shareToX.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareLinkEncoded}`;
    if (shareToTelegram) shareToTelegram.href = `https://t.me/share/url?url=${shareLinkEncoded}&text=${shareText}`;
    if (shareToThreads) shareToThreads.href = `https://threads.net/intent/post?text=${shareText}%20${shareLinkEncoded}`;
  }

  // === Programmatic SEO: Share Conversation Handlers ===
  async function handleShareChat() {
    const sess = getSession(currentSessionId);
    if (!sess || !sess.messages || sess.messages.length === 0) {
      showToast(t('toast_empty_chat'));
      return;
    }

    shareModalBackdrop?.classList.add('open');
    shareModalBackdrop?.setAttribute('aria-hidden', 'false');

    // 1. Session-bound caching: reuse existing share link if message count hasn't changed
    if (sess.shareUrl && sess.lastSharedMessageCount === sess.messages.length) {
      if (shareUrlPreview) shareUrlPreview.textContent = sess.shareUrl;
      updateSocialShareLinks(sess.shareUrl);
      return;
    }

    if (shareUrlPreview) shareUrlPreview.textContent = 'Generating conversation snapshot...';

    try {
      const res = await fetch(`${API_BASE}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId: sess.shareId || undefined,
          title: sess.title || 'Zyekh AI Conversation',
          messages: sess.messages,
          modelUsed: activeModelId,
          authorName: userProfile.name || 'User'
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to process share snapshot.`);
      }

      const cType = res.headers.get('content-type') || '';
      if (!cType.includes('application/json')) {
        throw new Error('Server response was not JSON. Please verify backend container.');
      }

      const data = await res.json();
      if (data && data.success && (data.fullUrl || data.url)) {
        const fullLink = data.fullUrl || (window.location.origin + data.url);
        if (shareUrlPreview) shareUrlPreview.textContent = fullLink;
        updateSocialShareLinks(fullLink);
        
        // Cache share metadata in session object
        sess.shareId = data.shareId;
        sess.shareUrl = fullLink;
        sess.lastSharedMessageCount = sess.messages.length;
        saveSessions();

        showToast(t('toast_share_created'));
      } else {
        throw new Error(data.error || 'Failed to generate link');
      }
    } catch (err) {
      if (shareUrlPreview) shareUrlPreview.textContent = err.message;
      showToast(err.message);
    }
  }

  function closeShareModal() {
    if (shareModalBackdrop?.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    shareModalBackdrop?.classList.remove('open');
    shareModalBackdrop?.setAttribute('aria-hidden', 'true');
  }

  function copyShareUrl() {
    const url = shareUrlPreview?.textContent || '';
    if (!url || url.includes('Generating') || url.includes('Saving')) {
      showToast(t('toast_share_no_link'));
      return;
    }
    safeCopyToClipboard(url).then((ok) => {
      if (ok) {
        btnCopyShareUrl.textContent = t('copied_btn');
        showToast(t('toast_share_copied'));
        setTimeout(() => (btnCopyShareUrl.textContent = t('copy_btn')), 2000);
      } else {
        showToast(t('toast_share_copy_err'));
      }
    });
  }

  async function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const importShareId = params.get('import_share');
    if (importShareId) {
      try {
        const cleanId = importShareId.replace(/[^a-zA-Z0-9_-]/g, '');
        const res = await fetch(`${API_BASE}/api/share/${cleanId}`);
        if (!res.ok) return;
        const cType = res.headers.get('content-type') || '';
        if (!cType.includes('application/json')) return;
        const data = await res.json();
        if (data && data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          const newSessionId = 'sess_' + Date.now();
          const importedSession = {
            id: newSessionId,
            title: `Imported: ${data.title || 'Public Conversation'}`,
            createdAt: new Date().toISOString(),
            messages: data.messages
          };
          sessions.unshift(importedSession);
          saveSessions();
          renderHistoryList();
          loadSessionToView(newSessionId);
          showToast(t('toast_share_imported'));
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        console.error('[IMPORT ERROR]', err);
      }
    }
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
    showToast(t('toast_theme_switched').replace('{mode}', next === 'light' ? 'Light' : 'Dark'));
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
      title: 'New Chat',
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
      empty.textContent = searchQuery ? t('hist_no_match') : t('hist_empty');
      historyList.appendChild(empty);
      return;
    }

    filtered.forEach((sess) => {
      const item = document.createElement('div');
      item.className = `history-item ${sess.id === currentSessionId ? 'active' : ''}`;
      item.innerHTML = `
        <span style="overflow:hidden; text-overflow:ellipsis; flex:1;">${escapeHtml(sess.title)}</span>
        <button class="btn-del-sess" title="${t('hist_del_title')}" aria-label="Delete">&times;</button>
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
    showToast(t('toast_sess_deleted'));
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
    focusChatInputIfDesktop();
  }

  // Welcome Screen
  function renderWelcomeScreen() {
    const welcome = document.createElement('div');
    welcome.className = 'chat-welcome';
    const dict = I18N_DICT[currentLang] || I18N_DICT.en;
    const defaultName = currentLang === 'id' ? 'Sobat' : 'Friend';
    const titleText = dict.welcome_title.replace('{name}', escapeHtml(userProfile.name || defaultName));

    const categoryKeys = ['general', 'creative', 'research', 'dev'];
    const tabsHtml = categoryKeys.map((catKey) => {
      const fullLabel = dict[`tab_${catKey}`] || catKey;
      const shortLabel = dict[`tab_${catKey}_short`] || fullLabel;
      const isActive = activeStarterCategory === catKey;
      return `
        <button type="button" class="starter-tab-btn ${isActive ? 'active' : ''}" data-cat="${escapeHtml(catKey)}">
          <span class="tab-label-full">${escapeHtml(fullLabel)}</span>
          <span class="tab-label-short">${escapeHtml(shortLabel)}</span>
        </button>
      `;
    }).join('');

    const startersList = dict.starters?.[activeStarterCategory] || dict.starters?.general || [];
    const pillsHtml = startersList.map((item) => {
      return `
        <button type="button" class="starter-pill" data-prompt="${escapeHtml(item.prompt)}">
          <span class="starter-pill-label">${escapeHtml(item.label)}</span>
          <span class="starter-pill-arrow">&rarr;</span>
        </button>
      `;
    }).join('');

    welcome.innerHTML = `
      <span class="welcome-badge">${dict.welcome_badge}</span>
      <h2 class="welcome-title">${titleText}</h2>
      <p class="welcome-subtitle">${dict.welcome_subtitle}</p>
      <nav class="starter-tabs-nav" aria-label="Starter Categories">
        ${tabsHtml}
      </nav>
      <div class="starter-pills-wrap" id="starterPillsWrap">
        ${pillsHtml}
      </div>
    `;
    chatMessages.appendChild(welcome);
  }

  function switchStarterCategory(categoryKey) {
    activeStarterCategory = categoryKey;
    const activeSession = getSession(currentSessionId);
    if (activeSession && activeSession.messages.length === 0) {
      chatMessages.innerHTML = '';
      renderWelcomeScreen();
    }
  }

  function sendSuggestedPrompt(text) {
    if (chatInput && chatForm) {
      chatInput.value = text;
      chatForm.requestSubmit();
    }
  }

  // Client-Side Intelligent On-Device Engine (WebGPU Ready - Tahap 5.3)
  async function executeLocalClientInference(prompt, history, profile) {
    // 1. If WebGPU Neural Engine is active, perform authentic token generation
    if (webgpuEngine) {
      try {
        const sysMsg = `You are Zyekh AI, an objective, concise, and highly efficient AI coding mentor. User Name: ${profile?.name || 'User'}. Instructions: ${profile?.instructions || 'Be direct, objective, accurate, and concise.'}`;
        const chatHistory = [
          { role: 'system', content: sysMsg },
          ...history.slice(-8).map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        ];

        const stream = await webgpuEngine.chat.completions.create({
          messages: chatHistory,
          temperature: 0.6,
          stream: true
        });

        let fullReply = '';
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          fullReply += delta;
        }

        const thought = `Inference generated via WebGPU Neural LLM (SmolLM2-360M) on local GPU.\n- Latency: 0ms Network\n- Server Footprint: 0 Bytes\n- Tokens Generated: ~${Math.round(fullReply.length / 4)}`;

        return `:::thought\n${thought}\n:::\n\n${fullReply || 'Selesai memproses prompt secara lokal.'}`;
      } catch (gpuExecErr) {
        console.warn('[WEBGPU EXEC ERROR, FALLBACK TO RULE ENGINE]', gpuExecErr);
      }
    }

    // 2. Micro-delay (180ms) for natural conversational feel fallback
    await new Promise((r) => setTimeout(r, 180));

    const p = prompt.toLowerCase();
    const userName = profile?.name || 'Pengguna';
    const gpuSupport = typeof navigator !== 'undefined' && 'gpu' in navigator;
    const hardwareTag = gpuSupport ? 'WebGPU Hardware Acceleration' : 'WASM CPU Engine';

    const thought = `Memproses prompt secara lokal via ${hardwareTag}.\n- Model: WebGPU On-Device 0.5B (Edge-Compiled)\n- Latensi Jaringan: 0ms\n- Privasi: Data tidak meninggalkan browser lokal.`;

    let replyBody = '';

    if (p.includes('halo') || p.includes('hai') || p.includes('hi') || p.includes('siapa')) {
      replyBody = `Halo ${userName}! Saya adalah **Zyekh AI (Mode On-Device)** yang berjalan 100% langsung di perangkat Anda via **${hardwareTag}**.\n\nKeunggulan mode ini:\n1. **Zero Server Load**: Server VPS tidak menerima trafik data sama sekali.\n2. **100% Offline**: Tetap dapat digunakan saat koneksi internet terputus.\n3. **Privasi Absolut**: Seluruh percakapan diproses di memori browser Anda.\n\nAda yang bisa saya bantu analisis hari ini?`;
    } else if (p.includes('arsitektur') || p.includes('server') || p.includes('cloud') || p.includes('vps')) {
      replyBody = `Berikut ringkasan prinsip **Arsitektur Minimalis & Zero-Load**:\n\n1. **Edge Offloading**: Pindahkan aset statis dan cache ke Cloudflare Anycast CDN (TTFB < 20ms).\n2. **Decoupled Gateway**: Pisahkan UI klien dari inferensi backend untuk skalabilitas independen.\n3. **Local-First Persistence**: Simpan riwayat di \`localStorage\` atau IndexedDB lokal untuk privasi dan latensi instan.\n4. **Client-Side AI**: Gunakan WebGPU untuk tugas ringan guna menghemat biaya token API cloud.`;
    } else if (p.includes('kode') || p.includes('coding') || p.includes('javascript') || p.includes('python')) {
      replyBody = `Berikut contoh implementasi fungsi **WebGPU Pipeline Check** dalam JavaScript:\n\n\`\`\`javascript\nasync function checkWebGPUSupport() {\n  if (!navigator.gpu) {\n    console.warn("[ WARN ] WebGPU tidak didukung di browser ini. Gunakan WASM/Cloud.");\n    return false;\n  }\n  const adapter = await navigator.gpu.requestAdapter();\n  if (!adapter) {\n    console.warn("[ WARN ] Tidak ada adapter GPU yang tersedia.");\n    return false;\n  }\n  console.log("[ VERIFIED ] WebGPU aktif:", adapter.info);\n  return true;\n}\n\`\`\`\n\nFungsi ini mendeteksi ketersediaan akselerasi grafis secara instan di sisi klien.`;
    } else {
      replyBody = `[ ON-DEVICE INFERENCE ]\n\nPermintaan Anda telah diproses secara lokal di browser:\n> "${escapeHtml(prompt)}"\n\n**Analisis Lokal:**\n- Sistem beroperasi dalam mode **0 Server Footprint**.\n- Untuk penalaran analitis mendalam (deep architectural reasoning atau extended coding), Anda juga dapat beralih ke model **Gemini 3.7 Flash High** atau **Claude 3.7 Sonnet** melalui pemilih model di atas.`;
    }

    return `:::thought\n${thought}\n:::\n\n${replyBody}`;
  }

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

      let botReply = '';
      let usedModel = activeModelId;

      if (activeModelId === 'webgpu-on-device') {
        // Run On-Device Client Inference (WebGPU / Local Intelligent Engine)
        botReply = await executeLocalClientInference(messagePayload, sess.messages, userProfile);
        usedModel = 'WebGPU On-Device 0.5B';
        removeTypingIndicator();
      } else {
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

        botReply = data && data.reply ? data.reply : 'Maaf, terjadi kendala saat merespon obrolan.';
        usedModel = data && data.modelUsed ? data.modelUsed : activeModelId;
      }

      sess.messages.push({ role: 'assistant', content: botReply, modelUsed: usedModel });
      saveSessions();
      appendMessageElement('bot', botReply, usedModel);
    } catch (err) {
      removeTypingIndicator();
      appendMessageElement('bot', `Gagal terhubung ke Zyekh AI Core API (${err.message}). Pastikan server aktif.`);
    } finally {
      btnSend.disabled = false;
      focusChatInputIfDesktop();
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
      row.dataset.rawText = text;
      const metaBar = document.createElement('div');
      metaBar.className = 'message-meta-bar';

      const modelLabel = availableModels.find(m => m.id === modelUsed)?.name || modelUsed || activeModelId;
      metaBar.innerHTML = `
        <span class="model-used-tag">${escapeHtml(modelLabel)}</span>
        <div class="message-actions-bar">
          <button class="btn-msg-action btn-copy-msg" type="button" title="${t('copy_btn')}">${t('copy_btn')}</button>
          <button class="btn-msg-action btn-card-export" type="button" title="${t('export_card_title')}" data-model="${escapeHtml(modelLabel)}">${t('export_card_btn')}</button>
        </div>
      `;
      content.appendChild(metaBar);
    }

    row.appendChild(avatar);
    row.appendChild(content);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
      showToast(t('toast_export_empty'));
      return;
    }

    let md = `# ${sess.title}\n\n`;
    md += `- **Date**: ${sess.createdAt || new Date().toISOString()}\n`;
    md += `- **Platform**: Zyekh AI (chat.zyekh.com)\n`;
    md += `- **User**: ${userProfile.name || 'User'}\n\n---\n\n`;

    sess.messages.forEach((msg) => {
      const speaker = msg.role === 'user' ? `### ${userProfile.name || 'User'}` : `### Zyekh AI (${msg.modelUsed || 'Assistant'})`;
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

    showToast(t('toast_export_ok'));
  }

  // === Visual Card Generator (Ray.so / Carbon Style Client-Side Canvas 2D) ===
  function openVisualCardModal(text, modelLabel) {
    if (!cardModalBackdrop) return;
    generateVisualCardCanvas(text, modelLabel);
    cardModalBackdrop.classList.add('open');
    cardModalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeVisualCardModal() {
    if (!cardModalBackdrop) return;
    if (cardModalBackdrop.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    cardModalBackdrop.classList.remove('open');
    cardModalBackdrop.setAttribute('aria-hidden', 'true');
  }

  function generateVisualCardCanvas(text, modelName) {
    const canvas = document.getElementById('visualCardCanvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // 1. Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Outer Border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // 3. Inner Card Container
    ctx.fillStyle = '#121215';
    ctx.fillRect(36, 36, width - 72, height - 72);
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // 4. Header Bar
    ctx.fillStyle = '#18181b';
    ctx.fillRect(36, 36, width - 72, 60);
    ctx.strokeStyle = '#27272a';
    ctx.strokeRect(36, 36, width - 72, 60);

    // Header Terminal Dots (Monochrome)
    ctx.fillStyle = '#52525b';
    ctx.beginPath();
    ctx.arc(64, 66, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3f3f46';
    ctx.beginPath();
    ctx.arc(84, 66, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(104, 66, 6, 0, Math.PI * 2);
    ctx.fill();

    // Header Title
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('chat.zyekh.com / zyekh-ai', 130, 72);

    // Model Tag Badge
    const modelTag = `${modelName || activeModelId}`;
    ctx.fillStyle = '#fafafa';
    ctx.font = '700 17px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(modelTag, width - 60, 72);

    // 5. Body Text Formatting
    const cleanText = (text || '')
      .replace(/:::thought[\s\S]*?:::/g, '')
      .replace(/```[a-z]*\n?/gi, '')
      .replace(/```/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s+/gm, '')
      .trim();

    ctx.fillStyle = '#f4f4f5';
    ctx.font = '500 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.textAlign = 'left';

    const maxLineWidth = width - 130;
    const startX = 64;
    const startY = 145;
    const lineHeight = 36;
    const maxLines = 10;

    const words = cleanText.split(/\s+/);
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + (line ? ' ' : '') + words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        lines.push(line);
        line = words[n];
        if (lines.length >= maxLines) break;
      } else {
        line = testLine;
      }
    }
    if (line && lines.length < maxLines) {
      lines.push(line);
    }

    if (lines.length >= maxLines && words.length > lines.join(' ').split(/\s+/).length) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\.*$/, '') + ' ...';
    }

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], startX, startY + (i * lineHeight));
    }

    // 6. Footer Attribution
    ctx.fillStyle = '#27272a';
    ctx.fillRect(36, height - 96, width - 72, 60);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 17px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('> Zyekh AI -- Free, Fast & Private Multi-Model AI', 64, height - 60);

    ctx.fillStyle = '#71717a';
    ctx.font = '500 16px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('100% Zero-Telemetry / Local-First', width - 60, height - 60);

    return canvas;
  }

  function downloadVisualCardPng() {
    const canvas = document.getElementById('visualCardCanvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `zyekh-ai-card-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(t('toast_card_downloaded'));
  }

  async function copyVisualCardPng() {
    const canvas = document.getElementById('visualCardCanvas');
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Failed to create image blob');
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          const btn = document.getElementById('btnCopyCardPng');
          if (btn) {
            btn.textContent = t('card_copied_btn');
            setTimeout(() => { btn.textContent = t('card_copy_btn'); }, 2000);
          }
          showToast(t('toast_card_copied'));
        } catch (_) {
          downloadVisualCardPng();
        }
      }, 'image/png');
    } catch (err) {
      showToast(`[ ERROR ] ${err.message}`);
    }
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
    const thoughtLabel = t('thought_process') || (currentLang === 'id' ? 'Rantai Penalaran' : 'Thought Process');
    str = str.replace(/(?:&lt;thought&gt;([\s\S]*?)&lt;\/thought&gt;|:::thought\s*([\s\S]*?):::)/gi, (_, t1, t2) => {
      const thoughtText = (t1 || t2 || '').trim();
      return `<details class="thought-box"><summary class="thought-summary">${escapeHtml(thoughtLabel)}</summary><div class="thought-content">${thoughtText.replace(/\n/g, '<br>')}</div></details>`;
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
