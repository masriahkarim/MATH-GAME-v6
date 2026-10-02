# MATH RUSH 🚀

> **“5 Minit. 1 Misi. Jadi Math Hero!”**  
> *A fun 5-minute maths adventure for young Math Heroes.*

MATH RUSH ialah sebuah permainan arked matematik pantas dan interaktif yang direka khusus untuk kanak-kanak berumur 7 hingga 12 tahun. Pemain memilih wira maskot kegemaran mereka, menjawab soalan matematik mengikut tahap umur, membina kombo berterusan, dan menewaskan musuh utama **Math Dragon** dalam pusingan Final Boss 5 minit!

---

## 🌟 Features (Ciri-Ciri Utama)

- **Misi Pantas 5 Minit**: Sesi permainan berfokus dengan pemasa undur, amaran keterujaan (*“🔥 LAST MINUTE!”* & *“🚀 FINAL PUSH!”*).
- **3 Tahap Umur Khas**:
  - 🟢 **7–8 Tahun**: Operasi Tambah, Tolak, Sifir Asas & Bentuk Geometri.
  - 🔵 **9–10 Tahun**: Operasi Darab, Bahagi, Pecahan Mudah & Wang Ringgit.
  - 🟣 **11–12 Tahun**: Operasi Campuran, Peratus, Nisbah & Ukuran.
- **4 Maskot Berpersonaliti**:
  - 🐼 **Panda Hero** (*Tenang dan bijak*)
  - 🤖 **Robo Bot** (*Pantas dan suka nombor*)
  - 🐱 **Kucing Oyen** (*Lincah dan ceria*)
  - 🦖 **Dino Boy** (*Berani dan kuat*)
- **Ekspresi Wajah Dinamik**: Maskot bertindak balas mengikut emosi (Biasa 🙂, Betul 😄, Super Combo 🤩, Cuba Lagi 😮, Menang 🎉).
- **Pertarungan Epik Final Boss**: Berhadapan dengan **Math Dragon** dengan 3 lapisan perisai untuk memenangi Crystal Ajaib!
- **Sistem Ganjaran Lengkap**:
  - ⭐ **Stars**: Diperoleh dengan menjawab betul, bonus round, dan kombo.
  - 🏆 **XP & Level Up**: Capai tahap baharu (Level 1 hingga 5: *Math Explorer*, *Number Ninja*, *Math Dragon Slayer*).
  - 🔥 **Daily Streak**: Rekod hari bermain berturut-turut yang disimpan secara automatik.
  - 🎖️ **Sistem Lencana (Badges)**: 8 lencana pencapaian untuk dibuka.
  - 🛍️ **Almari Aksesori (Closet)**: Pasang topi roket 🚀, cermin mata bintang ⭐, mahkota raja math 👑, dan sayap emas 🪽.
- **Kesan Audio Sintesis Ceria**: Tiada fail MP3 berat; menggunakan Web Audio API sepenuhnya untuk bunyi *ding* betul, kombo naik, dan lagu kemenangan wira.
- **100% Client-Side & Luar Talian**: Berfungsi sepenuhnya dalam pelayar tanpa memerlukan pelayan backend atau pangkalan data luar.
- **Penyimpanan Setempat (localStorage)**: Semua data tahap, bintang, kombo, lencana, dan tetapan bunyi disimpan rapi di dalam pelayar peranti.

---

