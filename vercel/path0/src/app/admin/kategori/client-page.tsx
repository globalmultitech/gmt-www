
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
import { PlusCircle, Trash2, Loader2, Pencil, Image as ImageIcon } from 'lucide-react';
import type { ProductCategory, ProductSubCategory } from '@prisma/client';
import {
  createCategory, updateCategory, deleteCategory,
  createSubCategory, updateSubCategory, deleteSubCategory
} from './actions';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { getSignedURL } from '../actions';
import { Textarea } from '@/components/ui/textarea';

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
    data?: Partial<ProductCategory> & { id?: number } | ProductSubCategory | { categoryId: number }
  }>({ mode: null });
  
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const checksum = await computeSHA256(file);
      const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
      
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setImageUrl(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: 'Upload Gagal',
        description: 'Gagal mengunggah gambar. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const closeDialog = () => {
    setDialogState({ mode: null });
    setImageUrl('');
  }
  
  const openEditDialog = (category: ProductCategory) => {
    setDialogState({ mode: 'editCategory', data: category });
    setImageUrl(category.imageUrl || '');
  }

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
                                    <div className="relative w-16 h-10 rounded-md bg-muted overflow-hidden">
                                      {category.imageUrl ? (
                                        <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                                      ) : (
                                        <div className="flex items-center justify-center h-full w-full">
                                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                      )}
                                    </div>
                                    <span>{category.name}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEditDialog(category); }}><Pencil className="h-4 w-4" /></Button>
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
        <Dialog open={dialogState.mode === 'addCategory' || dialogState.mode === 'editCategory'} onOpenChange={(open) => !open && closeDialog()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                {['addCategory', 'editCategory'].includes(dialogState.mode!) && (
                    <form action={dialogState.mode === 'editCategory' ? updateCategoryAction : createCategoryAction} className="space-y-4">
                        {dialogState.mode === 'editCategory' && <input type="hidden" name="id" value={(dialogState.data as ProductCategory).id} />}
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                        
                        <DialogHeader>
                          <DialogTitle>{dialogState.mode === 'editCategory' ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-2">
                            <Label htmlFor="image-upload">Gambar Kategori</Label>
                             <div className="relative w-full h-40 rounded-md bg-muted overflow-hidden">
                                {imageUrl ? (
                                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                              <Input id="image-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading}/>
                              {isUploading && <Loader2 className="animate-spin" />}
                            </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="name">Nama Kategori</Label>
                          <Input id="name" name="name" required defaultValue={(dialogState.data as ProductCategory)?.name ?? ''} />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="description">Deskripsi</Label>
                          <Textarea id="description" name="description" defaultValue={(dialogState.data as ProductCategory)?.description ?? ''} />
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={closeDialog}>Batal</Button>
                            <SubmitButton>Simpan</SubmitButton>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
        
        <Dialog open={dialogState.mode === 'addSubCategory' || dialogState.mode === 'editSubCategory'} onOpenChange={(open) => !open && closeDialog()}>
            <DialogContent>
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
