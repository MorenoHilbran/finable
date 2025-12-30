# 💡 FINABLE — Platform Edukasi Investasi Inklusif untuk Penyandang Disabilitas

Finable adalah platform edukasi investasi berbasis web yang dirancang untuk memberikan akses literasi keuangan yang setara bagi penyandang disabilitas. Platform ini menghadirkan pengalaman belajar yang adaptif dengan memanfaatkan AI Assistant bernama **OWI** (Open Wisdom Intelligence), sehingga informasi investasi dapat dipahami dengan lebih mudah, jelas, dan sesuai kebutuhan setiap pengguna.

---

## 🎯 Tujuan Platform
- Menyederhanakan konsep dan istilah investasi yang kompleks
- Memastikan akses edukasi dapat dinikmati oleh berbagai jenis disabilitas
- Menjadi pendamping belajar finansial yang aman, adaptif, dan bebas hambatan
- Mengurangi ketimpangan literasi keuangan pada kelompok rentan

---

## 📌 Latar Belakang

Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) yang diselenggarakan oleh OJK dan BPS menunjukkan bahwa indeks literasi keuangan nasional masih berada pada tingkat yang lebih rendah dibandingkan indeks inklusi keuangan, terutama pada sektor non-perbankan seperti pasar modal dan instrumen investasi. Kondisi ini mengindikasikan bahwa banyak masyarakat, termasuk kelompok penyandang disabilitas, telah memiliki akses terhadap layanan keuangan namun belum dibarengi dengan pemahaman yang memadai untuk memanfaatkannya secara bijak dan mandiri. Kesenjangan pemahaman ini berpotensi menyebabkan kesalahan dalam pengambilan keputusan finansial, rendahnya partisipasi dalam instrumen investasi, serta memperlebar kesenjangan kesejahteraan.

Penyandang disabilitas merupakan kelompok yang masih menghadapi hambatan akses informasi finansial karena keterbatasan layanan pendukung seperti screen reader, bahasa isyarat, serta materi edukasi yang mudah dipahami sesuai kebutuhan mereka. Oleh karena itu, dibutuhkan sebuah platform edukasi keuangan yang inklusif, adaptif, serta memfasilitasi pembelajaran investasi bagi penyandang disabilitas secara mandiri dan aman.

---

## 👥 Pengguna Utama
| Tipe Disabilitas | Dukungan Fitur |
|-----------------|----------------|
| Tunanetra | Text-to-Speech, ARIA Labels, Screen Reader Support |
| Tunarungu | Captionable Content, Visual-first Learning UI |
| Disabilitas Daksa | Full Keyboard Navigation, Large Click Area |
| Disabilitas Kognitif Ringan | Plain Language Content, Micro-Learning |

---

## ⭐ Fitur Utama Finable (MVP)

### 1️⃣ Adaptive Accessibility Profiling
Platform menyesuaikan UI dan konten sesuai profil aksesibilitas pengguna:
- High Contrast Mode
- Ukuran font dinamis
- State management preferensi
- Struktur semantik untuk screen reader

---

### 2️⃣ AI Assistant — **OWI (Open Wisdom Intelligence)**
Asisten konsultan investasi berbasis **RAG**:
- Bahasa sederhana & edukatif
- Voice Input & Text-to-Speech Output
- Chat history per sesi pembelajaran
- Referensi valid dari regulasi OJK & materi literasi resmi

> ❗ Fokus edukasi → **bukan** platform transaksi investasi

---

### 3️⃣ Micro-Learning Adaptif
Modul singkat berbasis multi-modal:
- Fundamental keuangan & investasi pemula
- Audio Learning Support
- Progress tracking

---

### 4️⃣ Simulasi Investasi Sederhana
- Kalkulator pertumbuhan aset jangka panjang
- Grafik kontras tinggi
- Alt-text deskriptif otomatis
- Tidak mengandung aksi jual-beli

---

## 🔐 Prinsip Aksesibilitas — Mengacu WCAG 2.2

| Pilar Aksesibilitas | Implementasi |
|---|---|
| Perceivable | Audio, kontras warna tinggi, caption |
| Operable | Full keyboard navigation |
| Understandable | Plain language + icon clarity |
| Robust | ARIA support & screen reader friendly |

---

## 🎨 System Design — Inclusive UI/UX

### 🎨 Palet Warna Aksesibel

| Warna | Hex | Peran UI | Aksesibilitas |
|------|-----|----------|--------------|
| Finable Deep Blue | `#003366` | Primary | AAA ✔ |
| Emerald Green | `#009B72` | Akzent edukasi keuangan | AA ✔ |
| Soft White | `#F5F5F5` | Background | High contrast ✔ |
| Dark Charcoal | `#1A1A1A` | Teks utama | AAA ✔ |
| Golden Yellow | `#FFC845` | OWI Identity Highlight | Aksen visual |

> Prinsip: Warna **tidak menjadi indikator tunggal** dalam penyampaian informasi

---

### ✍️ Tipografi

