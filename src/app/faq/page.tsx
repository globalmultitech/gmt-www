
import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan Umum | Global Multi Technology',
  description: 'Temukan jawaban atas pertanyaan yang sering diajukan mengenai produk, layanan, dan dukungan kami.',
};

const faqs = [
  {
    question: 'Apa saja layanan utama yang ditawarkan Global Multi Technology?',
    answer: 'Kami menyediakan berbagai solusi teknologi, termasuk pengembangan perangkat lunak kustom, integrasi sistem, layanan purna jual, dan penyewaan perangkat keras. Kami berfokus pada solusi untuk industri perbankan dan keuangan, seperti transformasi cabang digital dan sistem e-KYC.',
  },
  {
    question: 'Bagaimana cara meminta penawaran untuk produk atau layanan?',
    answer: 'Cara termudah adalah dengan mengunjungi halaman <a href="/hubungi-kami" class="text-primary hover:underline">Hubungi Kami</a> dan mengisi formulir permintaan penawaran. Anda juga dapat menghubungi tim sales kami langsung melalui WhatsApp yang tertera di situs.',
  },
  {
    question: 'Apakah GMT menyediakan dukungan teknis purna jual?',
    answer: 'Tentu saja. Kami memiliki tim dukungan teknis yang berdedikasi dan Helpdesk 24/7 untuk memastikan semua produk dan solusi yang kami implementasikan berjalan dengan optimal. Kami menawarkan kontrak pemeliharaan preventif dan dukungan on-site.',
  },
  {
    question: 'Di mana saja lokasi kantor GMT?',
    answer: 'Kantor pusat kami berlokasi di Bandung, Jawa Barat. Namun, kami memiliki jaringan layanan yang tersebar di seluruh Indonesia untuk menjangkau klien kami di berbagai daerah.',
  },
  {
    question: 'Apakah saya bisa melihat demo produk sebelum membeli?',
    answer: 'Ya, kami dengan senang hati akan menjadwalkan sesi demo produk untuk Anda. Silakan hubungi tim sales kami melalui halaman <a href="/hubungi-kami" class="text-primary hover:underline">Hubungi Kami</a> untuk mengatur jadwal.',
  },
   {
    question: 'Bagaimana proses pengembangan perangkat lunak kustom di GMT?',
    answer: 'Proses kami dimulai dengan analisis mendalam terhadap kebutuhan bisnis Anda. Kemudian, kami merancang prototipe, melakukan pengembangan dengan metodologi agile, pengujian menyeluruh, hingga implementasi dan dukungan purna jual. Kami memastikan Anda terlibat di setiap langkahnya.',
  },
]


export default function FAQPage() {
  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Pertanyaan Umum (FAQ)</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Temukan jawaban cepat untuk pertanyaan-pertanyaan umum tentang layanan dan produk kami.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                    <div className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="p-6 text-lg font-semibold text-left hover:no-underline bg-secondary/50">
                           {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="p-6">
                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </AccordionContent>
                    </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
