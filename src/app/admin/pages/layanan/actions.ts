
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';
import type { ProfessionalService } from '@prisma/client';

// Schema for updating the page settings (title, subtitle, etc.)
const LayananPageSettingsSchema = z.object({
  servicesPageTitle: z.string().optional(),
  servicesPageSubtitle: z.string().optional(),
  servicesPageCommitmentTitle: z.string().optional(),
  servicesPageCommitmentText: z.string().optional(),
  servicesPageHeaderImageUrl: z.string().optional(),
});

export async function updateLayananPageSettings(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const jsonString = formData.get('layananData') as string;
    if (!jsonString) return { message: 'Data formulir tidak ditemukan.' };

    const dataToValidate = JSON.parse(jsonString);
    const validatedFields = LayananPageSettingsSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
      console.error('Validation Error:', validatedFields.error);
      return { message: "Input tidak valid." };
    }
    
    await prisma.webSettings.update({
        where: { id: 1 },
        data: validatedFields.data
    });

    revalidatePath('/layanan');
    revalidatePath('/admin/pages/layanan');
    return { message: 'Pengaturan header halaman berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Layanan Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}


// Schema for a single service item from the client
const ServiceSchema = z.object({
    id: z.number(), // Use a temporary ID from the client for existing items
    icon: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
    details: z.array(z.string()).default([]),
});

const ServicesFormSchema = z.array(ServiceSchema);

// This action updates ALL professional services based on the form state.
export async function updateProfessionalServices(prevState: { message: string } | undefined, formData: FormData) {
    try {
        const jsonString = formData.get('servicesData') as string;
        if (!jsonString) return { message: 'Data formulir tidak ditemukan.' };
        
        const dataToValidate = JSON.parse(jsonString);
        const validatedFields = ServicesFormSchema.safeParse(dataToValidate);

        if (!validatedFields.success) {
            console.error('Validation Error:', validatedFields.error);
            return { message: "Input tidak valid. Silakan periksa kembali." };
        }

        const servicesFromClient = validatedFields.data;

        const servicesInDb = await prisma.professionalService.findMany({ select: { id: true } });
        const dbServiceIds = new Set(servicesInDb.map(s => s.id));
        const clientServiceIds = new Set(servicesFromClient.map(s => s.id).filter(id => id < Date.now()));

        const operations = [];

        const idsToDelete = [...dbServiceIds].filter(id => !clientServiceIds.has(id));
        if (idsToDelete.length > 0) {
            operations.push(prisma.professionalService.deleteMany({ where: { id: { in: idsToDelete } } }));
        }

        for (const service of servicesFromClient) {
            const sanitizedData = {
                icon: service.icon,
                title: service.title,
                description: service.description,
                details: service.details.filter(d => d.trim() !== '')
            };

            if (!service.title && !service.description && sanitizedData.details.length === 0) {
                continue;
            }

            if (dbServiceIds.has(service.id)) {
                operations.push(prisma.professionalService.update({
                    where: { id: service.id },
                    data: sanitizedData
                }));
            } else {
                operations.push(prisma.professionalService.create({ data: sanitizedData }));
            }
        }
        
        await prisma.$transaction(operations);

        revalidatePath('/', 'layout');
        revalidatePath('/layanan');
        revalidatePath('/admin/pages/layanan');
        return { message: 'Daftar layanan berhasil diperbarui.' };

    } catch (error) {
        console.error('Update Professional Services error:', error);
        return { message: 'Gagal memperbarui daftar layanan karena kesalahan server.' };
    }
}
