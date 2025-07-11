
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Loader2, Pencil, Image as ImageIcon, X } from 'lucide-react';
import type { Product, ProductCategory, ProductSubCategory } from '@prisma/client';
import { createProduct, deleteProduct, updateProduct } from './actions';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type CategoryWithSubCategories = ProductCategory & {
  subCategories: ProductSubCategory[];
};

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

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')           // replace spaces with -
    .replace(/-+/g, '-');          // replace multiple - with single -
}

export default function ProductManagementClientPage({ products, categories }: { products: Product[], categories: CategoryWithSubCategories[] }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [createState, createFormAction] = useActionState(createProduct, undefined);
  const [updateState, updateFormAction] = useActionState(updateProduct, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [productTitle, setProductTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<{ key: string, value: string }[]>([{ key: '', value: '' }]);


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setProductTitle(newTitle);
    setSlug(generateSlug(newTitle));
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const { publicUrl } = await res.json();
      setImageUrls(prev => [...prev, publicUrl]);
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
  
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  const handleOpenDialog = (product: Product | null) => {
    setEditingProduct(product);
    if (product) {
      setProductTitle(product.title);
      setSlug(product.slug);
      setImageUrls((product.images as string[]) ?? []);
      setFeatures(Array.isArray(product.features) ? product.features : ['']);
      const specs = product.specifications && typeof product.specifications === 'object' 
        ? Object.entries(product.specifications).map(([key, value]) => ({ key: String(key), value: String(value) }))
        : [{ key: '', value: '' }];
      setSpecifications(specs.length > 0 ? specs : [{key: '', value: ''}]);
    } else {
      setProductTitle('');
      setSlug('');
      setImageUrls([]);
      setFeatures(['']);
      setSpecifications([{ key: '', value: '' }]);
    }
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

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };
  const addSpecification = () => setSpecifications([...specifications, { key: '', value: '' }]);
  const removeSpecification = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Produk</h1>
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="mr-2" />
          Tambah Produk
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if(!open) { setEditingProduct(null); }; setDialogOpen(open); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk {editingProduct ? 'mengubah' : 'menambahkan'} produk.
              </DialogDescription>
            </DialogHeader>
            <form action={editingProduct ? updateFormAction : createFormAction} className="space-y-4">
              {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
              <input type="hidden" name="images" value={JSON.stringify(imageUrls)} />
              <input type="hidden" name="features" value={JSON.stringify(features.filter(f => f.trim() !== ''))} />
              <input type="hidden" name="specifications" value={JSON.stringify(
                Object.fromEntries(specifications.filter(s => s.key.trim() !== '').map(s => [s.key, s.value]))
              )} />


              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Judul Produk</Label>
                  <Input id="title" name="title" required value={productTitle} onChange={handleTitleChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input id="slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="subCategoryId">Kategori Produk</Label>
                <Select name="subCategoryId" required defaultValue={editingProduct?.subCategoryId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sub-kategori..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectGroup key={category.id}>
                        <SelectLabel>{category.name}</SelectLabel>
                        {category.subCategories.map((subCategory) => (
                           <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                             {subCategory.name}
                           </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Deskripsi Singkat</Label>
                <Textarea id="description" name="description" required defaultValue={editingProduct?.description} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="longDescription">Deskripsi Lengkap</Label>
                <Textarea id="longDescription" name="longDescription" rows={5} defaultValue={editingProduct?.longDescription ?? ''} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label htmlFor="tokopediaUrl">Link Tokopedia</Label>
                    <Input id="tokopediaUrl" name="tokopediaUrl" defaultValue={editingProduct?.tokopediaUrl ?? ''} placeholder="https://tokopedia.com/link-produk" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="shopeeUrl">Link Shopee</Label>
                    <Input id="shopeeUrl" name="shopeeUrl" defaultValue={editingProduct?.shopeeUrl ?? ''} placeholder="https://shopee.co.id/link-produk" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gambar Produk</Label>
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image src={url} alt={`Preview ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full aspect-square" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-50 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Input id="image-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading}/>
                  {isUploading && <Loader2 className="animate-spin" />}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fitur Utama</Label>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Fitur ${index + 1}`}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="text-destructive h-9 w-9">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Fitur
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Spesifikasi</Label>
                <div className="space-y-2">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        placeholder="Label (e.g. Ukuran)"
                        className="w-1/3"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="Nilai (e.g. 21.5 inci)"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecification(index)} className="text-destructive h-9 w-9">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Spesifikasi
                </Button>
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
               products.map((product) => {
                const mainImage = (product.images as string[])?.[0];
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      {mainImage ? (
                          <Image src={mainImage} alt={product.title} width={64} height={64} className="rounded-md object-cover bg-muted" />
                      ) : (
                          <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{format(new Date(product.createdAt), "d MMMM yyyy", { locale: id })}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton productId={product.id} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
