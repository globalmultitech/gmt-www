
import prisma from '@/lib/db';
import { SolusiForm } from '../../solusi-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getPageData(id: number) {
    const solution = await prisma.solution.findUnique({
        where: { id },
    });

    if (!solution) {
        notFound();
    }
    
    const parentSolutions = await prisma.solution.findMany({
        where: { parentId: null },
        orderBy: { title: 'asc' },
    });

    return { solution, parentSolutions };
}

export default async function EditSolusiPage({ params }: { params: { id: string }}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }
  const { solution, parentSolutions } = await getPageData(id);

  return (
     <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/pages/solusi">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Solusi
            </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Edit Solusi</h1>
        <SolusiForm solution={solution} parentSolutions={parentSolutions} />
    </div>
  );
}
