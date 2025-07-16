
'use client';

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { PlusCircle, Trash2, Loader2, Pencil } from 'lucide-react';
import type { Solution } from '@prisma/client';
import { deleteSolution } from './actions';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import { DynamicIcon } from '@/components/dynamic-icon';

function DeleteButton({ solutionId }: { solutionId: number }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSolution(solutionId);
      toast({
        title: result.message.includes('berhasil') ? 'Sukses' : 'Gagal',
        description: result.message,
        variant: result.message.includes('berhasil') ? 'default' : 'destructive',
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus solusi secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            {isPending ? <Loader2 className="animate-spin" /> : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SolusiListPage({ solutions }: { solutions: Solution[] }) {

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Solusi</h1>
        <Button asChild>
          <Link href="/admin/pages/solusi/tambah">
            <PlusCircle className="mr-2" />
            Tambah Solusi
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Ikon</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                  Belum ada data solusi.
                </TableCell>
              </TableRow>
            ) : (
               solutions.map((solution) => (
                  <TableRow key={solution.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                          <DynamicIcon name={solution.icon} className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{solution.title}</TableCell>
                    <TableCell>{format(new Date(solution.createdAt), "d MMMM yyyy", { locale: id })}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/pages/solusi/edit/${solution.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton solutionId={solution.id} />
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
