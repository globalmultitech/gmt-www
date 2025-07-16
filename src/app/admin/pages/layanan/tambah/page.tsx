
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LayananForm } from '../layanan-form';

export default function TambahLayananPage() {
  return (
    <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/pages/layanan">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Layanan
            </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Tambah Layanan Baru</h1>
        <LayananForm />
    </div>
  );
}
