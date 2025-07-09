import prisma from '@/lib/db';
import type { WebSettings as PrismaWebSettings, Prisma } from '@prisma/client';

export type MenuItem = {
  label: string;
  href: string;
};

export type SocialMediaLinks = {
  [key: string]: string;
};

// This type combines Prisma's type with our stricter JSON types
export interface WebSettings extends Omit<PrismaWebSettings, 'socialMedia' | 'menuItems'> {
  socialMedia: SocialMediaLinks;
  menuItems: MenuItem[];
}

const defaultSettings: WebSettings = {
  id: 1,
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


export async function getSettings(): Promise<WebSettings> {
    try {
        const settings = await prisma.webSettings.findUnique({
            where: { id: 1 },
        });

        if (!settings) {
            console.warn("Web settings not found in database, returning default settings.");
            return defaultSettings;
        }
        
        // Type assertion is safe here as we control the data structure via our admin panel.
        return settings as WebSettings;
    } catch (error) {
        console.error("FATAL: Failed to fetch web settings, returning default settings. This might indicate a database connection issue.", error);
        return defaultSettings;
    }
}