| Kebutuhan | Font | Keunggulan |
|----------|------|------------|
| Heading | **Atkinson Hyperlegible** | Dibuat khusus untuk low-vision & disleksia |
| Body | **Roboto / Source Sans Pro** | Keterbacaan tinggi |
| Data Keuangan | **Inter** | Angka mudah dibaca |

Standar akses UX:
- Body font minimum **16px**
- Line-height **1.5–1.7**
- Hindari italic panjang & tight spacing

---

### 🧭 Navigasi & Layout
✔ Focus indicator jelas  
✔ ARIA role & label lengkap  
✔ Button minimum **44×44 px**  
✔ Breadcrumb onboarding  
✔ Ikon disertai label teks  
✔ Bentuk komponen rounded (tidak menusuk visual)

---

### ♿ Mode Aksesibilitas Opsional
| Mode | Deskripsi Implementasi |
|------|-----------------------|
| High Contrast | Untuk low vision |
| Screen Reader Mode | Alt-text + ARIA lengkap |
| Dyslexic-Friendly Mode | Hyperlegible spacing |
| Audio Learning Mode | Materi otomatis menjadi audio |
| Sign Language Support | BISINDO untuk konten video |
| Reduced Motion | Animasi direduksi |

---

## 🗄️ Structured Database
Finable menggunakan relational database (PostgreSQL) yang dikelola melalui Supabase untuk memastikan data pengguna, pembelajaran, dan interaksi AI tersimpan secara aman, terstruktur, dan mudah dikembangkan.

### 📘 Entity Relationship Diagram (ERD)
<img width="750" alt="Financial Literacy Learning-2025-12-21-172307" src="https://github.com/user-attachments/assets/19c0c07a-882a-4135-9c7c-45d684428af4" />

### 🧩 Penjelasan Entitas
👤 USERS
- Menyimpan data inti pengguna dan profil aksesibilitas, yang menjadi dasar adaptasi UI, konten, dan interaksi OWI.

📊 FINANCIAL_ASSESSMENT
- Menyimpan hasil asesmen kesiapan finansial pengguna (literasi, risiko, dan readiness score).
- Digunakan untuk:
- Menentukan jalur pembelajaran
- Menyesuaikan bahasa & kompleksitas AI

📚 LEARNING_MODULES
- Berisi modul micro-learning investasi inklusif (teks, audio, visual).

📈 USER_PROGRESS
- Tabel penghubung (many-to-many) antara pengguna dan modul:
- Tracking progres belajar
- Adaptive learning path

🦉 OWI_CHAT_HISTORY
- Menyimpan riwayat interaksi pengguna dengan OWI AI Assistant:
- Personalisasi pembelajaran
- Evaluasi kualitas respons AI
- Context memory untuk RAG

💰 INVESTMENT_SIMULATION
- Menyimpan simulasi edukatif (non-transaksional):
- Perhitungan pertumbuhan aset
- Visualisasi risiko & return

### 🔗 Penjelasan Relasi
| Relasi                        | Tipe         | Deskripsi                                     |
| ----------------------------- | ------------ | --------------------------------------------- |
| Users → Financial_Assessment  | One-to-Many  | Pengguna dapat melakukan asesmen berkali-kali |
| Users ↔ Learning_Modules      | Many-to-Many | Melalui User_Progress                         |
| Users → OWI_Chat_History      | One-to-Many  | Riwayat percakapan AI                         |
| Users → Investment_Simulation | One-to-Many  | Simulasi investasi edukatif                   |

---

## 🦉 Filosofi Maskot — **OWI (Owl Investment Assistant)**
| Elemen | Makna |
|--------|------|
| Burung Hantu (Owl) | Kebijaksanaan & kemampuan melihat dalam gelap (tantangan finansial) |
| Mata besar | Analisis dan perhatian pada detail |
| AI Asisten | Pemandu investasi yang sabar, inklusif & adaptif |
| Ability & Vision | Semua orang mampu merencanakan masa depan finansial |

> **OWI membantu pengguna "melihat" peluang investasi yang sebelumnya tidak terlihat.**

---

## 💻 Teknologi Pendukung
- **Next.js 14+** (App Router)
- **Tailwind CSS**
- **Supabase** — autentikasi & data
- **Google GenAI / OpenAI SDK**
- **RAG Architecture**
- Deployment: **Vercel**

---

## 🚧 Batasan Produk (MVP)
- Tidak menyelenggarakan transaksi jual-beli instrumen investasi
- Tidak memberikan jaminan keuntungan
- Fitur audio memerlukan koneksi internet dan izin mikrofon

---

## 🌱 Dampak Sosial
Finable mendorong:
- Kemandirian finansial bagi penyandang disabilitas
- Inklusi keuangan nasional
- Pencegahan misinformasi finansial
- Kontribusi terhadap **SDGs: Reduced Inequalities**

---

> **Finable hadir bukan untuk keuntungan semata — tetapi untuk memperjuangkan kesetaraan dalam akses literasi investasi. Karena setiap orang berhak cerdas secara finansial.** 🟦🟩🤝
