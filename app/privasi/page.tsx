export default function Privacy() {
  return (
    <main>
      <section>
        <h1>Kebijakan Privasi</h1>
        <p>
          Formulir mengumpulkan nama, email, perusahaan, pesan, serta waktu
          persetujuan untuk menanggapi permintaan Anda. Jangan mengirimkan data
          sensitif atau rahasia dagang melalui formulir.
        </p>
        <p>
          Data permintaan disimpan dalam database Supabase. Resend digunakan
          untuk notifikasi kepada pengelola, tanpa menyertakan isi pesan.
          Cloudflare Turnstile memproses sinyal keamanan untuk mencegah
          penyalahgunaan.
        </p>
        <p>
          Hanya admin yang diizinkan dapat membaca permintaan melalui aplikasi.
          Hubungi pengelola melalui kanal perusahaan untuk meminta akses atau
          penghapusan data. Pengelola wajib menetapkan masa retensi, kontak
          privasi resmi, serta kebijakan pemrosesan yang sesuai sebelum
          mengumpulkan data produksi.
        </p>
      </section>
    </main>
  );
}
