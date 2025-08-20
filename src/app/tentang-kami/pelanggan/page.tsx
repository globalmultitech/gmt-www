
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import PelangganClientPage from './pelanggan-client-page';

async function getCustomerData() {
    const customers = await prisma.customerLogo.findMany({
        orderBy: { id: 'asc' }
    });
    return { customers };
}

export const metadata: Metadata = {
  title: 'Pelanggan Kami | Global Multi Technology',
  description: 'Solusi kami telah dipercaya dan diimplementasikan di berbagai institusi terkemuka di Indonesia.',
};

export default async function PelangganPage() {
  const { customers } = await getCustomerData();

  return (
    <PelangganClientPage customers={customers} />
  );
}
