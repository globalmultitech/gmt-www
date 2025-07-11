
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

export type Solution = {
  icon: string;
  title: string;
  description: string;
  image: string;
  aiHint: string;
  keyPoints: string[];
};

export type TimelineEvent = {
  year: string;
  event: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  aiHint: string;
};

export type NewsItem = {
    title: string;
    date: string;
    category: string;
    image: string;
    aiHint: string;
};


export interface WebSettings extends Omit<PrismaWebSettings, 'socialMedia' | 'menuItems' | 'featureCards' | 'aboutUsChecklist' | 'professionalServices' | 'trustedByLogos' | 'testimonials' | 'blogPosts' | 'solutions' | 'timeline' | 'teamMembers' | 'newsItems'> {
  logoUrl: string | null;
  socialMedia: SocialMediaLinks;
  menuItems: MenuItem[];
  address: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  openingHours: string | null;
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
  
  // New page content fields
  servicesPageTitle: string | null;
  servicesPageSubtitle: string | null;
  servicesPageCommitmentTitle: string | null;
  servicesPageCommitmentText: string | null;
  servicesPageHeaderImageUrl: string | null;

  solutionsPageTitle: string | null;
  solutionsPageSubtitle: string | null;
  solutions: Solution[] | any;

  aboutPageTitle: string | null;
  aboutPageSubtitle: string | null;
  missionTitle: string | null;
  missionText: string | null;
  visionTitle: string | null;
  visionText: string | null;
  timeline: TimelineEvent[] | any;
  teamMembers: TeamMember[] | any;

  resourcesPageTitle: string | null;
  resourcesPageSubtitle: string | null;
  newsItems: NewsItem[] | any;
}

const defaultSettings: WebSettings = {
  id: 1,
  logoUrl: null,
  companyName: 'Daltech',
  whatsappSales: '+6281234567890',
  footerText: 'We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses succeed.',
  address: '139 Baker St, E1 7PT, London',
  contactEmail: 'contacts@example.com',
  contactPhone: '(02) 123 333 444',
  openingHours: '8am-5pm Mon - Fri',
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
        icon: 'Users',
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
  ],
  ctaHeadline: 'Ready to take your business to the next level?',
  ctaDescription: "Let's discuss how our IT solutions can help you achieve your goals.",
  ctaImageUrl: 'https://placehold.co/1920x1080.png',
  ctaButtonText: 'Get a Quote',
  ctaButtonLink: '/hubungi-kami',
  trustedByText: "Trusted by the world's leading companies",
  trustedByLogos: [
    { src: 'https://placehold.co/200x80.png', alt: 'Client Logo 1' },
  ],
  testimonials: [
    {
        quote: "We've been using Daltech for a few years now, and we're very happy with the results. They're a great team to work with, and they're always willing to go the extra mile to help us succeed.",
        name: 'John Doe',
        role: 'CEO, Company',
        image: 'https://placehold.co/100x100.png',
        aiHint: 'professional man portrait',
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
  servicesPageTitle: 'Layanan Profesional Kami',
  servicesPageSubtitle: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda. Temukan bagaimana layanan kami dapat mendukung kesuksesan Anda.',
  servicesPageCommitmentTitle: 'Komitmen Kami Pada Keamanan',
  servicesPageCommitmentText: 'Dalam setiap layanan yang kami berikan, keamanan adalah prioritas utama. Kami menerapkan standar keamanan industri tertinggi untuk melindungi data dan aset berharga Anda, memastikan ketenangan pikiran dalam setiap langkah transformasi digital Anda.',
  servicesPageHeaderImageUrl: 'https://placehold.co/600x400.png',
  solutionsPageTitle: 'Solusi Teknologi Kami',
  solutionsPageSubtitle: 'Kami menyediakan solusi end-to-end yang dirancang untuk mengatasi tantangan spesifik dalam industri layanan keuangan dan perbankan.',
  solutions: [],
  aboutPageTitle: 'Tentang Kami',
  aboutPageSubtitle: 'Mendorong Inovasi, Memberdayakan Pertumbuhan.',
  missionTitle: 'Misi Kami',
  missionText: 'Menyediakan solusi teknologi inovatif dan layanan profesional yang andal untuk membantu klien kami bertransformasi secara digital, meningkatkan efisiensi, dan mencapai keunggulan kompetitif.',
  visionTitle: 'Visi Kami',
  visionText: 'Menjadi mitra teknologi terdepan dan terpercaya di Asia Tenggara, yang dikenal karena inovasi, kualitas, dan komitmen kami terhadap kesuksesan pelanggan.',
  timeline: [],
  teamMembers: [],
  resourcesPageTitle: 'Resources',
  resourcesPageSubtitle: 'Dapatkan wawasan terbaru dari industri, berita perusahaan, dan artikel mendalam dari para ahli kami.',
  newsItems: [],
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

        // Helper function to safely parse JSON fields with a fallback
        const parseJson = (jsonString: any, fallback: any[]) => {
            if (typeof jsonString === 'object' && jsonString !== null) return jsonString;
            try {
                return jsonString ? JSON.parse(jsonString) : fallback;
            } catch (e) {
                return fallback;
            }
        };

        return {
            ...defaultSettings, // Start with defaults
            ...settingsFromDb, // Override with DB values
            // Safely parse JSON fields, falling back to defaults if parsing fails or field is null
            socialMedia: parseJson(settingsFromDb.socialMedia, defaultSettings.socialMedia),
            menuItems: parseJson(settingsFromDb.menuItems, defaultSettings.menuItems),
            featureCards: parseJson(settingsFromDb.featureCards, defaultSettings.featureCards),
            aboutUsChecklist: parseJson(settingsFromDb.aboutUsChecklist, defaultSettings.aboutUsChecklist),
            professionalServices: parseJson(settingsFromDb.professionalServices, defaultSettings.professionalServices),
            trustedByLogos: parseJson(settingsFromDb.trustedByLogos, defaultSettings.trustedByLogos),
            testimonials: parseJson(settingsFromDb.testimonials, defaultSettings.testimonials),
            blogPosts: parseJson(settingsFromDb.blogPosts, defaultSettings.blogPosts),
            solutions: parseJson(settingsFromDb.solutions, defaultSettings.solutions),
            timeline: parseJson(settingsFromDb.timeline, defaultSettings.timeline),
            teamMembers: parseJson(settingsFromDb.teamMembers, defaultSettings.teamMembers),
            newsItems: parseJson(settingsFromDb.newsItems, defaultSettings.newsItems),
        };

    } catch (error) {
        console.error("FATAL: Failed to fetch web settings, returning default settings. This might indicate a database connection issue.", error);
        return defaultSettings;
    }
}
