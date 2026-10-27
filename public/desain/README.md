# PT Sericite Mica Indonesia — prototipe website

Sumber halaman dan aset diekstrak dari desain HTML yang Anda berikan, tanpa mengubah tampilan utamanya.

## Menjalankan
Jalankan `python -m http.server 8000` di folder ini, lalu buka http://localhost:8000.

## Halaman
- index.html: Beranda
- katalog.html: Katalog interaktif
- surface.html: Surface Treatment
- dokumen.html: Permintaan dokumen dan sampel
- admin.html: Desain CMS admin
- profil.html: Profil perusahaan
- kontak.html: Kontak
- produk.html: Detail produk
- beranda-mobile.html dan katalog-mobile.html: desain khusus ponsel

## Batasan
Ini prototipe frontend dari lampiran, bukan aplikasi produksi. Formulir belum mengirim email atau menyimpan data ke server. CMS belum memiliki autentikasi maupun database: jangan memasukkan data rahasia. Runtime desain dan aset yang tersedia disertakan di assets/. Beberapa font eksternal atau dependensi runtime mungkin membutuhkan internet. Versi desktop dan ponsel masih terpisah seperti desain sumber. Belum diverifikasi secara visual di browser.

Lisensi font bawaan dipertahankan di FONT-LICENSE.txt.
