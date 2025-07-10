import prisma from '@/lib/db';
import type { WebSettings as PrismaWebSettings } from '@prisma/client';

export type MenuItem = {
  label: string;
  href: string;
};

export type SocialMediaLinks = {
  [key: string]: string;
};

export type FeatureCard = {
  icon: string;
  title: string;
  description: string;
};

export type ProfessionalService = {
  icon: string;
  title: string;
  description: string;
  details: string[];
};

export type TrustedByLogo = {
  src: string;
  alt: string;
};

export type Testimonial = {
    quote: string;
    name: string;
    role: string;
    image: string;
    aiHint?: string;
};

export type BlogPost = {
  image: string;
  aiHint: string;
  date: string;
  author: string;
  title: string;
  href: string;
};

export interface WebSettings extends Omit<PrismaWebSettings, 'socialMedia' | 'menuItems' | 'featureCards' | 'aboutUsChecklist' | 'professionalServices' | 'trustedByLogos' | 'testimonials' | 'blogPosts'> {
  logoUrl: string | null;
  socialMedia: SocialMediaLinks;
  menuItems: MenuItem[];
  heroHeadline: string | null;
  heroDescription: string | null;
  heroImageUrl: string | null;
  heroButton1Text: string | null;
  heroButton1Link: string | null;
  heroButton2Text: string | null;
  heroButton2Link: string | null;
  featureCards: FeatureCard[];
  aboutUsSubtitle: string | null;
  aboutUsTitle: string | null;
  aboutUsDescription: string | null;
  aboutUsImageUrl: string | null;
  aboutUsChecklist: string[] | any; // any to accommodate prisma json type
  servicesSubtitle: string | null;
  servicesTitle: string | null;
  servicesDescription: string | null;
  professionalServices: ProfessionalService[] | any; // any to accommodate prisma json type
  ctaHeadline: string | null;
  ctaDescription: string | null;
  ctaImageUrl: string | null;
  ctaButtonText: string | null;
  ctaButtonLink: string | null;
  trustedByText: string | null;
  trustedByLogos: TrustedByLogo[] | any; // any to accommodate prisma json type
  testimonials: Testimonial[] | any;
  blogPosts: BlogPost[] | any;
}

