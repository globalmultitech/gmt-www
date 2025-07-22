
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const MenuItemSchema = z.object({
  label: z.string().default(''),
  href: z.string().default(''),
});

const SocialMediaLinksSchema = z.object({
  twitter: z.string().default(''),
  facebook: z.string().default(''),
  instagram: z.string().default(''),
  linkedin: z.string().default(''),
});

const FeatureCardSchema = z.object({
    icon: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
});

const TrustedByLogoSchema = z.object({
  src: z.string().default(''),
  alt: z.string().default(''),
});

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
  ctaHeadline: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaImageUrl: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  trustedByText: z.string().optional(),
  trustedByLogos: z.array(TrustedByLogoSchema).optional(),
});


export async function updateWebSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const jsonString = formData.get('settingsData') as string;
    if (!jsonString) {
      return { message: 'Data formulir tidak ditemukan.' };
    }
    const dataToValidate = JSON.parse(jsonString);

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

    const sanitizedData = {
      ...data,
      featureCards: data.featureCards?.filter(card => card.title || card.description) ?? [],
      menuItems: data.menuItems?.filter(item => item.label || item.href) ?? [],
      aboutUsChecklist: data.aboutUsChecklist?.filter(item => item) ?? [],
      trustedByLogos: data.trustedByLogos?.filter(logo => logo.src || logo.alt) ?? [],
    };
    
    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
          ...sanitizedData,
          socialMedia: sanitizedData.socialMedia ?? {},
        }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');
    return { message: 'Pengaturan berhasil diperbarui.' };

  } catch (error) {
    console.error('Update settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
