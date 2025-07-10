import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Code2, Headphones, Layers, Handshake, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: <Headphones className="h-8 w-8 text-primary" />,
    title: 'Layanan Purna Jual',
    description: 'Kami memastikan investasi teknologi Anda beroperasi secara optimal dengan dukungan teknis yang responsif dan andal. Tim kami siap membantu mengatasi setiap kendala.',
    details: [
      'Dukungan teknis on-site dan remote.',
      'Kontrak pemeliharaan preventif.',
      'Ketersediaan suku cadang asli.',
      'Layanan perbaikan perangkat keras.',
    ],
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: 'Integrasi Sistem',
    description: 'Hubungkan semua komponen teknologi Anda menjadi satu ekosistem yang solid dan efisien. Kami ahli dalam mengintegrasikan sistem yang berbeda untuk kelancaran alur kerja.',
    details: [
      'Integrasi dengan Core Banking System.',
      'Penyatuan platform hardware dan software.',
      'Pengembangan API kustom.',
      'Sinkronisasi data antar sistem.',
    ],
  },
  {
    icon: <Code2 className="h-8 w-8 text-primary" />,
    title: 'Pengembangan Perangkat Lunak',
    description: 'Butuh solusi yang tidak tersedia di pasaran? Tim pengembang kami siap merancang dan membangun perangkat lunak kustom yang sesuai dengan kebutuhan unik bisnis Anda.',
    details: [
      'Analisis kebutuhan dan desain sistem.',
      'Pengembangan aplikasi web dan mobile.',
      'Jaminan kualitas dan pengujian menyeluruh.',
      'Dukungan dan pengembangan berkelanjutan.',
    ],
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Penyewaan atau Outsourcing',
    description: 'Dapatkan akses ke teknologi terbaru tanpa beban investasi modal yang besar. Layanan penyewaan dan outsourcing kami memberikan fleksibilitas untuk pertumbuhan bisnis Anda.',
    details: [
      'Opsi sewa perangkat keras (kiosk, dll).',
      'Pengelolaan operasional IT oleh tim kami.',
      'Skalabilitas sesuai kebutuhan.',
      'Fokus pada bisnis inti Anda, serahkan IT pada kami.',
    ],
  },
];

export default function LayananPage() {
  return (
    <>
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Layanan Profesional Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">{service.icon}</div>
                  <div>
                    <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                    <CardDescription className="mt-1">{service.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 pt-4 border-t">
                    {service.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Handshake className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold">Komitmen Kami Pada Keamanan</h2>
            <p className="text-primary-foreground/80">
              Dalam setiap layanan yang kami berikan, keamanan adalah prioritas utama. Kami menerapkan standar keamanan industri tertinggi untuk melindungi data dan aset berharga Anda, memastikan ketenangan pikiran dalam setiap langkah transformasi digital Anda.
            </p>
            <div className="flex items-center gap-4 pt-4">
                <ShieldCheck className="h-10 w-10 text-accent"/>
                <p className="font-semibold text-lg">Perlindungan Data dan Privasi Terjamin</p>
            </div>
          </div>
          <div className="relative h-64 md:h-80">
            <Image src="https://placehold.co/600x400.png" alt="Keamanan Siber" fill className="object-cover rounded-lg shadow-md" data-ai-hint="cyber security" />
          </div>
        </div>
      </section>
    </>
  );
}
