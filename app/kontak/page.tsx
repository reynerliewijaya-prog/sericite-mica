import Inquiry from "./form";
export default function Contact() {
  return (
    <main>
      <section>
        <span className="eyebrow">DOKUMEN · SAMPEL · KONSULTASI</span>
        <h1>Mari berdiskusi.</h1>
        <p>
          Kirim kebutuhan material, spesifikasi, atau permintaan sampel. Jangan
          sertakan password, informasi keuangan, atau rahasia dagang.
        </p>
        <Inquiry />
      </section>
    </main>
  );
}
