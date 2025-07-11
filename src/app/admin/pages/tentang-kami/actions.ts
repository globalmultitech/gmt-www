
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { z } from 'zod';

const TimelineEventSchema = z.object({
    id: z.number(),
    year: z.string().default(''),
    event: z.string().default(''),
});

const TeamMemberSchema = z.object({
    id: z.number(),
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

    // --- Page Settings Update ---
    await prisma.webSettings.update({
        where: { id: 1 },
        data: {
            aboutPageTitle: data.aboutPageTitle,
            aboutPageSubtitle: data.aboutPageSubtitle,
            missionTitle: data.missionTitle,
            missionText: data.missionText,
            visionTitle: data.visionTitle,
            visionText: data.visionText,
        }
    });

    // --- Timeline Synchronization ---
    const timelineFromClient = data.timeline ?? [];
    const timelineInDb = await prisma.timelineEvent.findMany({ select: { id: true } });
    const dbTimelineIds = new Set(timelineInDb.map(s => s.id));
    const clientTimelineIds = new Set(timelineFromClient.map(s => s.id).filter(id => id < Date.now()));
    
    const timelineOps = [];
    const timelineIdsToDelete = [...dbTimelineIds].filter(id => !clientTimelineIds.has(id));
    if (timelineIdsToDelete.length > 0) {
        timelineOps.push(prisma.timelineEvent.deleteMany({ where: { id: { in: timelineIdsToDelete } } }));
    }
    for (const item of timelineFromClient) {
        const sanitizedData = { year: item.year, event: item.event };
        if (!item.year && !item.event) continue;
        if (dbTimelineIds.has(item.id)) {
            timelineOps.push(prisma.timelineEvent.update({ where: { id: item.id }, data: sanitizedData }));
        } else {
            timelineOps.push(prisma.timelineEvent.create({ data: sanitizedData }));
        }
    }
    
    // --- Team Member Synchronization ---
    const teamMembersFromClient = data.teamMembers ?? [];
    const teamMembersInDb = await prisma.teamMember.findMany({ select: { id: true } });
    const dbTeamMemberIds = new Set(teamMembersInDb.map(s => s.id));
    const clientTeamMemberIds = new Set(teamMembersFromClient.map(s => s.id).filter(id => id < Date.now()));

    const teamMemberOps = [];
    const teamMemberIdsToDelete = [...dbTeamMemberIds].filter(id => !clientTeamMemberIds.has(id));
     if (teamMemberIdsToDelete.length > 0) {
        teamMemberOps.push(prisma.teamMember.deleteMany({ where: { id: { in: teamMemberIdsToDelete } } }));
    }
    for (const item of teamMembersFromClient) {
        const sanitizedData = { name: item.name, role: item.role, image: item.image, linkedin: item.linkedin, aiHint: item.aiHint };
        if (!item.name && !item.role) continue;
        if (dbTeamMemberIds.has(item.id)) {
            teamMemberOps.push(prisma.teamMember.update({ where: { id: item.id }, data: sanitizedData }));
        } else {
            teamMemberOps.push(prisma.teamMember.create({ data: sanitizedData }));
        }
    }

    await prisma.$transaction([...timelineOps, ...teamMemberOps]);

    revalidatePath('/', 'layout');
    revalidatePath('/tentang-kami');
    revalidatePath('/admin/pages/tentang-kami');
    return { message: 'Pengaturan Halaman Tentang Kami berhasil diperbarui.' };

  } catch (error) {
    console.error('Update Tentang Kami Page settings error:', error);
    return { message: 'Gagal memperbarui pengaturan karena kesalahan server.' };
  }
}
