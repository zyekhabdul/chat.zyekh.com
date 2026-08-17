# chat.zyekh.com — Zyekh AI Companion Web App

Antarmuka web interaktif mandiri (*Full-Screen Standalone Web App*) untuk **Zyekh AI Companion**, teman ngobrol cerdas, diskusi ide, refleksi harian, dan asisten digital.

---

## Fitur Utama
* **Local-First & Zero-Framework**: Dibangun murni menggunakan Vanilla JS (ESNext), semantic HTML5, dan modern CSS variables tanpa beban bundle SPA yang lambat.
* **Multi-Session Storage**: Manajemen riwayat percakapan tersimpan secara privat di local browser (`localStorage`) pengguna.
* **Syntax Highlighting & Copy Button**: Format penulisan kode program otomatis rapi dengan tombol *Copy to Clipboard* 1 klik.
* **Internal API Reverse Proxy**: Dilengkapi proxy API internal sehingga kompatibel langsung dengan SSH Port Forwarding, Cloudflare Tunnel, maupun custom domain tanpa kendala CORS.
* **Responsive Mobile Drawer**: Tampilan responsif dengan navigasi geser di smartphone dan tablet.

---

## Menjalankan Secara Lokal
```bash
# Masuk ke direktori
cd Projects/chat.zyekh.com

# Jalankan server
npm start
```
Akses di browser: `http://localhost:3001`

---

## Privasi & Keamanan
* Zero telemetry / zero tracking.
* Konfigurasi backend, token, dan infrastruktur cloud terisolasi di sisi server (zero client-side leakage).
