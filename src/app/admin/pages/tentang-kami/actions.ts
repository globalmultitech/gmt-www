'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

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

const TentangKamiPageSettingsSchema = z.object({
  aboutPageTitle: z.string().optional(),
  aboutPageSubtitle: z.string().optional(),
  missionTitle: z.string().optional(),
  missionText: z.string().optional(),
  visionTitle: z.string().optional(),
  visionText: z.string().optional(),
  timeline: z.array(TimelineEventSchema).optional(),
  teamMembers: z.array(TeamMemberSchema).optional(),
});


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
    
    return Object.values(items).filter(item => {
        if (!item || typeof item !== 'object') return false;
        return Object.values(item).some(value => {
            if (typeof value === 'string') return value.trim() !== '';
            return false;
        });
    });
}


export async function updateTentangKamiPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const dataToValidate = {
        aboutPageTitle: formData.get('aboutPageTitle'),
        aboutPageSubtitle: formData.get('aboutPageSubtitle'),
        missionTitle: formData.get('missionTitle'),
        missionText: formData.get('missionText'),
        visionTitle: formData.get('visionTitle'),
        visionText: formData.get('visionText'),
        timeline: getAsArrayOfObjects(formData, 'timeline'),
        teamMembers: getAsArrayOfObjects(formData, 'teamMembers'),
    };

    const validatedFields = TentangKamiPageSettingsSchema.safeParse(dataToValidate);

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
            aboutPageTitle: data.aboutPageTitle,
            aboutPageSubtitle: data.aboutPageSubtitle,
            missionTitle: data.missionTitle,
            missionText: data.missionText,
            visionTitle: data.visionTitle,
            visionText: data.visionText,
            timeline: data.timeline,
            teamMembers: data.teamMembers,
        }
    });

    revalidatePath('/', 'layout');
    return { message: 'Pengaturan Halaman Tentang Kami berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Tentang Kami Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
