
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import { getSettings } from '@/lib/settings';

// Define schemas for nested objects first, making all fields optional and providing defaults
const MenuItemSchema = z.object({
  label: z.string().optional().default(''),
  href: z.string().optional().default(''),
});

const SocialMediaLinksSchema = z.object({
  twitter: z.string().optional().default(''),
  facebook: z.string().optional().default(''),
  instagram: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
});

const FeatureCardSchema = z.object({
    icon: z.string().optional().default(''),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
});

const ProfessionalServiceSchema = z.object({
    icon: z.string().optional().default(''),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    details: z.array(z.string()).optional().default([]),
});

const TestimonialSchema = z.object({
    quote: z.string().optional().default(''),
    name: z.string().optional().default(''),
    role: z.string().optional().default(''),
    image: z.string().optional().default(''),
    aiHint: z.string().optional().default(''),
});

const BlogPostSchema = z.object({
    image: z.string().optional().default(''),
    aiHint: z.string().optional().default(''),
    date: z.string().optional().default(''),
    author: z.string().optional().default(''),
    title: z.string().optional().default(''),
    href: z.string().optional().default(''),
});

const TrustedByLogoSchema = z.object({
  src: z.string().optional().default(''),
  alt: z.string().optional().default(''),
});

const SolutionSchema = z.object({
    icon: z.string().optional().default(''),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    image: z.string().optional().default(''),
    keyPoints: z.array(z.string()).optional().default([]),
});

const TimelineEventSchema = z.object({
    year: z.string().optional().default(''),
    event: z.string().optional().default(''),
});

const TeamMemberSchema = z.object({
    name: z.string().optional().default(''),
    role: z.string().optional().default(''),
    image: z.string().optional().default(''),
    linkedin: z.string().optional().default(''),
    aiHint: z.string().optional().default(''),
});

const NewsItemSchema = z.object({
    title: z.string().optional().default(''),
    date: z.string().optional().default(''),
    category: z.string().optional().default(''),
    image: z.string().optional().default(''),
    aiHint: z.string().optional().default(''),
});


// Main settings schema, all fields are optional
const SettingsSchema = z.object({
  logoUrl: z.string().optional(),
  companyName: z.string().optional(),
  whatsappSales: z.string().optional(),
  footerText: z.string().optional(),
  address: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  openingHours: z.string().optional(),
  socialMedia: SocialMediaLinksSchema.optional(),
  menuItems: z.array(MenuItemSchema).optional(),
  heroHeadline: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImageUrl: z.string().optional(),
  heroButton1Text: z.string().optional(),
  heroButton1Link: z.string().optional(),
  heroButton2Text: z.string().optional(),
  heroButton2Link: z.string().optional(),
  featureCards: z.array(FeatureCardSchema).optional(),
  aboutUsSubtitle: z.string().optional(),
  aboutUsTitle: z.string().optional(),
  aboutUsDescription: z.string().optional(),
  aboutUsImageUrl: z.string().optional(),
  aboutUsChecklist: z.array(z.string()).optional(),
  servicesSubtitle: z.string().optional(),
  servicesTitle: z.string().optional(),
  servicesDescription: z.string().optional(),
  professionalServices: z.array(ProfessionalServiceSchema).optional(),
  ctaHeadline: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaImageUrl: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  trustedByText: z.string().optional(),
  trustedByLogos: z.array(TrustedByLogoSchema).optional(),
  testimonials: z.array(TestimonialSchema).optional(),
  blogPosts: z.array(BlogPostSchema).optional(),

  // New Page Content Fields
  servicesPageTitle: z.string().optional(),
  servicesPageSubtitle: z.string().optional(),
  servicesPageCommitmentTitle: z.string().optional(),
  servicesPageCommitmentText: z.string().optional(),
  servicesPageHeaderImageUrl: z.string().optional(),
  
  solutionsPageTitle: z.string().optional(),
  solutionsPageSubtitle: z.string().optional(),
  solutions: z.array(SolutionSchema).optional(),

  aboutPageTitle: z.string().optional(),
  aboutPageSubtitle: z.string().optional(),
  missionTitle: z.string().optional(),
  missionText: z.string().optional(),
  visionTitle: z.string().optional(),
  visionText: z.string().optional(),
  timeline: z.array(TimelineEventSchema).optional(),
  teamMembers: z.array(TeamMemberSchema).optional(),

  resourcesPageTitle: z.string().optional(),
  resourcesPageSubtitle: z.string().optional(),
  newsItems: z.array(NewsItemSchema).optional(),
});


// Helper function to extract a simple object (like socialMedia)
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

