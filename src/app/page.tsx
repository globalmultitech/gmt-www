import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, Cpu, Lightbulb, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const solutions = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Transformasi Cabang',
    description: 'Modernisasi cabang Anda dengan teknologi terkini untuk efisiensi dan pengalaman nasabah yang superior.',
    link: '/solusi',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Customer Experience',
    description: 'Tingkatkan loyalitas pelanggan melalui interaksi yang mulus dan personal di semua titik sentuh.',
    link: '/solusi',
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: 'Sistem Informasi Kurs',
    description: 'Sistem akurat dan real-time untuk menampilkan informasi kurs mata uang asing bagi nasabah Anda.',
    link: '/solusi',
  },
];

const services = [
  {
    title: "Layanan Purna Jual",
    description: "Dukungan teknis dan pemeliharaan untuk memastikan operasional perangkat Anda berjalan lancar."
  },
  {
    title: "Integrasi Sistem",
    description: "Menghubungkan berbagai sistem Anda menjadi satu ekosistem yang terpadu dan efisien."
  },
  {
    title: "Pengembangan Perangkat Lunak",
    description: "Solusi software kustom yang dirancang khusus untuk memenuhi kebutuhan unik bisnis Anda."
  },
  {
    title: "Penyewaan atau Outsourcing",
    description: "Opsi fleksibel untuk pengadaan dan pengelolaan perangkat teknologi tanpa investasi besar di awal."
  }
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-secondary">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center px-4 py-16 md:py-24">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary tracking-tight">
              Inovasi Teknologi untuk Pertumbuhan Bisnis Anda
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Global Multi Technology menyediakan solusi dan layanan teknologi terdepan untuk membantu transformasi digital perusahaan Anda.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="font-bold">
                <Link href="/solusi">
                  Jelajahi Solusi Kami <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold">
                <Link href="/hubungi-kami">Hubungi Sales</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Inovasi Teknologi"
              fill
              className="object-cover rounded-xl shadow-2xl"
              data-ai-hint="technology abstract"
            />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Solusi Inovatif untuk Industri Anda</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Kami merancang solusi teknologi yang menjawab tantangan spesifik di industri perbankan dan layanan keuangan.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <Card key={solution.title} className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-secondary p-4 rounded-full mb-4">{solution.icon}</div>
                  <CardTitle className="font-headline text-2xl">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Layanan Profesional Kami</h2>
            <p className="text-lg text-muted-foreground">Dari pengembangan hingga purna jual, kami memberikan layanan komprehensif untuk mendukung kesuksesan implementasi teknologi Anda.</p>
            <Button asChild className="font-bold">
              <Link href="/layanan">Lihat Semua Layanan</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
                <div key={index} className="p-6 bg-card rounded-lg shadow-md">
                    <h3 className="font-headline text-xl font-bold text-primary mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-[450px] order-last md:order-first">
                <Image src="https://placehold.co/600x600.png" alt="Produk Unggulan" fill className="object-cover rounded-xl shadow-lg" data-ai-hint="modern kiosk" />
            </div>
            <div className="space-y-6">
                <span className="text-accent font-semibold font-headline">PRODUK UNGGULAN</span>
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Digital Kiosk & Antrian Cerdas</h2>
                <p className="text-lg text-muted-foreground">Revolusikan layanan mandiri dan manajemen antrian dengan Kiosk Digital interaktif dan Sistem Antrian Cerdas kami. Efisien, modern, dan meningkatkan kepuasan pelanggan.</p>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3"><Zap className="h-5 w-5 text-accent"/> <span className="text-muted-foreground">Transaksi lebih cepat dan mudah.</span></li>
                    <li className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-accent"/> <span className="text-muted-foreground">Antarmuka yang intuitif dan mudah digunakan.</span></li>
                    <li className="flex items-center gap-3"><Users className="h-5 w-5 text-accent"/> <span className="text-muted-foreground">Mengurangi waktu tunggu dan meningkatkan alur pelanggan.</span></li>
                </ul>
                <Button asChild className="font-bold">
                  <Link href="/produk">Jelajahi Produk Lainnya</Link>
                </Button>
            </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Siap Bertransformasi?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Mari diskusikan bagaimana Global Multi Technology dapat membantu bisnis Anda mencapai level berikutnya.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <Link href="/hubungi-kami">
              Hubungi Kami Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
