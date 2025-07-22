
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const HubungiKamiPageSettingsSchema = z.object({
  contactPageTitle: z.string().optional(),
  contactPageSubtitle: z.string().optional(),
  contactPageMapImageUrl: z.string().optional(),
});

export async function updateHubungiKamiPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const dataToValidate = {
        contactPageTitle: formData.get('contactPageTitle'),
        contactPageSubtitle: formData.get('contactPageSubtitle'),
        contactPageMapImageUrl: formData.get('contactPageMapImageUrl'),
    };

    const validatedFields = HubungiKamiPageSettingsSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
      return { message: "Input tidak valid. Silakan periksa kembali." };
    }
    
    await prisma.webSettings.update({
        where: { id: 1 },
        data: validatedFields.data
    });

    revalidatePath('/hubungi-kami');
    revalidatePath('/admin/pages/hubungi-kami');
    return { message: 'Pengaturan Halaman Hubungi Kami berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Hubungi Kami Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
