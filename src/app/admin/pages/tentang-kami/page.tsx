
import TentangKamiPageClientPage from './client-page';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getSettings } from '@/lib/settings';


export const dynamic = 'force-dynamic';

async function getTentangKamiData() {
  const settings = await getSettings(); // Still need this for page titles
  const timeline = await prisma.timelineEvent.findMany({
    orderBy: { year: 'asc' }
  });
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { createdAt: 'asc' }
  });
  return { settings, timeline, teamMembers };
}

export default async function TentangKamiSettingsPage() {
  const { settings, timeline, teamMembers } = await getTentangKamiData();

  if (!settings) {
    console.error("Web settings not found! Please seed the database.");
    redirect('/admin/dashboard?error=settings_not_found');
  }

  return <TentangKamiPageClientPage settings={settings} initialTimeline={timeline} initialTeamMembers={teamMembers} />;
}
