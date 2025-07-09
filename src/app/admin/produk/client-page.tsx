'use client';

import { useState, useActionState, useEffect, useTransition } from 'react';
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

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Loader2, Pencil, Upload } from 'lucide-react';
import type { Product } from '@prisma/client';
import { createProduct, deleteProduct, updateProduct } from './actions';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { getSignedURL } from '../actions';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : (isEditing ? 'Simpan Perubahan' : 'Simpan')}
    </Button>
  );
}

function DeleteButton({ productId }: { productId: number }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(productId);
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
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk secara permanen.
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

export default function ProductManagementClientPage({ products }: { products: Product[] }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [createState, createFormAction] = useActionState(createProduct, undefined);
  const [updateState, updateFormAction] = useActionState(updateProduct, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');


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
        headers: {
          'Content-Type': file.type,
        },
      });

      setUploadedImageUrl(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: 'Upload Gagal',
        description: 'Gagal mengunggah gambar. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleOpenDialog = (product: Product | null) => {
    setEditingProduct(product);
    setUploadedImageUrl(product?.image ?? '');
    setDialogOpen(true);
  }

  useEffect(() => {
    const state = editingProduct ? updateState : createState;
    if (state?.message) {
      const isSuccess = state.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: state.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if(isSuccess) {
        setDialogOpen(false);
        setEditingProduct(null);
      }
    }
  }, [createState, updateState, editingProduct, toast]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Produk</h1>
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="mr-2" />
          Tambah Produk
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if(!open) { setEditingProduct(null); setUploadedImageUrl('') }; setDialogOpen(open); }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk {editingProduct ? 'mengubah' : 'menambahkan'} produk.
              </DialogDescription>
            </DialogHeader>
            <form action={editingProduct ? updateFormAction : createFormAction} className="space-y-4">
              {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
              <input type="hidden" name="image" value={uploadedImageUrl} />

              <div className="space-y-1">
                <Label htmlFor="title">Judul Produk</Label>
                <Input id="title" name="title" required defaultValue={editingProduct?.title} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" required defaultValue={editingProduct?.description} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-upload">Gambar Produk</Label>
                <div className="flex items-center gap-4">
                    {uploadedImageUrl && (
                        <Image src={uploadedImageUrl} alt="Preview" width={80} height={80} className="rounded-md object-cover" />
                    )}
                     <Input id="image-upload" name="image-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading}/>
                     {isUploading && <Loader2 className="animate-spin" />}
                </div>
              </div>

               <div className="space-y-1">
                <Label htmlFor="features">Fitur Utama</Label>
                <Textarea id="features" name="features" required rows={5} placeholder="Satu fitur per baris" defaultValue={editingProduct?.features.join('\n')}/>
                 <p className="text-xs text-muted-foreground">Tulis setiap fitur pada baris baru.</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                <Input id="metaTitle" name="metaTitle" defaultValue={editingProduct?.metaTitle ?? ''} />
                 <p className="text-xs text-muted-foreground">Judul yang akan muncul di tab browser dan hasil pencarian Google. Jika kosong, akan menggunakan judul produk.</p>
              </div>
               <div className="space-y-1">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea id="metaDescription" name="metaDescription" defaultValue={editingProduct?.metaDescription ?? ''}/>
                 <p className="text-xs text-muted-foreground">Deskripsi singkat (max 160 karakter) untuk hasil pencarian Google.</p>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Batal</Button>
                <SubmitButton isEditing={!!editingProduct} />
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>


      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Gambar</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                  Belum ada data produk.
                </TableCell>
              </TableRow>
            ) : (
               products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image src={product.image} alt={product.title} width={64} height={64} className="rounded-md object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteButton productId={product.id} />
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
