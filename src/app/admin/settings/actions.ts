
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

const FeatureCardSchema = z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
});

const ProfessionalServiceDetailSchema = z.string();

const ProfessionalServiceSchema = z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    details: z.array(ProfessionalServiceDetailSchema),
});

const TestimonialSchema = z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    image: z.string(),
    aiHint: z.string().optional(),
});

const BlogPostSchema = z.object({
    image: z.string(),
    aiHint: z.string(),
    date: z.string(),
    author: z.string(),
    title: z.string(),
    href: z.string(),
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
  featureCards: z.array(FeatureCardSchema).optional(),
  // About Us section fields
  aboutUsSubtitle: z.string().optional(),
  aboutUsTitle: z.string().optional(),
  aboutUsDescription: z.string().optional(),
  aboutUsImageUrl: z.string().optional(),
  aboutUsChecklist: z.array(z.string()).optional(),
  // Services section fields
  servicesSubtitle: z.string().optional(),
  servicesTitle: z.string().optional(),
  servicesDescription: z.string().optional(),
  professionalServices: z.array(ProfessionalServiceSchema).optional(),
  // CTA Section fields
  ctaHeadline: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaImageUrl: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  trustedByText: z.string().optional(),
  trustedByLogos: z.array(TrustedByLogoSchema).optional(),
  // Testimonials
  testimonials: z.array(TestimonialSchema).optional(),
  // Blog Posts
  blogPosts: z.array(BlogPostSchema).optional(),
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
            // Handle nested arrays, like 'details' in 'professionalServices'
            const detailMatch = field.match(/^details\[(\d+)\]$/);
            if (detailMatch) {
                if (!items[index].details) {
                    items[index].details = [];
                }
                items[index].details[parseInt(detailMatch[1], 10)] = value;
            } else {
                items[index][field] = value;
            }
        }
    }
    
    // Convert to array and filter out potentially empty objects,
    // keeping only those where at least one key has a non-empty string value.
    return Object.values(items).filter(item => {
        if (typeof item !== 'object' || item === null) return false;
        
        // Check for nested details array and filter it first
        if (Array.isArray(item.details)) {
            item.details = item.details.filter(detail => typeof detail === 'string' && detail.trim() !== '');
        }

        // Check if any of the main properties of the item has a value.
        return Object.keys(item).some(key => {
            const value = item[key];
            if (key === 'details') {
                return Array.isArray(value) && value.length > 0;
            }
            return typeof value === 'string' && value.trim() !== '';
        });
    });
}


function getAsArrayOfStrings(formData: FormData, key: string) {
    const items: string[] = [];
    const regex = new RegExp(`^${key}\\[(\\d+)\\]$`);
    for (const [path, value] of formData.entries()) {
        if (path.match(regex)) {
            if (typeof value === 'string' && value.trim() !== '') {
                items.push(value.trim());
            }
        }
    }
    return items;
}

export async function getWebSettings() {
    return getSettings();
}

export async function updateWebSettings(prevState: { message: string } | undefined, formData: FormData) {
  
  const menuItems = getAsArrayOfObjects(formData, 'menuItems');
  const socialMedia = getAsObject(formData, 'socialMedia');
  const trustedByLogos = getAsArrayOfObjects(formData, 'trustedByLogos');
  const featureCards = getAsArrayOfObjects(formData, 'featureCards');
  const aboutUsChecklist = getAsArrayOfStrings(formData, 'aboutUsChecklist');
  const professionalServices = getAsArrayOfObjects(formData, 'professionalServices');
  const testimonials = getAsArrayOfObjects(formData, 'testimonials');
  const blogPosts = getAsArrayOfObjects(formData, 'blogPosts');

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
    featureCards: featureCards,
    aboutUsSubtitle: formData.get('aboutUsSubtitle'),
    aboutUsTitle: formData.get('aboutUsTitle'),
    aboutUsDescription: formData.get('aboutUsDescription'),
    aboutUsImageUrl: formData.get('aboutUsImageUrl'),
    aboutUsChecklist: aboutUsChecklist,
    servicesSubtitle: formData.get('servicesSubtitle'),
    servicesTitle: formData.get('servicesTitle'),
    servicesDescription: formData.get('servicesDescription'),
    professionalServices: professionalServices,
    ctaHeadline: formData.get('ctaHeadline'),
    ctaDescription: formData.get('ctaDescription'),
    ctaImageUrl: formData.get('ctaImageUrl'),
    ctaButtonText: formData.get('ctaButtonText'),
    ctaButtonLink: formData.get('ctaButtonLink'),
    trustedByText: formData.get('trustedByText'),
    trustedByLogos: trustedByLogos,
    testimonials: testimonials,
    blogPosts: blogPosts,
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    console.log(JSON.stringify(errorMessages, null, 2));

    // Combine error messages for a more informative toast
    const message = Object.entries(errorMessages)
        .map(([key, value]) => `${key}: ${value.join(', ')}`)
        .join('; ');
        
    return { message: message || "Input tidak valid. Silakan periksa kembali." };
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

