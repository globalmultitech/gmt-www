import { ArrowRight, Briefcase, Cpu, Code, ShieldCheck, Rocket, Users, Sparkles, LifeBuoy, WandSparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';

const SectionTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center", className)}>
    {children}
  </h2>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="relative bg-secondary p-6 h-full rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
        <div className="p-3 rounded-lg bg-background/70 inline-block mb-4 backdrop-blur-sm">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm flex-grow">{description}</p>
        </div>
    </div>
);

const AmazingFeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="relative group p-8 rounded-2xl bg-secondary border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full">
    <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
    <div className="relative z-10 flex flex-col h-full">
      <div className="p-4 rounded-full bg-background/30 inline-block mb-6 backdrop-blur-sm border border-white/10 text-primary group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-muted-foreground mb-6 group-hover:text-primary-foreground/80 transition-colors flex-grow">{description}</p>
      <Link href="#" className="font-semibold text-primary hover:text-accent flex items-center group-hover:text-white group-hover:hover:text-white/80 transition-colors">
        Baca Selengkapnya
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  </div>
);

const partners = [
  "Bank Central",
  "Fintech Maju",
  "Asuransi Aman",
  "Koperasi Sejahtera",
  "Modal Ventura",
  "Investasi Cerdas",
];

const features = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Transformasi Cabang',
    description: 'Modernisasi cabang Anda dengan Kiosk Digital, Sistem Antrian Cerdas, dan otomatisasi untuk efisiensi maksimal.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Customer Experience',
    description: 'Tingkatkan loyalitas melalui interaksi yang mulus dan personal di semua titik sentuh layanan digital Anda.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Keamanan Berstandar Tinggi',
    description: 'Solusi kami dibangun dengan standar keamanan perbankan untuk melindungi data dan transaksi nasabah Anda.',
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: 'Integrasi Sistem',
    description: 'Hubungkan Core Banking System Anda dengan platform kami secara solid untuk alur kerja yang terpadu.',
  },
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: 'Pengembangan Kustom',
    description: 'Butuh solusi unik? Tim kami siap merancang dan membangun perangkat lunak sesuai kebutuhan spesifik Anda.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'Layanan Purna Jual',
    description: 'Dukungan teknis responsif dan andal untuk memastikan investasi teknologi Anda berjalan optimal.',
  },
];

const amazingFeatures = [
  {
    icon: <Sparkles className="h-10 w-10" />,
    title: 'Teknologi Terdepan',
    description: 'Kami mengadopsi AI dan otomasi canggih untuk memberikan solusi yang selangkah lebih maju, memastikan Anda selalu kompetitif.',
  },
  {
    icon: <LifeBuoy className="h-10 w-10" />,
    title: 'Dukungan Prioritas 24/7',
    description: 'Tim ahli kami siap sedia membantu Anda mengatasi kendala teknis kapan saja, memastikan operasional bisnis Anda berjalan lancar.',
  },
  {
    icon: <WandSparkles className="h-10 w-10" />,
    title: 'Kustomisasi Tanpa Batas',
    description: 'Setiap bisnis itu unik. Kami merancang solusi yang dapat disesuaikan sepenuhnya untuk menjawab tantangan spesifik perusahaan Anda.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10" />,
    title: 'Keamanan Tingkat Perbankan',
    description: 'Dengan enkripsi end-to-end dan standar keamanan internasional, data dan transaksi Anda selalu aman bersama kami.',
  },
];


const steps = [
  {
    number: "01",
    title: "Konsultasi & Analisis",
    description: "Kami mulai dengan memahami tujuan dan tantangan unik bisnis Anda secara mendalam.",
  },
  {
    number: "02",
    title: "Desain Solusi Kustom",
    description: "Merancang arsitektur teknologi yang paling efektif dan efisien untuk kebutuhan Anda.",
  },
  {
    number: "03",
    title: "Implementasi & Integrasi",
    description: "Pemasangan, konfigurasi, dan integrasi solusi dengan sistem yang sudah ada secara mulus.",
  },
  {
    number: "04",
    title: "Dukungan & Optimalisasi",
    description: "Memberikan dukungan purna jual dan terus membantu Anda mengoptimalkan sistem.",
  }
]

export default function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center">
          <h1 className="animate-fade-in-up text-5xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-br from-primary via-accent to-orange-400 bg-clip-text text-transparent">
              Akselerasi Digital
            </span><br/>untuk Industri Finansial
          </h1>
          <p className="animate-fade-in-up mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '0.4s' }}>
            Solusi teknologi inovatif untuk perbankan dan layanan keuangan. Transformasi cabang, tingkatkan pengalaman nasabah, dan capai efisiensi operasional.
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

      {/* Partners Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground mb-6">DIPERCAYA OLEH PERUSAHAAN TERKEMUKA</p>
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                <div className="flex items-center justify-center md:justify-start animate-infinite-scroll">
                    {[...partners, ...partners].map((partner, index) => (
                        <div key={index} className="mx-8 flex items-center justify-center h-10 text-muted-foreground font-semibold text-lg whitespace-nowrap">{partner}</div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <SectionTitle>
              Platform <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Lengkap</span> untuk Kebutuhan Anda
            </SectionTitle>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Kami menyediakan ekosistem solusi terintegrasi, dari perangkat keras hingga perangkat lunak, untuk mendorong inovasi di perusahaan Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="group fade-in-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amazing Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <SectionTitle>
              Keunggulan <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Utama</span> Kami
            </SectionTitle>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Inilah yang membuat kami berbeda dan menjadi pilihan utama untuk partner teknologi finansial Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {amazingFeatures.map((feature, index) => (
              <div key={feature.title} className="group fade-in-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <AmazingFeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
           <div className="text-center space-y-4 mb-12">
            <SectionTitle>
              Proses Implementasi <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Terstruktur</span>
            </SectionTitle>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Kami memastikan proses transformasi digital Anda berjalan lancar dan sesuai target dari awal hingga akhir.</p>
          </div>
          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            <div className="absolute top-8 left-0 w-full h-px bg-border hidden lg:block"></div>
            {steps.map((step) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-secondary border-2 border-primary mb-4">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl p-8 md:p-12 overflow-hidden bg-gradient-to-br from-primary to-accent text-primary-foreground text-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:36px_36px] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            <div className="relative z-10">
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
          </div>
        </div>
      </section>
    </div>
  );
}
