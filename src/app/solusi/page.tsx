import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, Cpu, Handshake, MessageSquareHeart, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const solutions = [
  {
    icon: <Briefcase className="h-10 w-10 text-accent" />,
    title: 'Solusi Transformasi Cabang',
    description: 'Revolusikan cabang konvensional menjadi pusat layanan digital yang efisien dan modern. Kami membantu bank mengurangi biaya operasional sambil meningkatkan kualitas layanan melalui otomatisasi dan self-service.',
    image: "https://placehold.co/600x400.png",
    aiHint: "modern bank interior",
    keyPoints: [
      'Implementasi Digital Kiosk untuk layanan mandiri.',
      'Sistem Antrian Cerdas untuk mengurangi waktu tunggu.',
      'Pengurangan kebutuhan staf untuk tugas-tugas transaksional.',
      'Peningkatan efisiensi dan produktivitas cabang.',
    ],
  },
  {
    icon: <Users className="h-10 w-10 text-accent" />,
    title: 'Solusi Customer Experience',
    description: 'Ciptakan pengalaman nasabah yang tak terlupakan di setiap titik interaksi. Dari antrian hingga transaksi, solusi kami memastikan setiap proses berjalan mulus, cepat, dan personal.',
    image: "https://placehold.co/600x400.png",
    aiHint: "customer service satisfaction",
    keyPoints: [
      'Personalisasi layanan di Kiosk Digital.',
      'Proses antrian yang transparan dan adil.',
      'Integrasi layanan online dan offline.',
      'Pengumpulan feedback nasabah secara real-time.',
    ],
  },
  {
    icon: <Cpu className="h-10 w-10 text-accent" />,
    title: 'Solusi Sistem Informasi Kurs Mata Uang',
    description: 'Sajikan informasi kurs mata uang asing yang akurat, real-time, dan menarik secara visual. Solusi kami memastikan kepatuhan dan kepercayaan nasabah dengan data yang selalu up-to-date.',
    image: "https://placehold.co/600x400.png",
    aiHint: "stock exchange board",
    keyPoints: [
      'Tampilan kurs yang modern dan profesional.',
      'Pembaruan data kurs secara otomatis dari sumber terpercaya.',
      'Manajemen konten terpusat yang mudah digunakan.',
      'Desain yang dapat disesuaikan dengan identitas brand Anda.',
    ],
  },
];

export default function SolusiPage() {
  return (
    <>
      <section className="bg-dark-slate">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Solusi Teknologi Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Kami menyediakan solusi end-to-end yang dirancang untuk mengatasi tantangan spesifik dalam industri layanan keuangan dan perbankan.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <div key={solution.title} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className={`relative h-80 rounded-lg overflow-hidden shadow-lg ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                    <Image
                        src={solution.image}
                        alt={solution.title}
                        fill
                        className="object-cover"
                        data-ai-hint={solution.aiHint}
                    />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">{solution.icon}</div>
                    <h2 className="text-3xl font-headline font-bold text-primary">{solution.title}</h2>
                  </div>
                  <p className="text-muted-foreground">{solution.description}</p>
                  <ul className="space-y-2 pt-2">
                    {solution.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Handshake className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">Punya Kebutuhan Spesifik?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Tim kami siap membantu merancang solusi kustom yang paling sesuai untuk tantangan bisnis Anda.
          </p>
          <Link href="/hubungi-kami">
            <Button size="lg">Diskusikan Proyek Anda <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </Link>
        </div>
      </section>
    </>
  );
}
