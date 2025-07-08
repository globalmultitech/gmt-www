import { ArrowRight, Briefcase, Cpu, Code, ShieldCheck, Rocket, Users, Sparkles, LifeBuoy, WandSparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
          
          <div className="relative w-full max-w-5xl mx-auto">
            <svg viewBox="0 0 1024 439" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M83.737 271.396l-3.328-4.223-10.45-1.92-12.835-12.834-3.012-14.755-10.3-2.191 1.044-8.752 9.256-5.83 5.407-1.498 11.345-14.99 6.257-2.81 1.622-5.407 10.973-10.552 2.164-3.924 9.473-1.498 12.042 1.498 11.892-2.34 9.044 1.801 10.124 13.513 1.802 6.13-.15 8.408-5.857 7.058-2.853 6.907.301 9.013-1.652 14.117 3.905 15.169 7.96 11.264-1.202 11.564-4.656 7.659-1.352 9.012-3.604 15.619 2.553 14.417 3.304 22.38 7.208 4.205 10.814-3.454 13.817 2.103 2.703 12.316-2.403 6.607-4.205 7.959-15.019 1.802-12.916 4.806-9.612 1.802-1.652-1.952-10.063-4.806-13.968 1.952-10.663 8.71-3.604 9.311-1.352 10.212-3.454 5.556-3.755 10.363.601 8.71 5.857 11.564 3.604 8.259-2.102 7.808-7.959 13.666 4.956 12.916-1.501 14.568-15.319-3.454-10.814-1.202-9.762 1.952-5.707-1.802 3.904-4.355 4.956-2.853-2.103-6.457 4.505-1.652 9.912 3.304 15.018 7.058 10.963 1.952 10.363 8.41-1.952 16.971-4.205 6.007 2.402 7.208-4.505 4.505-15.018 1.802-8.71 8.86-5.407 14.417-10.063-2.103-12.015 6.607-11.414 11.714-3.604 11.714-12.465 14.117-6.307 2.102-4.955-4.205-1.202-3.153-6.007-4.505-1.202-6.157 5.707-4.505 5.556 2.403 3.604-3.604 3.304-4.956 7.508-3.304 11.264-15.469-6.907-23.731-.301-8.109-1.952-8.109 4.355-14.718-4.205-12.165-8.41-.3-10.663-10.513 1.652-9.762-2.253-12.616-5.857-11.414 1.351-9.912-3.754-12.766 1.802-12.766 5.857-4.205 10.063-1.652 12.316 2.253l9.012 8.71 8.109-3.755 8.71 1.952 13.216-2.103 14.267-10.814 8.71-8.41 12.015-1.502 6.007 2.703 14.117-1.202 10.963-7.508 17.571-1.202 12.015 3.153 10.063-3.153 10.814 1.952 7.659 6.758-2.253 10.363 4.205 7.358 4.205.3 5.707-3.604 11.264-7.508 9.012-1.952 16.52.15 12.465 7.208 3.755 10.063-4.505 13.216-.45 10.663-4.205 11.114-11.414 1.502-12.015 6.758-5.707 9.16-4.505 10.513-11.414 6.758-15.318 4.205-14.417 6.457-12.015-1.802-9.912-11.414-2.102-11.414 6.007-9.311 9.311-6.758 10.212-3.304 4.505-12.015-4.205-12.616-1.502-8.71-7.208-11.264 1.502-10.814 6.908-4.205 9.012-7.809 3.004-9.912-4.505-12.015-1.502-9.311-6.758-10.363-2.703-12.616-1.201-10.063 6.307-8.109 11.114-6.457-5.106-9.762-10.212-12.616-12.616-2.102-10.212-1.502-11.114 4.806-11.714 6.607-6.007 10.963.15 12.015 3.904 4.806.45 6.157-3.454 1.952-4.205-4.205-2.253-8.86-7.809-12.165-10.513-11.714-10.212-10.814-10.963-8.109-17.721-6.157-11.114-12.165-12.015-18.172-13.817-10.212-10.212-14.267-12.465-13.516-15.318-10.963-9.012-14.267-11.714-11.264-15.018-9.012-10.063-12.766-10.814-11.114-14.117-9.012-8.71-10.513-10.963-8.41-14.117-7.208-8.109-8.41-9.912-6.307-12.616-4.505-6.007-6.758-7.208-5.106-9.311-3.604-5.106-4.956-6.307-3.904-7.809-2.703-4.505-3.604-5.407-2.703-6.607zm-78.18-19.467c-.206 5.86-1.95 9.176-2.402 11.414s-3.003 6.908-3.003 6.908l1.651-7.058s2.703-5.257 2.703-8.259-2.402-4.956-2.402-4.956l3.453 1.951z" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <g>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <circle cx="255" cy="355" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>DKI Jakarta</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <circle cx="480" cy="365" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Surabaya</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <circle cx="85" cy="270" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Medan</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <circle cx="585" cy="335" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Makassar</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <circle cx="950" cy="220" r="8" className="fill-primary cursor-pointer transition-all hover:r-12 hover:fill-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Jayapura</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </g>
            </svg>
          </div>

          <div className="text-center mt-12">
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
