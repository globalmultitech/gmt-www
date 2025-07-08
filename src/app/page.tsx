import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Cpu, Lightbulb, Users, Zap, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Using the same solutions but with a new 'area' for bento grid placement
const solutions = [
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: 'Transformasi Cabang',
    description: 'Modernisasi cabang Anda dengan teknologi terkini.',
    link: '/solusi',
    area: 'col-span-1 md:col-span-2',
    bgClass: 'bg-blue-900/20',
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Customer Experience',
    description: 'Tingkatkan loyalitas melalui interaksi yang mulus.',
    link: '/solusi',
    area: 'col-span-1',
    bgClass: 'bg-indigo-900/20',
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: 'Sistem Informasi Kurs',
    description: 'Sistem akurat dan real-time untuk info kurs.',
    link: '/solusi',
    area: 'col-span-1',
    bgClass: 'bg-purple-900/20',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Otomatisasi Cerdas',
    description: 'Efisiensi operasional dengan otomatisasi proses.',
    link: '/layanan',
    area: 'col-span-1 md:col-span-2',
    bgClass: 'bg-pink-900/20',
  },
];

const services = [
  "Layanan Purna Jual Responsif",
  "Integrasi Sistem yang Solid",
  "Pengembangan Perangkat Lunak Kustom",
  "Opsi Penyewaan & Outsourcing Fleksibel"
];

const BentoCard = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div
    className={cn(
      'group relative flex flex-col justify-between rounded-xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:scale-[1.02]',
      className
    )}
  >
    {children}
    <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent"></div>
    <div className="pointer-events-none absolute inset-0 rounded-xl transition-all duration-300 group-hover:bg-black/10"></div>
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-background/80 to-transparent bg-cover bg-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>
        <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="animate-fade-in-up text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-br from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              Inovasi Teknologi
            </span><br/>untuk Bisnis Masa Depan
          </h1>
          <p className="animate-fade-in-up mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '0.4s' }}>
            Global Multi Technology menyediakan solusi dan layanan teknologi terdepan untuk mengakselerasi transformasi digital perusahaan Anda.
          </p>
          <div className="animate-fade-in-up mt-8 flex flex-wrap justify-center gap-4" style={{ animationDelay: '0.6s' }}>
            <Button asChild size="lg" className="font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-105">
              <Link href="/solusi">
                Jelajahi Solusi <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold transition-transform hover:scale-105 hover:bg-white/10">
              <Link href="/hubungi-kami">Hubungi Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Solutions Bento Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Solusi Terintegrasi</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Kami merancang ekosistem teknologi yang menjawab tantangan spesifik industri Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
            {solutions.map((solution, index) => (
              <BentoCard key={solution.title} className={cn('fade-in-up', solution.area, solution.bgClass)} style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <div className="text-primary-foreground">{solution.icon}</div>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-white">{solution.title}</h3>
                  <p className="text-muted-foreground">{solution.description}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
                <span className="text-accent font-semibold font-headline">PRODUK UNGGULAN</span>
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Digital Kiosk & Antrian Cerdas</h2>
                <p className="text-lg text-muted-foreground">Revolusikan layanan mandiri dan manajemen antrian dengan Kiosk Digital interaktif dan Sistem Antrian Cerdas kami. Efisien, modern, dan meningkatkan kepuasan pelanggan.</p>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3"><Zap className="h-5 w-5 text-accent"/> <span className="text-muted-foreground">Transaksi lebih cepat dan mudah.</span></li>
                    <li className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-accent"/> <span className="text-muted-foreground">Antarmuka yang intuitif dan mudah digunakan.</span></li>
                    <li className="flex items-center gap-3"><Users className="h-5 w-5 text-accent"/> <span className="text-muted-foreground">Mengurangi waktu tunggu dan meningkatkan alur pelanggan.</span></li>
                </ul>
                <Button asChild className="font-bold transition-transform hover:scale-105">
                  <Link href="/produk">Jelajahi Produk Lainnya</Link>
                </Button>
            </div>
            <div className="relative h-80 md:h-[450px] fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Image src="https://placehold.co/600x600.png" alt="Produk Unggulan" fill className="object-cover rounded-xl shadow-2xl shadow-primary/10" data-ai-hint="modern kiosk" />
            </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 md:h-[450px] fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Image src="https://placehold.co/600x600.png" alt="Tim Profesional" fill className="object-cover rounded-xl shadow-2xl shadow-primary/10" data-ai-hint="professional team meeting" />
          </div>
          <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Layanan Profesional Kami</h2>
            <p className="text-lg text-muted-foreground">Dari pengembangan hingga purna jual, kami memberikan layanan komprehensif untuk mendukung kesuksesan implementasi teknologi Anda.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground">{service}</p>
                  </div>
              ))}
            </div>
            <Button asChild className="font-bold transition-transform hover:scale-105">
              <Link href="/layanan">Lihat Semua Layanan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-purple-700 to-accent text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Siap Bertransformasi?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Mari diskusikan bagaimana Global Multi Technology dapat membantu bisnis Anda mencapai level berikutnya.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-bold bg-white text-primary transition-transform hover:scale-105">
            <Link href="/hubungi-kami">
              Hubungi Kami Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
