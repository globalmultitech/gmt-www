'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const ProfessionalServiceSchema = z.object({
    icon: z.string().optional().default(''),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    details: z.array(z.string()).optional().default([]),
});

const LayananPageSettingsSchema = z.object({
  servicesPageTitle: z.string().optional(),
  servicesPageSubtitle: z.string().optional(),
  servicesPageCommitmentTitle: z.string().optional(),
  servicesPageCommitmentText: z.string().optional(),
  servicesPageHeaderImageUrl: z.string().optional(),
  professionalServices: z.array(ProfessionalServiceSchema).optional(),
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
            
            const detailMatch = field.match(/^(details)\[(\d+)\]$/);
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
        if (Array.isArray(item.details)) {
            item.details = item.details.filter(detail => typeof detail === 'string' && detail.trim() !== '');
        }
        return item;
    }).filter(item => {
        if (!item || typeof item !== 'object') return false;
        return Object.values(item).some(value => {
            if (typeof value === 'string') return value.trim() !== '';
            if (Array.isArray(value)) return value.length > 0;
            return false;
        });
    });
}


export async function updateLayananPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const dataToValidate = {
        servicesPageTitle: formData.get('servicesPageTitle'),
        servicesPageSubtitle: formData.get('servicesPageSubtitle'),
        servicesPageCommitmentTitle: formData.get('servicesPageCommitmentTitle'),
        servicesPageCommitmentText: formData.get('servicesPageCommitmentText'),
        servicesPageHeaderImageUrl: formData.get('servicesPageHeaderImageUrl'),
        professionalServices: getAsArrayOfObjects(formData, 'professionalServices'),
    };

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

    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            servicesPageTitle: data.servicesPageTitle,
            servicesPageSubtitle: data.servicesPageSubtitle,
            servicesPageCommitmentTitle: data.servicesPageCommitmentTitle,
            servicesPageCommitmentText: data.servicesPageCommitmentText,
            servicesPageHeaderImageUrl: data.servicesPageHeaderImageUrl,
            professionalServices: data.professionalServices,
        }
    });

    revalidatePath('/', 'layout');
    return { message: 'Pengaturan Halaman Layanan berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Layanan Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
