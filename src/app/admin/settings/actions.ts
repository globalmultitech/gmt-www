'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import { getSettings } from '@/lib/settings';

const SettingsSchema = z.object({
  logoUrl: z.string().optional(),
  companyName: z.string().min(1, 'Nama perusahaan tidak boleh kosong'),
  whatsappSales: z.string().min(1, 'Nomor WhatsApp tidak boleh kosong'),
  footerText: z.string().min(1, 'Teks footer tidak boleh kosong'),
  socialMedia: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk link sosial media tidak valid' });
      return z.NEVER;
    }
  }),
  menuItems: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Format JSON untuk menu tidak valid' });
      return z.NEVER;
    }
  }),
  // Hero section fields
  heroHeadline: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImageUrl: z.string().optional(),
  heroButton1Text: z.string().optional(),
  heroButton1Link: z.string().optional(),
  heroButton2Text: z.string().optional(),
  heroButton2Link: z.string().optional(),
});

export async function getWebSettings() {
    return getSettings();
}

export async function updateWebSettings(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = SettingsSchema.safeParse({
    logoUrl: formData.get('logoUrl'),
    companyName: formData.get('companyName'),
    whatsappSales: formData.get('whatsappSales'),
    footerText: formData.get('footerText'),
    socialMedia: formData.get('socialMedia'),
    menuItems: formData.get('menuItems'),
    heroHeadline: formData.get('heroHeadline'),
    heroDescription: formData.get('heroDescription'),
    heroImageUrl: formData.get('heroImageUrl'),
    heroButton1Text: formData.get('heroButton1Text'),
    heroButton1Link: formData.get('heroButton1Link'),
    heroButton2Text: formData.get('heroButton2Text'),
    heroButton2Link: formData.get('heroButton2Link'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
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
