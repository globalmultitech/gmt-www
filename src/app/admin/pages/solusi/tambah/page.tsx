
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SolusiForm } from '../solusi-form';
import prisma from '@/lib/db';

async function getParentSolutions() {
    return prisma.solution.findMany({
        where: { parentId: null },
        orderBy: { title: 'asc' },
    });
}

export default async function TambahSolusiPage() {
  const parentSolutions = await getParentSolutions();
  return (
    <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/pages/solusi">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Solusi
            </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Tambah Solusi Baru</h1>
        <SolusiForm parentSolutions={parentSolutions} />
    </div>
  );
}
