'use client';

import { useState, useActionState, useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Loader2, Pencil } from 'lucide-react';
import type { ProductCategory, ProductSubCategory } from '@prisma/client';
import {
  createCategory, updateCategory, deleteCategory,
  createSubCategory, updateSubCategory, deleteSubCategory
} from './actions';
import { useFormStatus } from 'react-dom';

type CategoryWithSubCategories = ProductCategory & {
  subCategories: ProductSubCategory[];
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}

export default function CategoryManagementClientPage({ categories }: { categories: CategoryWithSubCategories[] }) {
  const { toast } = useToast();

  const [dialogState, setDialogState] = useState<{
    mode: 'addCategory' | 'editCategory' | 'addSubCategory' | 'editSubCategory' | null,
    data?: ProductCategory | ProductSubCategory | { categoryId: number }
  }>({ mode: null });
  
  const closeDialog = () => setDialogState({ mode: null });

  const useFormActionWithToast = (action: any, modeToClose: typeof dialogState.mode) => {
    const [state, formAction] = useActionState(action, undefined);
    useEffect(() => {
      if (state?.message) {
        const isSuccess = state.message.includes('berhasil');
        toast({
          title: isSuccess ? 'Sukses' : 'Gagal',
          description: state.message,
          variant: isSuccess ? 'default' : 'destructive',
        });
        if (isSuccess && dialogState.mode === modeToClose) {
          closeDialog();
        }
      }
    }, [state]);
    return formAction;
  };

  const createCategoryAction = useFormActionWithToast(createCategory, 'addCategory');
  const updateCategoryAction = useFormActionWithToast(updateCategory, 'editCategory');
  const createSubCategoryAction = useFormActionWithToast(createSubCategory, 'addSubCategory');
  const updateSubCategoryAction = useFormActionWithToast(updateSubCategory, 'editSubCategory');
  
  const [isPending, startTransition] = useTransition();

  const handleDelete = (action: (id: number) => Promise<{ message: string }>, id: number, type: string) => {
    startTransition(async () => {
      const result = await action(id);
      toast({
        title: result.message.includes('berhasil') ? 'Sukses' : 'Gagal',
        description: result.message,
        variant: result.message.includes('berhasil') ? 'default' : 'destructive',
      });
    });
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manajemen Kategori</h1>
            <Button onClick={() => setDialogState({ mode: 'addCategory' })}>
            <PlusCircle className="mr-2" />
            Tambah Kategori
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Daftar Kategori & Sub-kategori</CardTitle>
                <CardDescription>Kelola semua kategori dan sub-kategori produk di sini.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full">
                    {categories.map((category) => (
                        <AccordionItem value={`category-${category.id}`} key={category.id}>
                            <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <span>{category.name}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setDialogState({ mode: 'editCategory', data: category }); }}><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog onOpenChange={(open) => open && e.stopPropagation()}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Hapus Kategori?</AlertDialogTitle><AlertDialogDescription>Ini akan menghapus kategori dan semua sub-kategorinya.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(deleteCategory, category.id, 'kategori')}>Hapus</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="pl-4 space-y-2">
                                    {category.subCategories.length === 0 && <p className="text-sm text-muted-foreground">Belum ada sub-kategori.</p>}
                                    {category.subCategories.map((sub) => (
                                        <div key={sub.id} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary">
                                            <span>{sub.name}</span>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDialogState({ mode: 'editSubCategory', data: sub })}><Pencil className="h-4 w-4" /></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Hapus Sub-Kategori?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(deleteSubCategory, sub.id, 'sub-kategori')}>Hapus</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setDialogState({ mode: 'addSubCategory', data: { categoryId: category.id }})}>
                                        <PlusCircle className="mr-2 h-4 w-4"/>
                                        Tambah Sub-kategori
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>

        {/* Dialogs */}
        <Dialog open={dialogState.mode !== null} onOpenChange={(open) => !open && closeDialog()}>
            <DialogContent>
                {dialogState.mode === 'addCategory' && (
                    <form action={createCategoryAction}>
                        <DialogHeader><DialogTitle>Tambah Kategori Baru</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-2"><Label htmlFor="name">Nama Kategori</Label><Input id="name" name="name" required /></div>
                        <DialogFooter><Button type="button" variant="ghost" onClick={closeDialog}>Batal</Button><SubmitButton>Simpan</SubmitButton></DialogFooter>
                    </form>
                )}
                 {dialogState.mode === 'editCategory' && (
                    <form action={updateCategoryAction}>
                        <input type="hidden" name="id" value={(dialogState.data as ProductCategory).id} />
                        <DialogHeader><DialogTitle>Edit Kategori</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-2"><Label htmlFor="name">Nama Kategori</Label><Input id="name" name="name" required defaultValue={(dialogState.data as ProductCategory).name} /></div>
                        <DialogFooter><Button type="button" variant="ghost" onClick={closeDialog}>Batal</Button><SubmitButton>Simpan</SubmitButton></DialogFooter>
                    </form>
                )}
                {dialogState.mode === 'addSubCategory' && (
                    <form action={createSubCategoryAction}>
                         <input type="hidden" name="categoryId" value={(dialogState.data as { categoryId: number }).categoryId} />
                        <DialogHeader><DialogTitle>Tambah Sub-Kategori Baru</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-2"><Label htmlFor="name">Nama Sub-Kategori</Label><Input id="name" name="name" required /></div>
                        <DialogFooter><Button type="button" variant="ghost" onClick={closeDialog}>Batal</Button><SubmitButton>Simpan</SubmitButton></DialogFooter>
                    </form>
                )}
                 {dialogState.mode === 'editSubCategory' && (
                    <form action={updateSubCategoryAction}>
                         <input type="hidden" name="id" value={(dialogState.data as ProductSubCategory).id} />
                        <DialogHeader><DialogTitle>Edit Sub-Kategori</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-2"><Label htmlFor="name">Nama Sub-Kategori</Label><Input id="name" name="name" required defaultValue={(dialogState.data as ProductSubCategory).name} /></div>
                        <DialogFooter><Button type="button" variant="ghost" onClick={closeDialog}>Batal</Button><SubmitButton>Simpan</SubmitButton></DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    </div>
  );
}
