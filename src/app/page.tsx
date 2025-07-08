import { ArrowRight, Briefcase, Cpu, Code, ShieldCheck, Rocket, Users, Sparkles, LifeBuoy, WandSparkles, Award, MapPin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

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
  { name: 'Bank Mandiri', logo: 'https://placehold.co/128x32.png' },
  { name: 'Bank Central Asia', logo: 'https://placehold.co/128x32.png' },
  { name: 'Bank Rakyat Indonesia', logo: 'https://placehold.co/128x32.png' },
  { name: 'Bank Negara Indonesia', logo: 'https://placehold.co/128x32.png' },
  { name: 'CIMB Niaga', logo: 'https://placehold.co/128x32.png' },
  { name: 'Bank Danamon', logo: 'https://placehold.co/128x32.png' },
  { name: 'Bank Tabungan Negara', logo: 'https://placehold.co/128x32.png' },
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

const stats = [
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    value: "100%",
    label: "KEPUASAN KLIEN",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    value: "150+",
    label: "KLIEN KORPORAT",
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary" />,
    value: "900+",
    label: "PROYEK SELESAI",
  },
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    value: "5",
    label: "LOKASI DI INDONESIA",
  },
];

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
                        <div key={index} className="mx-8 flex items-center justify-center h-10">
                            <Image 
                                src={partner.logo} 
                                alt={partner.name}
                                width={128}
                                height={32}
                                className="h-8 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all dark:invert"
                                data-ai-hint="bank logo"
                            />
                        </div>
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

       {/* Find Us Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <SectionTitle>
              Temukan Kami di Seluruh <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Indonesia</span>
            </SectionTitle>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Jaringan kami tersebar di kota-kota besar, siap memberikan solusi dan dukungan terbaik untuk bisnis Anda.
            </p>
          </div>
          
          <div className="relative w-full max-w-5xl mx-auto mb-12">
            <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M88.72,254.34l-3.32-4.21l-10.43-1.92l-12.8-12.8l-3-14.72l-10.28-2.19l1,8.73l9.24,5.82l5.39,1.5l11.32,14.96l6.24,2.8l1.62,5.39l10.95,10.53l2.16,3.92l9.45,1.5l12-1.5l11.87,2.33l9,1.8l10.1,13.48l1.8,6.12l-0.15,8.39l-5.84,7l-2.85,6.89l0.3,9l-1.65,14.08l3.9,15.13l7.94,11.24l-1.2,11.54l-4.65,7.64l-1.35,9l-3.6,15.58l2.55,14.38l3.3,22.33l7.2,4.2l10.8-3.45l13.8,2.1l2.7,12.29l-2.4,6.59l-4.2,7.94l-15-1.8l-12.9,4.8l-9.6,1.8l-1.65-1.95l-10.04-4.8l-13.94,1.95l-10.64,8.69l-3.6,9.29l-1.35,10.19l-3.45,5.54l-3.75,10.34l0.6,8.69l5.85,11.54l3.6,8.24l-2.1,7.79l-7.94,13.63l4.95,12.89l-1.5,14.53l-15.3-3.45l-10.8-1.2l-9.74,1.95l-5.7-1.8l3.9-4.34l4.95-2.85l-2.1-6.44l4.5-1.65l9.89,3.3l15,7l10.94,1.95l10.34,8.39l-1.95,16.93l2.4,6l-4.5,7.19l-15-4.5l-8.69,1.8l-5.4-8.84l14.38-10.04l-2.1-12l6.59-11.39l11.69-3.6l11.69-12.44l14.08-6.29l2.1-4.94l-4.2-1.2l-3.15-6l-4.5-1.2l-6.14,5.7l-4.5,5.54l2.4,3.6l-3.6,3.3l-4.95,7.49l-3.3,11.24l-15.44-6.89l-23.68-0.3l-8.09-1.95l8.09-4.34l-14.68-4.2l-12.14-8.39l-0.3-10.64l-10.5-1.65l-9.74-2.25l-12.59-5.84l-11.39,1.35l-9.89-3.75l-12.74,1.8l-12.74,5.84l-4.2,10.04l-1.65,12.29l2.25,9l8.69,8.09l-3.75,8.69l1.95,13.18l-2.1,14.23l-10.8-8.69l-8.39,12l-1.5,6l2.7,14.08l-1.2,10.94l-7.5-17.53l-1.2,12l3.15,10l-3.15,10.79l1.95,7.64l6.74-2.25l10.34,4.2l7.34,4.2l0.3,5.7l-3.6,11.24l-7.5,9l-1.95,16.48l7.19,12.44l10,3.75l-4.5,13.18l-0.45,10.64l-4.2,11.09l-11.39-1.5l-12-6.74l-5.7,9.14l-4.5,10.49l-11.39-6.74l-15.28,4.2l-14.38,6.44l-12-1.8l-9.89-11.39l-2.1-11.39l6-9.29l9.29-6.74l10.19-3.3l4.5-12l-4.2-12.59l-1.5-8.69l-7.2-11.24l1.5-10.79l6.89-4.2l9-7.79l3-9.89l-4.5-12l-1.5-9.29l-6.74-10.34l-2.7-12.59l-1.2-10.04l6.3-8.09l11.09-6.44l-5.1-9.74l-10.19-12.59l-12.59-2.1l-10.19-1.5l-11.09,4.8l-11.69,6.59l-6,10.94l3.9,12l0.45,4.8l-3.45,6.14l-4.2,1.95l-2.25-4.2l-7.79-8.84l-10.5-12.14l-10.2-11.69l-10.94-10.8l-17.68-8.09l-11.09-6.14l-12-12.14l-13.78-18.13l-10.2-10.2l-12.44-14.23l-15.28-13.48l-9-10.94l-10-14.23l-10.79-11.09l-14.08-9l-8.09-7.2l-9.89-8.39l-12.59-6.29l-6-4.5l-7.19-6.74l-9.29-5.1l-6.29-3.6l-7.79-3.9l-4.5-2.7l-5.4-3.6l-6.59-2.7z M9.15,235.3c-0.2,5.85-1.94,9.16-2.4,11.39s-3,6.89-3,6.89l1.65-7s2.7-5.25,2.7-8.24s-2.4-4.94-2.4-4.94l3.44,1.95z" fill="hsl(var(--muted-foreground))" fillOpacity="0.1" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.3" strokeWidth="0.5" />
              <g>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <circle cx="280" cy="360" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>DKI Jakarta</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <circle cx="420" cy="370" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Surabaya</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <circle cx="100" cy="250" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Medan</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <circle cx="550" cy="340" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Makassar</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <circle cx="880" cy="320" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Jayapura</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center flex flex-col items-center">
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
                  {stat.icon}
                </div>
                <p className="text-4xl md:text-5xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground tracking-widest mt-1 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Button asChild size="lg" className="font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                <Link href="/hubungi-kami">
                    Hubungi Cabang Terdekat <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
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
