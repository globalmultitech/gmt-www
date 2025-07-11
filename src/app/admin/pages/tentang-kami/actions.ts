
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const TimelineEventSchema = z.object({
    year: z.string().default(''),
    event: z.string().default(''),
});

const TeamMemberSchema = z.object({
    name: z.string().default(''),
    role: z.string().default(''),
    image: z.string().default(''),
    linkedin: z.string().default(''),
    aiHint: z.string().default(''),
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


export async function updateTentangKamiPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const jsonString = formData.get('tentangKamiData') as string;
    if (!jsonString) {
      return { message: 'Data formulir tidak ditemukan.' };
    }
    const dataToValidate = JSON.parse(jsonString);

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

    const sanitizedTimeline = data.timeline?.filter(item => item.year || item.event) ?? [];
    const sanitizedTeamMembers = data.teamMembers?.filter(item => item.name || item.role) ?? [];

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            aboutPageTitle: data.aboutPageTitle,
            aboutPageSubtitle: data.aboutPageSubtitle,
            missionTitle: data.missionTitle,
            missionText: data.missionText,
            visionTitle: data.visionTitle,
            visionText: data.visionText,
            timeline: sanitizedTimeline,
            teamMembers: sanitizedTeamMembers,
        }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/tentang-kami');
    revalidatePath('/admin/pages/tentang-kami');
    return { message: 'Pengaturan Halaman Tentang Kami berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Tentang Kami Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
