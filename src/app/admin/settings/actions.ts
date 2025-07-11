
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import { getSettings } from '@/lib/settings';

const MenuItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const SocialMediaLinksSchema = z.object({
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
});

const TrustedByLogoSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

const SettingsSchema = z.object({
  logoUrl: z.string().optional(),
  companyName: z.string().min(1, 'Nama perusahaan tidak boleh kosong'),
  whatsappSales: z.string().min(1, 'Nomor WhatsApp tidak boleh kosong'),
  footerText: z.string().min(1, 'Teks footer tidak boleh kosong'),
  address: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  openingHours: z.string().optional(),
  socialMedia: SocialMediaLinksSchema.optional(),
  menuItems: z.array(MenuItemSchema).optional(),
  // Hero section fields
  heroHeadline: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImageUrl: z.string().optional(),
  heroButton1Text: z.string().optional(),
  heroButton1Link: z.string().optional(),
  heroButton2Text: z.string().optional(),
  heroButton2Link: z.string().optional(),
  // Feature cards
  featureCards: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk kartu fitur tidak valid' });
      return z.NEVER;
    }
  }),
  // About Us section fields
  aboutUsSubtitle: z.string().optional(),
  aboutUsTitle: z.string().optional(),
  aboutUsDescription: z.string().optional(),
  aboutUsImageUrl: z.string().optional(),
  aboutUsChecklist: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk checklist About Us tidak valid' });
      return z.NEVER;
    }
  }),
  // Services section fields
  servicesSubtitle: z.string().optional(),
  servicesTitle: z.string().optional(),
  servicesDescription: z.string().optional(),
  professionalServices: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk layanan profesional tidak valid' });
      return z.NEVER;
    }
  }),
  // CTA Section fields
  ctaHeadline: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaImageUrl: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  trustedByText: z.string().optional(),
  trustedByLogos: z.array(TrustedByLogoSchema).optional(),
  // Testimonials
  testimonials: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk testimonial tidak valid' });
      return z.NEVER;
    }
  }),
  // Blog Posts
  blogPosts: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk postingan blog tidak valid' });
      return z.NEVER;
    }
  }),
});

function getAsObject(formData: FormData, key: string) {
    const obj: { [key: string]: any } = {};
    for (const [path, value] of formData.entries()) {
        const match = path.match(new RegExp(`^${key}\\[(.*?)\\]`));
        if (match) {
            const field = match[1];
            if (field) {
                obj[field] = value;
            }
        }
    }
    return obj;
}


function getAsArrayOfObjects(formData: FormData, key: string) {
    const items: { [key: number]: any } = {};
    const regex = new RegExp(`^${key}\\[(\\d+)\\]\\[(.*?)\\]$`);

    for (const [path, value] of formData.entries()) {
        const match = path.match(regex);
        if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            if (!items[index]) {
                items[index] = {};
            }
            items[index][field] = value;
        }
    }
    return Object.values(items).filter(item => (item.label && item.label.trim() !== '') || (item.alt && item.alt.trim() !== ''));
}


export async function getWebSettings() {
    return getSettings();
}

export async function updateWebSettings(prevState: { message: string } | undefined, formData: FormData) {
  
  const menuItems = getAsArrayOfObjects(formData, 'menuItems');
  const socialMedia = getAsObject(formData, 'socialMedia');
  const trustedByLogos = getAsArrayOfObjects(formData, 'trustedByLogos');

  const validatedFields = SettingsSchema.safeParse({
    logoUrl: formData.get('logoUrl'),
    companyName: formData.get('companyName'),
    whatsappSales: formData.get('whatsappSales'),
    footerText: formData.get('footerText'),
    address: formData.get('address'),
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    openingHours: formData.get('openingHours'),
    socialMedia: socialMedia,
    menuItems: menuItems,
    heroHeadline: formData.get('heroHeadline'),
    heroDescription: formData.get('heroDescription'),
    heroImageUrl: formData.get('heroImageUrl'),
    heroButton1Text: formData.get('heroButton1Text'),
    heroButton1Link: formData.get('heroButton1Link'),
    heroButton2Text: formData.get('heroButton2Text'),
    heroButton2Link: formData.get('heroButton2Link'),
    featureCards: formData.get('featureCards'),
    aboutUsSubtitle: formData.get('aboutUsSubtitle'),
    aboutUsTitle: formData.get('aboutUsTitle'),
    aboutUsDescription: formData.get('aboutUsDescription'),
    aboutUsImageUrl: formData.get('aboutUsImageUrl'),
    aboutUsChecklist: formData.get('aboutUsChecklist'),
    servicesSubtitle: formData.get('servicesSubtitle'),
    servicesTitle: formData.get('servicesTitle'),
    servicesDescription: formData.get('servicesDescription'),
    professionalServices: formData.get('professionalServices'),
    ctaHeadline: formData.get('ctaHeadline'),
    ctaDescription: formData.get('ctaDescription'),
    ctaImageUrl: formData.get('ctaImageUrl'),
    ctaButtonText: formData.get('ctaButtonText'),
    ctaButtonLink: formData.get('ctaButtonLink'),
    trustedByText: formData.get('trustedByText'),
    trustedByLogos: trustedByLogos,
    testimonials: formData.get('testimonials'),
    blogPosts: formData.get('blogPosts'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    console.log(error);
    const message = Object.values(error).flat()[0] || "Input tidak valid";
    return { message };
  }
  
  const data = validatedFields.data;

  try {
    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            ...data
        }
    });

    // Revalidate all pages that might use this data
    revalidatePath('/', 'layout');

    return { message: 'Pengaturan berhasil diperbarui.' };
  } catch (error) {
    console.error('Update settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}

    