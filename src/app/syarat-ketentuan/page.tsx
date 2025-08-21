
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Global Multi Technology',
  description: 'Baca syarat dan ketentuan penggunaan situs web dan layanan kami.',
};

export default function SyaratKetentuanPage() {
  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Syarat & Ketentuan</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Harap baca syarat dan ketentuan ini dengan saksama sebelum menggunakan situs web kami.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
            <h2>1. Pendahuluan</h2>
            <p>
              Syarat dan Ketentuan ini mengatur penggunaan Anda atas situs web ini; dengan menggunakan situs web ini, Anda menerima syarat dan ketentuan ini secara penuh. Jika Anda tidak setuju dengan syarat dan ketentuan ini atau bagian mana pun dari syarat dan ketentuan ini, Anda tidak boleh menggunakan situs web ini.
            </p>

            <h2>2. Lisensi untuk Menggunakan Situs Web</h2>
            <p>
              Kecuali dinyatakan lain, Global Multi Technology dan/atau pemberi lisensinya memiliki hak kekayaan intelektual di situs web dan materi di situs web. Tunduk pada lisensi di bawah ini, semua hak kekayaan intelektual ini dilindungi. Anda dapat melihat, mengunduh hanya untuk tujuan caching, dan mencetak halaman dari situs web untuk penggunaan pribadi Anda, dengan tunduk pada batasan yang ditetapkan di bawah dan di tempat lain dalam syarat dan ketentuan ini.
            </p>
            <p>Anda tidak boleh:</p>
            <ul>
              <li>Mempublikasikan ulang materi dari situs web ini.</li>
              <li>Menjual, menyewakan, atau mensublisensikan materi dari situs web.</li>
              <li>Mereproduksi, menggandakan, menyalin, atau mengeksploitasi materi di situs web ini untuk tujuan komersial.</li>
            </ul>

            <h2>3. Penggunaan yang Dapat Diterima</h2>
            <p>
              Anda tidak boleh menggunakan situs web ini dengan cara apa pun yang menyebabkan, atau dapat menyebabkan, kerusakan pada situs web atau penurunan ketersediaan atau aksesibilitas situs web; atau dengan cara apa pun yang melanggar hukum, ilegal, curang, atau berbahaya, atau sehubungan dengan tujuan atau aktivitas yang melanggar hukum, ilegal, curang, atau berbahaya.
            </p>
            
            <h2>4. Batasan Tanggung Jawab</h2>
            <p>
              Global Multi Technology tidak akan bertanggung jawab kepada Anda (baik berdasarkan hukum kontak, hukum gugatan atau lainnya) sehubungan dengan konten, atau penggunaan, atau sehubungan dengan situs web ini: sejauh situs web disediakan secara gratis, untuk setiap kerugian langsung; untuk setiap kerugian tidak langsung, khusus atau konsekuensial; atau untuk setiap kerugian bisnis, kehilangan pendapatan, pendapatan, keuntungan atau tabungan yang diantisipasi, kehilangan kontrak atau hubungan bisnis, kehilangan reputasi atau niat baik, atau kehilangan atau kerusakan informasi atau data.
            </p>

            <h2>5. Perubahan pada Ketentuan</h2>
            <p>
              Kami dapat merevisi syarat dan ketentuan ini dari waktu ke waktu. Syarat dan ketentuan yang direvisi akan berlaku untuk penggunaan situs web ini sejak tanggal publikasi syarat dan ketentuan yang direvisi di situs web ini. Harap periksa halaman ini secara teratur untuk memastikan Anda terbiasa dengan versi saat ini.
            </p>
            
            <h2>6. Hukum yang Berlaku</h2>
            <p>
              Syarat dan ketentuan ini akan diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia, dan setiap perselisihan yang berkaitan dengan syarat dan ketentuan ini akan tunduk pada yurisdiksi eksklusif pengadilan di Indonesia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
