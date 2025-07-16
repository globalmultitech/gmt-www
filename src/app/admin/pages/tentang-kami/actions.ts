
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const LogoSchema = z.object({
    id: z.number(),
    src: z.string().default(''),
    alt: z.string().default(''),
});

const TentangKamiPageSettingsSchema = z.object({
  aboutPageTitle: z.string().optional(),
  aboutPageSubtitle: z.string().optional(),
  partners: z.array(LogoSchema).optional(),
  customers: z.array(LogoSchema).optional(),
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
      return { message: "Input tidak valid. Silakan periksa kembali." };
    }
    
    const data = validatedFields.data;

    // --- Page Settings Update ---
    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            aboutPageTitle: data.aboutPageTitle,
            aboutPageSubtitle: data.aboutPageSubtitle,
        }
    });

    // --- Partner Logos Synchronization ---
    const partnersFromClient = data.partners ?? [];
    const partnersInDb = await prisma.partnerLogo.findMany({ select: { id: true } });
    const dbPartnerIds = new Set(partnersInDb.map(p => p.id));
    const clientPartnerIds = new Set(partnersFromClient.map(p => p.id).filter(id => id < Date.now()));
    
    const partnerOps = [];
    const partnerIdsToDelete = [...dbPartnerIds].filter(id => !clientPartnerIds.has(id));
    if (partnerIdsToDelete.length > 0) {
        partnerOps.push(prisma.partnerLogo.deleteMany({ where: { id: { in: partnerIdsToDelete } } }));
    }
    for (const item of partnersFromClient) {
        const sanitizedData = { src: item.src, alt: item.alt };
        if (!item.src && !item.alt) continue;
        if (dbPartnerIds.has(item.id)) {
            partnerOps.push(prisma.partnerLogo.update({ where: { id: item.id }, data: sanitizedData }));
        } else {
            partnerOps.push(prisma.partnerLogo.create({ data: sanitizedData }));
        }
    }
    
    // --- Customer Logos Synchronization ---
    const customersFromClient = data.customers ?? [];
    const customersInDb = await prisma.customerLogo.findMany({ select: { id: true } });
    const dbCustomerIds = new Set(customersInDb.map(c => c.id));
    const clientCustomerIds = new Set(customersFromClient.map(c => c.id).filter(id => id < Date.now()));

    const customerOps = [];
    const customerIdsToDelete = [...dbCustomerIds].filter(id => !clientCustomerIds.has(id));
     if (customerIdsToDelete.length > 0) {
        customerOps.push(prisma.customerLogo.deleteMany({ where: { id: { in: customerIdsToDelete } } }));
    }
    for (const item of customersFromClient) {
        const sanitizedData = { src: item.src, alt: item.alt };
        if (!item.src && !item.alt) continue;
        if (dbCustomerIds.has(item.id)) {
            customerOps.push(prisma.customerLogo.update({ where: { id: item.id }, data: sanitizedData }));
        } else {
            customerOps.push(prisma.customerLogo.create({ data: sanitizedData }));
        }
    }

    await prisma.$transaction([...partnerOps, ...customerOps]);

    revalidatePath('/tentang-kami');
    revalidatePath('/admin/pages/tentang-kami');
    return { message: 'Pengaturan Halaman Tentang Kami berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Tentang Kami Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
