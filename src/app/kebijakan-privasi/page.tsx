
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Global Multi Technology',
  description: 'Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
};

export default function KebijakanPrivasiPage() {
  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Kebijakan Privasi</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Privasi Anda penting bagi kami. Kebijakan ini menjelaskan informasi pribadi yang kami kumpulkan dan bagaimana kami menggunakannya.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
            <h2>Pendahuluan</h2>
            <p>
              Selamat datang di Global Multi Technology. Kami berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkap, dan menjaga informasi Anda saat Anda mengunjungi situs web kami.
            </p>

            <h2>Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami dapat mengumpulkan informasi tentang Anda dalam berbagai cara. Informasi yang dapat kami kumpulkan di Situs meliputi:
            </p>
            <ul>
              <li>
                <strong>Data Pribadi:</strong> Informasi yang dapat diidentifikasi secara pribadi, seperti nama, alamat email, dan nomor telepon Anda, yang Anda berikan secara sukarela kepada kami saat Anda mengisi formulir kontak atau mendaftar di situs.
              </li>
              <li>
                <strong>Data Turunan:</strong> Informasi yang dikumpulkan server kami secara otomatis saat Anda mengakses Situs, seperti alamat IP Anda, jenis browser Anda, sistem operasi Anda, waktu akses Anda, dan halaman yang telah Anda lihat secara langsung sebelum dan sesudah mengakses Situs.
              </li>
            </ul>

            <h2>Penggunaan Informasi Anda</h2>
            <p>
              Memiliki informasi yang akurat tentang Anda memungkinkan kami untuk memberikan Anda pengalaman yang lancar, efisien, dan disesuaikan. Secara khusus, kami dapat menggunakan informasi yang dikumpulkan tentang Anda melalui Situs untuk:
            </p>
            <ul>
              <li>Menanggapi permintaan produk dan layanan pelanggan.</li>
              <li>Mengirimkan email kepada Anda mengenai akun atau pesanan Anda.</li>
              <li>Meningkatkan efisiensi dan pengoperasian Situs.</li>
              <li>Memantau dan menganalisis penggunaan dan tren untuk meningkatkan pengalaman Anda dengan Situs.</li>
            </ul>

            <h2>Keamanan Informasi Anda</h2>
            <p>
              Kami menggunakan langkah-langkah keamanan administratif, teknis, dan fisik untuk membantu melindungi informasi pribadi Anda. Meskipun kami telah mengambil langkah-langkah yang wajar untuk mengamankan informasi pribadi yang Anda berikan kepada kami, perlu diketahui bahwa terlepas dari upaya kami, tidak ada langkah-langkah keamanan yang sempurna atau tidak dapat ditembus, dan tidak ada metode transmisi data yang dapat dijamin terhadap penyadapan atau jenis penyalahgunaan lainnya.
            </p>

            <h2>Perubahan pada Kebijakan Privasi Ini</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan.
            </p>

            <h2>Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan atau komentar tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <a href="/hubungi-kami">Hubungi Kami</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
