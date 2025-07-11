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

// Interface for database reads, ensuring all fields from prisma are present
export interface FullWebSettings extends PrismaWebSettings {}

// Interface for client-side usage, with JSON fields properly typed
export interface WebSettings extends Omit<PrismaWebSettings, 'socialMedia' | 'menuItems' | 'featureCards' | 'aboutUsChecklist' | 'professionalServices' | 'trustedByLogos' | 'testimonials' | 'solutions' | 'timeline' | 'teamMembers' | 'newsItems'> {
  logoUrl: string | null;
  socialMedia: SocialMediaLinks;
  menuItems: MenuItem[];
  featureCards: FeatureCard[];
  aboutUsChecklist: string[];
  professionalServices: ProfessionalService[];
  trustedByLogos: TrustedByLogo[];
  testimonials: Testimonial[];
  solutions: Solution[];
  timeline: TimelineEvent[];
  teamMembers: TeamMember[];
  newsItems: NewsItem[];
}

const defaultSettings: WebSettings = {
  id: 1,
  logoUrl: null,
  companyName: 'Global Multi Technology',
  whatsappSales: '+6281234567890',
  footerText: 'Menyediakan solusi dan layanan teknologi terdepan untuk transformasi digital.',
  address: '139 Baker St, E1 7PT, London',
  contactEmail: 'contacts@example.com',
  contactPhone: '(02) 123 333 444',
  openingHours: '8am-5pm Mon - Fri',
  socialMedia: {},
  menuItems: [],
  heroHeadline: 'Creative solutions to improve your business',
  heroDescription: 'We are a passionate team of software engineers, designers, and strategists.',
  heroImageUrl: 'https://placehold.co/1920x1080.png',
  heroButton1Text: 'Our services',
  heroButton1Link: '/layanan',
  heroButton2Text: 'Contact us',
  heroButton2Link: '/hubungi-kami',
  featureCards: [],
  aboutUsSubtitle: 'ABOUT US',
  aboutUsTitle: 'We are the best IT solution',
  aboutUsDescription: 'We are a passionate team of software engineers, designers, and strategists.',
  aboutUsImageUrl: 'https://placehold.co/600x600.png',
  aboutUsChecklist: [],
  servicesSubtitle: 'WHAT WE DO',
  servicesTitle: 'Layanan Profesional Kami',
  servicesDescription: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda.',
  ctaHeadline: 'Ready to take your business to the next level?',
  ctaDescription: "Let's discuss how our IT solutions can help you achieve your goals.",
  ctaImageUrl: 'https://placehold.co/1920x1080.png',
  ctaButtonText: 'Get a Quote',
  ctaButtonLink: '/hubungi-kami',
  trustedByText: "Trusted by the world's leading companies",
  trustedByLogos: [],
  testimonials: [],
  
  servicesPageTitle: 'Layanan Profesional Kami',
  servicesPageSubtitle: 'Lebih dari sekadar penyedia produk, kami adalah mitra teknologi Anda.',
  servicesPageCommitmentTitle: 'Komitmen Kami Pada Keamanan',
  servicesPageCommitmentText: 'Dalam setiap layanan yang kami berikan, keamanan adalah prioritas utama.',
  servicesPageHeaderImageUrl: 'https://placehold.co/600x400.png',
  professionalServices: [],

  solutionsPageTitle: 'Solusi Teknologi Kami',
  solutionsPageSubtitle: 'Kami menyediakan solusi end-to-end.',
  solutions: [],

  aboutPageTitle: 'Tentang Kami',
  aboutPageSubtitle: 'Mendorong Inovasi, Memberdayakan Pertumbuhan.',
  missionTitle: 'Misi Kami',
  missionText: 'Menyediakan solusi teknologi inovatif.',
  visionTitle: 'Visi Kami',
  visionText: 'Menjadi mitra teknologi terdepan.',
  timeline: [],
  teamMembers: [],

  resourcesPageTitle: 'Resources',
  resourcesPageSubtitle: 'Dapatkan wawasan terbaru dari industri.',
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

        const parseJson = (jsonField: any, fallback: any) => {
           if (typeof jsonField === 'object' && jsonField !== null) {
              return jsonField;
            }
            if (typeof jsonField === 'string' && jsonField.trim() !== '') {
              try {
                return JSON.parse(jsonField);
              } catch (e) {
                console.warn('Failed to parse JSON field, returning fallback:', e);
                return fallback;
              }
            }
            return fallback;
        };
        

        return {
            ...defaultSettings,
            ...settingsFromDb,
            socialMedia: parseJson(settingsFromDb.socialMedia, defaultSettings.socialMedia),
            menuItems: parseJson(settingsFromDb.menuItems, defaultSettings.menuItems),
            featureCards: parseJson(settingsFromDb.featureCards, defaultSettings.featureCards),
            aboutUsChecklist: parseJson(settingsFromDb.aboutUsChecklist, defaultSettings.aboutUsChecklist),
            professionalServices: parseJson(settingsFromDb.professionalServices, defaultSettings.professionalServices),
            trustedByLogos: parseJson(settingsFromDb.trustedByLogos, defaultSettings.trustedByLogos),
            testimonials: parseJson(settingsFromDb.testimonials, defaultSettings.testimonials),
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
