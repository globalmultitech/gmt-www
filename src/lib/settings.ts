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

export interface WebSettings extends Omit<PrismaWebSettings, 'socialMedia' | 'menuItems' | 'featureCards' | 'aboutUsChecklist'> {
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
        };

    } catch (error) {
        console.error("FATAL: Failed to fetch web settings, returning default settings. This might indicate a database connection issue.", error);
        return defaultSettings;
    }
}
