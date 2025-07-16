
import prisma from '@/lib/db';
import { LayananForm } from '../../layanan-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getLayanan(id: number) {
    const service = await prisma.professionalService.findUnique({
        where: { id },
    });
    if (!service) {
        notFound();
    }
    return service;
}

export default async function EditLayananPage({ params }: { params: { id: string }}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }
  const service = await getLayanan(id);

  return (
     <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/pages/layanan">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Layanan
            </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Edit Layanan</h1>
        <LayananForm service={service}/>
    </div>
  );
}