const defaultSettings: WebSettings = {
  id: 1,
  logoUrl: null,
  companyName: 'Daltech',
  whatsappSales: '+6281234567890',
  footerText: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses succeed.',
  socialMedia: {
    twitter: '#',
    facebook: '#',
    instagram: '#',
    linkedin: '#',
  },
  menuItems: [
    { label: 'Beranda', href: '/' },
    { label: 'Produk', href: '/produk' },
    { label: 'Solusi', href: '/solusi' },
    { label: 'Layanan', href: '/layanan' },
    { label: 'Resources', href: '/resources' },
    { label: 'Tentang Kami', href: '/tentang-kami' },
    { label: 'Hubungi Kami', href: '/hubungi-kami' },
  ],
  heroHeadline: 'Creative solutions to improve your business',
  heroDescription: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world.',
  heroImageUrl: 'https://placehold.co/1920x1080.png',
  heroButton1Text: 'Our services',
  heroButton1Link: '/layanan',
  heroButton2Text: 'Contact us',
  heroButton2Link: '/hubungi-kami',
  featureCards: [
    {
        icon: 'MonitorSmartphone',
        title: 'Smart softwares',
        description: 'Duis aute irure dolor in repreherita ineto.',
    },
    {
        icon: 'BarChart',
        title: 'Trusted security',
        description: 'Lorem consectetur adipi elitsed tempono.',
    },
    {
        icon: 'Medal',
        title: 'Awards winners',
        description: 'Ariento mesfato prodo arte e eli manifesto.',
    },
    {
        icon: 'User',
        title: 'Great experience',
        description: 'Lorem consectetur adipiscing elitsed pro.',
    },
  ],
  aboutUsSubtitle: 'ABOUT US',
  aboutUsTitle: 'We are the best IT solution',
  aboutUsDescription: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world. We believe that technology can be a powerful tool for good, and we are dedicated to using our skills and expertise to make a positive impact.',
  aboutUsImageUrl: 'https://placehold.co/600x600.png',
  aboutUsChecklist: [
    "Bespoke software solutions",
    "Human-centered design",
    "Cloud-native architecture",
  ],
  servicesSubtitle: 'WHAT WE DO',
  servicesTitle: 'Layanan Profesional Kami',
  servicesDescription: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.',
  professionalServices: [
    {
      icon: 'Headphones',
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
      icon: 'Layers',
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
      icon: 'Code2',
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
      icon: 'Bot',
      title: 'Penyewaan atau Outsourcing',
      description: 'Dapatkan akses ke teknologi terbaru tanpa beban investasi modal yang besar. Layanan penyewaan dan outsourcing kami memberikan fleksibilitas untuk pertumbuhan bisnis Anda.',
      details: [
        'Opsi sewa perangkat keras (kiosk, dll).',
        'Pengelolaan operasional IT oleh tim kami.',
        'Skalabilitas sesuai kebutuhan.',
        'Fokus pada bisnis inti Anda, serahkan IT pada kami.',
      ],
    },
  ],
  ctaHeadline: 'Ready to take your business to the next level?',
  ctaDescription: "Let's discuss how our IT solutions can help you achieve your goals.",
  ctaImageUrl: 'https://placehold.co/1920x1080.png',
  ctaButtonText: 'Get a Quote',
  ctaButtonLink: '/hubungi-kami',
  trustedByText: "Trusted by the world's leading companies",
  trustedByLogos: [
    { src: '/logo-placeholder-1.svg', alt: 'Client Logo 1' },
    { src: '/logo-placeholder-2.svg', alt: 'Client Logo 2' },
    { src: '/logo-placeholder-3.svg', alt: 'Client Logo 3' },
  ],
  testimonials: [
    {
        quote: "We've been using Daltech for a few years now, and we're very happy with the results. They're a great team to work with, and they're always willing to go the extra mile to help us succeed.",
        name: 'John Doe',
        role: 'CEO, Company',
        image: 'https://placehold.co/100x100.png',
        aiHint: 'professional man portrait',
    },
    {
        quote: "The team at Daltech is incredibly talented and passionate about what they do. They took the time to understand our business and our goals, and they delivered a solution that exceeded our expectations.",
        name: 'Jane Smith',
        role: 'CTO, Another Corp',
        image: 'https://placehold.co/100x100.png',
        aiHint: 'professional woman portrait',
    },
  ],
  blogPosts: [
      {
        image: 'https://placehold.co/600x400.png',
        aiHint: 'server room',
        date: 'July 10, 2024',
        author: 'Admin',
        title: 'Technology that is powering the digital world',
        href: '#'
      }
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};


export async function getSettings(): Promise<WebSettings> {
    try {
        const settingsFromDb = await prisma.webSettings.findUnique({
            where: { id: 1 },
        });

        if (!settingsFromDb) {
            console.warn("Web settings not found in database, returning default settings.");
            return defaultSettings;
        }

        return {
            ...settingsFromDb,
            socialMedia: (settingsFromDb.socialMedia as SocialMediaLinks) ?? defaultSettings.socialMedia,
            menuItems: (settingsFromDb.menuItems as MenuItem[]) ?? defaultSettings.menuItems,
            featureCards: (settingsFromDb.featureCards as FeatureCard[]) ?? defaultSettings.featureCards,
            aboutUsChecklist: (settingsFromDb.aboutUsChecklist as string[]) ?? defaultSettings.aboutUsChecklist,
            professionalServices: (settingsFromDb.professionalServices as ProfessionalService[] | null) ?? defaultSettings.professionalServices,
            trustedByLogos: (settingsFromDb.trustedByLogos as TrustedByLogo[] | null) ?? defaultSettings.trustedByLogos,
            testimonials: (settingsFromDb.testimonials as Testimonial[] | null) ?? defaultSettings.testimonials,
            blogPosts: (settingsFromDb.blogPosts as BlogPost[] | null) ?? defaultSettings.blogPosts,
        };

    } catch (error) {
        console.error("FATAL: Failed to fetch web settings, returning default settings. This might indicate a database connection issue.", error);
        return defaultSettings;
    }
}