## 🛠️ Technology (Teknologi)

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API (Native browser sound synthesis)
- **Deployment Target**: [GitHub Pages](https://pages.github.com/) (Static Web Application)

---

## 💻 Run Locally (Menjalankan Secara Tempatan)

Ikuti langkah mudah ini untuk menjalankan permainan di komputer anda:

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/USERNAME/math-rush.git
   cd math-rush
   ```

2. **Pasang pakej dependensi:**
   ```bash
   npm install
   ```

3. **Mulakan server pembangunan (development server):**
   ```bash
   npm run dev
   ```

4. Buka pelayar web dan layari alamat:
   ```
   http://localhost:3000
   ```

5. **Uji binaan pengeluaran (production build):**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🚀 Deploy to GitHub Pages (Cara Publish ke GitHub Pages)

Project ini telah siap dikonfigurasikan khas untuk repository **`MATH-GAME`** (`https://masriahkarim.github.io/MATH-GAME/`).

### Kaedah 1: Menggunakan GitHub Actions (Paling Disyorkan & Automatik)

1. **Tolak (*push*) kod ke repository GitHub anda:**
   ```bash
   git add .
   git commit -m "fix: Update GitHub Pages configuration with base path and build workflow"
   git push origin main
   ```

2. **Aktifkan GitHub Actions di Settings GitHub:**
   - Buka repository **`MATH-GAME`** di laman web GitHub.
   - Klik tab **Settings** (ikon gear di atas).
   - Di menu sebelah kiri, klik **Pages**.
   - Pada bahagian **Source**, tukar pilihan kepada:
     👉 **GitHub Actions** *(jangan guna Deploy from a branch)*.
   
3. **Selesai!**
   - Workflow `.github/workflows/deploy.yml` akan secara automatik memasang pakej, menjalankan `npm run build`, dan memuat naik fail production yang lengkap ke GitHub Pages.
   - Buka pautan: **https://masriahkarim.github.io/MATH-GAME/**

---

### Kaedah 2: Menggunakan `npm run deploy` (Deploy Branch `gh-pages`)

Jika anda lebih suka deploy terus dari komputer anda:
```bash
npm run deploy
```
Perintah ini akan menjalankan `npm run build` dan menolak fail production (`dist/`) ke branch `gh-pages` secara automatik. Kemudian di **Settings > Pages**, pilih **Deploy from a branch** -> branch **gh-pages** -> folder **/ (root)**.

---

## 📁 Project Structure (Struktur Folder)

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow untuk deployment automatik
├── public/
│   └── favicon.svg             # Web app icon roket rasmi
├── src/
│   ├── assets/
│   │   └── images/             # Imej maskot (Panda, Robot, Kucing, Dino, Dragon Boss)
│   ├── components/
│   │   ├── BadgesModal.tsx     # Modal paparan lencana wira
│   │   ├── BossBattleScreen.tsx# Skrin pertempuran Dragon Boss 
│   │   ├── CartoonBackground.tsx# Latar belakang kartun awan, bukit & istana
│   │   ├── CharacterAvatar.tsx # Komponen avatar maskot dengan ekspresi emosi
│   │   ├── GameScreen.tsx      # Skrin utama gameplay matematik 3-zon
│   │   ├── Header.tsx          # Bar status (Bintang, Streak, Mute Sound FX)
│   │   ├── HomeScreen.tsx      # Skrin utama dengan butang ▶️ MULA MAIN besar
│   │   ├── RewardScreen.tsx    # Skrin kemenangan misi & sambutan Level Up
│   │   └── ShopClosetModal.tsx # Almari kosmetik & aksesori
│   ├── types/
│   │   └── game.ts             # Definisi Typescript (Question, Profile, Mascot, etc.)
│   ├── utils/
│   │   ├── characters.ts       # Maklumat maskot, aksesori & lencana
│   │   ├── confetti.ts         # Animasi letupan konfeti & bintang
│   │   ├── questionGenerator.ts# Penjana soalan matematik adaptif mengikut umur
│   │   ├── sound.ts            # Web Audio API audio synthesizer ceria
│   │   └── storage.ts          # Pengurusan localStorage profil & data pemain
│   ├── App.tsx                 # Komponen akar navigasi skrin
│   ├── index.css               # Import Tailwind CSS & fon tersuai
│   └── main.tsx                # Titik permulaan React DOM
├── index.html                  # Fail HTML utama dengan meta tags & favicon
├── package.json                # Skrip binaan & senarai dependensi
├── tsconfig.json               # Konfigurasi TypeScript
├── vite.config.ts              # Konfigurasi Vite dengan base: './' untuk GitHub Pages
├── .gitignore                  # Senarai fail dikecualikan dari Git
└── README.md                   # Dokumentasi lengkap projek
```

---

## 📄 License

Projek ini dibangunkan untuk tujuan pendidikan dan belum mempunyai lesen sumber terbuka rasmi (*All rights reserved*).