// Helper function to extract an array of objects, now more robust
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
            
            const detailMatch = field.match(/^(details|keyPoints)\[(\d+)\]$/);
            if (detailMatch) {
                const arrayField = detailMatch[1];
                if (!items[index][arrayField]) {
                    items[index][arrayField] = [];
                }
                const detailIndex = parseInt(detailMatch[2], 10);
                items[index][arrayField][detailIndex] = value;
            } else {
                items[index][field] = value;
            }
        }
    }
    
    return Object.values(items).map(item => {
        // Clean up nested arrays by removing empty strings
        if (Array.isArray(item.details)) {
            item.details = item.details.filter(detail => typeof detail === 'string' && detail.trim() !== '');
        }
        if (Array.isArray(item.keyPoints)) {
            item.keyPoints = item.keyPoints.filter(point => typeof point === 'string' && point.trim() !== '');
        }
        return item;
    }).filter(item => {
        // Filter out items that are completely empty
        if (!item || typeof item !== 'object') return false;
        // Check if any value in the object is a non-empty string or a non-empty array.
        return Object.values(item).some(value => {
            if (typeof value === 'string') return value.trim() !== '';
            if (Array.isArray(value)) return value.length > 0;
            return false;
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
  try {
    const dataToValidate = {
        logoUrl: formData.get('logoUrl'),
        companyName: formData.get('companyName'),
        whatsappSales: formData.get('whatsappSales'),
        footerText: formData.get('footerText'),
        address: formData.get('address'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        openingHours: formData.get('openingHours'),
        socialMedia: getAsObject(formData, 'socialMedia'),
        menuItems: getAsArrayOfObjects(formData, 'menuItems'),
        heroHeadline: formData.get('heroHeadline'),
        heroDescription: formData.get('heroDescription'),
        heroImageUrl: formData.get('heroImageUrl'),
        heroButton1Text: formData.get('heroButton1Text'),
        heroButton1Link: formData.get('heroButton1Link'),
        heroButton2Text: formData.get('heroButton2Text'),
        heroButton2Link: formData.get('heroButton2Link'),
        featureCards: getAsArrayOfObjects(formData, 'featureCards'),
        aboutUsSubtitle: formData.get('aboutUsSubtitle'),
        aboutUsTitle: formData.get('aboutUsTitle'),
        aboutUsDescription: formData.get('aboutUsDescription'),
        aboutUsImageUrl: formData.get('aboutUsImageUrl'),
        aboutUsChecklist: getAsArrayOfStrings(formData, 'aboutUsChecklist'),
        servicesSubtitle: formData.get('servicesSubtitle'),
        servicesTitle: formData.get('servicesTitle'),
        servicesDescription: formData.get('servicesDescription'),
        professionalServices: getAsArrayOfObjects(formData, 'professionalServices'),
        ctaHeadline: formData.get('ctaHeadline'),
        ctaDescription: formData.get('ctaDescription'),
        ctaImageUrl: formData.get('ctaImageUrl'),
        ctaButtonText: formData.get('ctaButtonText'),
        ctaButtonLink: formData.get('ctaButtonLink'),
        trustedByText: formData.get('trustedByText'),
        trustedByLogos: getAsArrayOfObjects(formData, 'trustedByLogos'),
        testimonials: getAsArrayOfObjects(formData, 'testimonials'),
        blogPosts: getAsArrayOfObjects(formData, 'blogPosts'),
        
        // New Page Content Fields
        servicesPageTitle: formData.get('servicesPageTitle'),
        servicesPageSubtitle: formData.get('servicesPageSubtitle'),
        servicesPageCommitmentTitle: formData.get('servicesPageCommitmentTitle'),
        servicesPageCommitmentText: formData.get('servicesPageCommitmentText'),
        servicesPageHeaderImageUrl: formData.get('servicesPageHeaderImageUrl'),

        solutionsPageTitle: formData.get('solutionsPageTitle'),
        solutionsPageSubtitle: formData.get('solutionsPageSubtitle'),
        solutions: getAsArrayOfObjects(formData, 'solutions'),

        aboutPageTitle: formData.get('aboutPageTitle'),
        aboutPageSubtitle: formData.get('aboutPageSubtitle'),
        missionTitle: formData.get('missionTitle'),
        missionText: formData.get('missionText'),
        visionTitle: formData.get('visionTitle'),
        visionText: formData.get('visionText'),
        timeline: getAsArrayOfObjects(formData, 'timeline'),
        teamMembers: getAsArrayOfObjects(formData, 'teamMembers'),

        resourcesPageTitle: formData.get('resourcesPageTitle'),
        resourcesPageSubtitle: formData.get('resourcesPageSubtitle'),
        newsItems: getAsArrayOfObjects(formData, 'newsItems'),
    };

    const validatedFields = SettingsSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
      console.error('Validation Error:', JSON.stringify(validatedFields.error.flatten(), null, 2));
      const errorMessages = validatedFields.error.flatten().fieldErrors;
      const message = Object.entries(errorMessages)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('; ');
          
      return { message: message || "Input tidak valid. Silakan periksa kembali." };
    }
    
    const data = validatedFields.data;

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            ...data
        }
    });

    revalidatePath('/', 'layout');
    return { message: 'Pengaturan berhasil diperbarui.' };

  } catch (error) {
    console.error('Update settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
