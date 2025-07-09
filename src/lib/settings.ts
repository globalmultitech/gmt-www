import prisma from '@/lib/db';
import type { WebSettings as PrismaWebSettings } from '@prisma/client';

export type MenuItem = {
  label: string;
  href: string;
};

export type SocialMediaLinks = {
  [key: string]: string;
};

export interface WebSettings extends Omit<PrismaWebSettings, 'socialMedia' | 'menuItems'> {
  logoUrl: string | null;
  socialMedia: SocialMediaLinks;
  menuItems: MenuItem[];
}

const defaultSettings: WebSettings = {
  id: 1,
  logoUrl: null,
  companyName: 'Global Multi Technology',
  whatsappSales: '+6281234567890',
  footerText: 'Menyediakan solusi dan layanan teknologi terdepan untuk transformasi digital.',
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
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function parseJsonSafe(jsonString: string | null, defaultValue: any) {
    if (!jsonString) return defaultValue;
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON string:", e);
        return defaultValue;
    }
}

export async function getSettings(): Promise<WebSettings> {
    try {
        const settingsFromDb = await prisma.webSettings.findUnique({
            where: { id: 1 },
        });

        if (!settingsFromDb) {
            console.warn("Web settings not found in database, returning default settings.");
            return defaultSettings;
        }

        const socialMedia = parseJsonSafe(settingsFromDb.socialMedia, defaultSettings.socialMedia) as SocialMediaLinks;
        const menuItems = parseJsonSafe(settingsFromDb.menuItems, defaultSettings.menuItems) as MenuItem[];

        return {
            ...settingsFromDb,
            socialMedia,
            menuItems,
        };

    } catch (error) {
        console.error("FATAL: Failed to fetch web settings, returning default settings. This might indicate a database connection issue.", error);
        return defaultSettings;
    }
}
