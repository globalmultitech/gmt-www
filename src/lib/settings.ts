
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

// Interface for database reads, ensuring all fields from prisma are present
export interface FullWebSettings extends PrismaWebSettings {}

// Interface for client-side usage, with JSON fields properly typed
export interface WebSettings extends Omit<PrismaWebSettings, 'socialMedia' | 'menuItems' | 'featureCards' | 'aboutUsChecklist' | 'trustedByLogos' | 'testimonials'> {
  logoUrl: string | null;
  socialMedia: SocialMediaLinks;
  menuItems: MenuItem[];
  featureCards: FeatureCard[];
  aboutUsChecklist: string[];
  trustedByLogos: TrustedByLogo[];
  testimonials: Testimonial[];
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

  solutionsPageTitle: 'Solusi Teknologi Kami',
  solutionsPageSubtitle: 'Kami menyediakan solusi end-to-end.',

  aboutPageTitle: 'Tentang Kami',
  aboutPageSubtitle: 'Mendorong Inovasi, Memberdayakan Pertumbuhan.',
  missionTitle: 'Misi Kami',
  missionText: 'Menyediakan solusi teknologi inovatif.',
  visionTitle: 'Visi Kami',
  visionText: 'Menjadi mitra teknologi terdepan.',

  resourcesPageTitle: 'Resources',
  resourcesPageSubtitle: 'Dapatkan wawasan terbaru dari industri.',
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
            if (jsonField === null || jsonField === undefined) {
               return fallback;
            }
            if (typeof jsonField === 'object' && !Array.isArray(jsonField)) {
                // It's likely already a parsed object from Prisma JSON type
                return jsonField;
            }
            if (typeof jsonField === 'string' && jsonField.trim().startsWith('{') || jsonField.trim().startsWith('[')) {
               try {
                 return JSON.parse(jsonField);
               } catch (e) {
                 console.warn('Failed to parse JSON string field, returning fallback:', e);
                 return fallback;
               }
            }
            // If it's an array, assume it's already parsed
             if (Array.isArray(jsonField)) {
                return jsonField;
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
            trustedByLogos: parseJson(settingsFromDb.trustedByLogos, defaultSettings.trustedByLogos),
            testimonials: parseJson(settingsFromDb.testimonials, defaultSettings.testimonials),
        };

    } catch (error) {
        console.error("FATAL: Failed to fetch web settings, returning default settings. This might indicate a database connection issue.", error);
        return defaultSettings;
    }
}
