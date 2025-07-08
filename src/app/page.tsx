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
            <svg viewBox="-450 200 1450 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M113.8,252.1L110.5,247.9L100.1,246L87.3,233.2L84.3,218.5L74,216.3L75,225L84.2,230.9L89.6,232.4L100.9,247.3L107.2,250.1L108.8,255.5L119.8,266L121.9,269.9L131.4,271.4L143.4,269.9L155.2,272.3L164.2,274.1L174.3,287.6L176.1,293.7L176,302.1L170.1,309.1L167.3,316L167.6,325L165.9,339.1L169.8,354.2L177.8,365.4L176.6,377L171.9,384.6L170.6,393.6L167,409.2L169.6,423.6L172.9,445.9L180.1,450.1L190.9,446.7L204.7,448.8L207.4,461.1L205,467.7L200.8,475.6L185.8,473.8L172.9,478.6L163.3,480.4L161.7,478.5L151.6,473.7L137.7,475.6L127,484.3L123.4,493.6L122.1,503.8L118.6,509.3L114.9,519.7L115.5,528.4L121.3,539.9L124.9,548.1L122.8,555.9L114.9,569.5L119.8,582.4L118.3,596.9L103,593.5L92.2,592.3L82.5,594.2L76.8,592.4L80.7,588.1L85.6,585.2L83.5,578.8L88,577.1L97.9,580.4L112.9,587.4L123.8,589.4L134.2,597.8L132.2,614.7L134.6,620.7L130.1,627.9L115.1,623.4L106.4,625.2L101,616.4L115.4,606.3L113.3,594.3L119.9,583L131.6,579.3L143.3,566.9L157.4,560.6L159.5,555.7L155.3,554.5L152.1,548.5L147.6,547.3L141.5,553L137,558.5L139.4,562.1L135.8,565.4L130.8,572.9L127.5,584.1L112.1,577.2L88.4,576.9L80.3,575L88.4,570.6L73.7,566.4L61.6,558L61.3,547.4L50.8,545.7L41.1,543.5L28.5,537.6L17.1,538.9L7.2,535.2L-5.5,537L-18.3,542.8L-22.5,552.9L-24.1,565.2L-21.9,574.2L-13.2,582.3L-16.9,590.9L-15,604.1L-17.1,618.3L-27.9,610L-36.3,622L-37.8,628L-35.1,642.1L-36.3,653L-43.8,635.5L-45,647.5L-41.8,657.5L-45,668.3L-43,675.9L-36.3,673.7L-26,677.9L-18.6,682.1L-18.3,687.8L-21.9,699L-29.4,708L-31.3,724.5L-24.1,736.9L-14.1,740.7L-18.6,753.9L-19.1,764.5L-23.3,775.6L-34.7,774.1L-46.7,767.4L-52.4,776.5L-56.9,787L-68.3,780.3L-83.6,784.5L-97.9,790.9L-110,789.1L-119.9,777.7L-122,766.3L-116,757L-106.7,750.3L-96.5,747L-92,735L-96.2,722.4L-97.7,713.7L-104.9,702.5L-103.4,691.7L-96.5,687.5L-87.5,679.7L-84.5,669.8L-89,657.8L-90.5,648.5L-97.2,638.2L-99.9,625.6L-101.1,615.6L-94.8,607.5L-83.7,601.1L-88.8,591.3L-99,578.8L-111.6,576.6L-121.8,575.1L-132.9,580L-144.6,586.5L-150.6,597.5L-146.7,609.5L-146.2,614.3L-149.7,620.4L-153.9,622.4L-156.1,618.2L-163.9,610.3L-174.4,598.2L-184.6,586.5L-195.5,575.7L-213.2,567.6L-224.3,561.5L-236.3,549.3L-250.1,531.2L-260.3,521L-272.7,506.7L-288,493.2L-297,482.3L-307,468L-317.8,456.9L-331.9,447.9L-340,440.7L-349.9,432.3L-362.4,426L-368.4,421.5L-375.6,414.8L-384.9,409.7L-391.2,406.1L-398.9,402.2L-403.4,399.5L-408.8,395.9L-415.4,393.2z M-445.9,233.4C-446.1,239.2-447.8,242.5-448.3,244.8C-448.8,247.2-448.9,250.2-448.9,250.2L-447.2,243.2C-447.2,243.2-444.6,238-444.6,235C-444.6,232-448.3,227.1-448.3,227.1L-444.8,229z" fill="#4A5568" stroke="#6B7280" strokeWidth="0.5"/>
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
