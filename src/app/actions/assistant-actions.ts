'use server';

import prisma from '@/lib/db';
import { z } from 'zod';

const ChatLeadSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  company: z.string().min(1, 'Perusahaan tidak boleh kosong'),
  contact: z.string().min(1, 'Kontak atau Email tidak boleh kosong'),
  initialMessage: z.string().min(1, 'Pesan tidak boleh kosong'),
});

export async function saveChatLead(formData: {
  name: string;
  company: string;
  contact: string;
  initialMessage: string;
}) {
  const validatedFields = ChatLeadSchema.safeParse(formData);

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const message = Object.values(error).flat()[0] || 'Input tidak valid.';
    return { success: false, message };
  }

  try {
    await prisma.chatLead.create({
      data: validatedFields.data,
    });
    return { success: true, message: 'Data berhasil disimpan.' };
  } catch (error) {
    console.error('Failed to save chat lead:', error);
    return { success: false, message: 'Gagal menyimpan data ke server.' };
  }
}
