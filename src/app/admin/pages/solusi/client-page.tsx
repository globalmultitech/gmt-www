
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

import { PlusCircle, Trash2, Loader2, Pencil, CornerDownRight } from 'lucide-react';
import type { Solution } from '@prisma/client';
import { deleteSolution } from './actions';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import { DynamicIcon } from '@/components/dynamic-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type SolutionWithChildren = Solution & { children: Solution[] };

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
            Tindakan ini akan menghapus solusi dan semua sub-solusi di dalamnya secara permanen.
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

export default function SolusiListPage({ solutions }: { solutions: SolutionWithChildren[] }) {

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

      <Card>
        <CardHeader>
          <CardTitle>Daftar Solusi</CardTitle>
          <CardDescription>Kelola solusi induk dan sub-solusi di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          {solutions.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p>Belum ada data solusi.</p>
            </div>
          ) : (
            solutions.map((solution) => (
              <div key={solution.id} className="border-b last:border-b-0">
                {/* Parent Row */}
                <div className="flex items-center p-4 bg-secondary/50 font-semibold">
                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mr-4 flex-shrink-0">
                    <DynamicIcon name={solution.icon} className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-grow">{solution.title}</div>
                  <div className="text-sm text-muted-foreground mr-8 hidden md:block">{format(new Date(solution.createdAt), "d MMMM yyyy", { locale: id })}</div>
                  <div className="flex-shrink-0">
                     <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/pages/solusi/edit/${solution.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton solutionId={solution.id} />
                  </div>
                </div>
                {/* Children Table */}
                {solution.children && solution.children.length > 0 && (
                  <div className="pl-4 md:pl-10">
                    <Table>
                      <TableBody>
                        {solution.children.map(child => (
                           <TableRow key={child.id}>
                             <TableCell className="w-[80px]">
                                <div className="flex items-center">
                                  <CornerDownRight className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                                      <DynamicIcon name={child.icon} className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                </div>
                             </TableCell>
                             <TableCell className="font-medium">{child.title}</TableCell>
                             <TableCell className="text-right w-[100px]">
                               <Button asChild variant="ghost" size="icon">
                                 <Link href={`/admin/pages/solusi/edit/${child.id}`}>
                                   <Pencil className="h-4 w-4" />
                                 </Link>
                               </Button>
                               <DeleteButton solutionId={child.id} />
                             </TableCell>
                           </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
