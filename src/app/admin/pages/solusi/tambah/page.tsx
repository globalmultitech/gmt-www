
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SolusiForm } from '../solusi-form';

export default function TambahSolusiPage() {
  return (
    <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/pages/solusi">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Solusi
            </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Tambah Solusi Baru</h1>
        <SolusiForm />
    </div>
  );
}
