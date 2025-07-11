
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const ProfessionalServiceSchema = z.object({
    icon: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
    details: z.array(z.string()).default([]),
});

const LayananPageSettingsSchema = z.object({
  servicesPageTitle: z.string().optional(),
  servicesPageSubtitle: z.string().optional(),
  servicesPageCommitmentTitle: z.string().optional(),
  servicesPageCommitmentText: z.string().optional(),
  servicesPageHeaderImageUrl: z.string().optional(),
  professionalServices: z.array(ProfessionalServiceSchema).optional(),
});

export async function updateLayananPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const jsonString = formData.get('layananData') as string;
    if (!jsonString) {
      return { message: 'Data formulir tidak ditemukan.' };
    }
    const dataToValidate = JSON.parse(jsonString);
    
    const validatedFields = LayananPageSettingsSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
      console.error('Validation Error:', JSON.stringify(validatedFields.error.flatten(), null, 2));
      const errorMessages = validatedFields.error.flatten().fieldErrors;
      const message = Object.entries(errorMessages)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('; ');
          
      return { message: message || "Input tidak valid. Silakan periksa kembali." };
    }
    
    const data = validatedFields.data;

    // Filter out empty items before saving
    const sanitizedServices = data.professionalServices?.filter(service => {
        return service.title || service.description || (service.details && service.details.some(d => d.trim() !== ''));
    }).map(service => ({
        ...service,
        details: service.details.filter(d => d.trim() !== '')
    })) ?? [];

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            servicesPageTitle: data.servicesPageTitle,
            servicesPageSubtitle: data.servicesPageSubtitle,
            servicesPageCommitmentTitle: data.servicesPageCommitmentTitle,
            servicesPageCommitmentText: data.servicesPageCommitmentText,
            servicesPageHeaderImageUrl: data.servicesPageHeaderImageUrl,
            professionalServices: sanitizedServices,
        }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/layanan');
    revalidatePath('/admin/pages/layanan');
    return { message: 'Pengaturan Halaman Layanan berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Layanan Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
