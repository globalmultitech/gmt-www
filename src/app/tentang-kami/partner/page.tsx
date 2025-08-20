
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import PartnerClientPage from './partner-client-page';

async function getPartnerData() {
    const partners = await prisma.partnerLogo.findMany({
        orderBy: { id: 'asc' }
    });
    return { partners };
}

export const metadata: Metadata = {
  title: 'Partner Kami | Global Multi Technology',
  description: 'Kami berkolaborasi dengan para pemimpin teknologi global untuk memberikan solusi terbaik bagi pelanggan kami.',
};


export default async function PartnerPage() {
  const { partners } = await getPartnerData();

  return (
    <PartnerClientPage partners={partners} />
  );
}
