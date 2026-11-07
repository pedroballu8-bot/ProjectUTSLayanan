/* Kode bersama untuk semua halaman - Layanan Pembelajaran Virtual (demo, localStorage) */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (t) => new Date(t).toLocaleString('id-ID');
const safeUrl = (u) => (/^https?:\/\//i.test(u) ? u : '#');
const param = (k) => new URLSearchParams(location.search).get(k);

const DB_KEY = 'vls_db_v1';
const USER_KEY = 'vls_user_v1';

const seed = {
  courses: [
    {
      id: 'c1', nama: 'Pemrograman Web', dosen: 'Dr. Rina',
      materi: [
        { id: 'm1', judul: 'Pengantar HTML & CSS', tipe: 'teks', isi: 'HTML adalah bahasa markup untuk struktur halaman, CSS untuk tampilannya. Pelajari tag dasar, selector, dan box model.' },
        { id: 'm2', judul: 'Dokumentasi MDN (rujukan)', tipe: 'link', isi: 'https://developer.mozilla.org/id/' },
      ],
    },
    {
      id: 'c2', nama: 'Basis Data', dosen: 'Pak Budi',
      materi: [{ id: 'm3', judul: 'Model Relasional', tipe: 'teks', isi: 'Data disimpan dalam tabel berisi baris dan kolom. Primary key mengidentifikasi baris secara unik; foreign key menghubungkan tabel.' }],
    },
  ],
  tugas: [
    { id: 't1', courseId: 'c1', judul: 'Buat halaman profil', deskripsi: 'Buat halaman profil pribadi dengan HTML & CSS. Kumpulkan tautan repositori atau penjelasan singkat.', deadline: '2026-12-31T23:59' },
  ],
  submissions: [],
  ujian: [
    {
      id: 'u1', courseId: 'c1', judul: 'Kuis 1 - Dasar Web', durasi: 5,
      soal: [
        { q: 'Tag untuk tautan adalah...', opts: ['<link>', '<a>', '<href>', '<url>'], ans: 1 },
        { q: 'Properti CSS untuk mengubah warna teks adalah...', opts: ['font-color', 'text-style', 'color', 'foreground'], ans: 2 },
        { q: 'HTML adalah singkatan dari...', opts: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Mode Language'], ans: 0 },
      ],
    },
  ],
  hasil: [],
};

let db = JSON.parse(localStorage.getItem(DB_KEY) || 'null') || seed;
let user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
const save = () => localStorage.setItem(DB_KEY, JSON.stringify(db));

const courseName = (id) => (db.courses.find((c) => c.id === id) || {}).nama || '-';
const courseOptions = (sel) => db.courses.map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(c.nama)}</option>`).join('');

function requireLogin() {
  if (!user) { location.replace('login.html'); return false; }
  return true;
}

function renderNav(active) {
  const nav = $('#nav');
  if (!nav) return;
  if (!user) { nav.innerHTML = '<a class="btn" href="login.html">Masuk</a>'; return; }
  const links = [['index.html', 'Beranda'], ['tugas.html', 'Tugas'], ['ujian.html', 'Ujian']];
  nav.innerHTML =
    links.map(([h, t]) => `<a class="navlink ${active === h ? 'active' : ''}" href="${h}">${t}</a>`).join('') +
    `<span>${esc(user.nama)} (${user.role})</span><button class="ghost" id="logout">Keluar</button>`;
  $('#logout').onclick = () => { localStorage.removeItem(USER_KEY); location.href = 'login.html'; };
}
