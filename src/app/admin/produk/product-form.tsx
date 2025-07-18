
'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
import { Loader2, PlusCircle, Trash2, X } from 'lucide-react';
import type { Product, ProductCategory, ProductSubCategory } from '@prisma/client';
import { createProduct, updateProduct } from './actions';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './rich-text-editor';

type CategoryWithSubCategories = ProductCategory & {
  subCategories: ProductSubCategory[];
};

type ProductFormProps = {
  categories: CategoryWithSubCategories[];
  product?: Product | null;
}

type Feature = {
    title: string;
    description: string;
}

type Specification = {
    key: string;
    value: string;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
      {pending ? <Loader2 className="animate-spin" /> : (isEditing ? 'Simpan Perubahan' : 'Tambah Produk')}
    </Button>
  );
}

const generateSlug = (title: string) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const parseJsonSafe = (json: any, fallback: any, forceArray = false) => {
    let parsedJson;
    if (typeof json === 'string') {
        try {
            parsedJson = JSON.parse(json);
        } catch (e) {
            parsedJson = fallback;
        }
    } else {
        parsedJson = json ?? fallback;
    }

    if (forceArray && !Array.isArray(parsedJson)) {
        // If it's an object, convert it to an array of its key-value pairs
        if (typeof parsedJson === 'object' && parsedJson !== null) {
             return Object.entries(parsedJson).map(([key, value]) => ({ key, value }));
        }
        // Otherwise, wrap it in an array or return the fallback if it's not convertible
        return fallback;
    }
    
    return parsedJson;
}


export function ProductForm({ categories, product = null }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!product;

  const formAction = isEditing ? updateProduct : createProduct;
  // @ts-ignore
  const [state, dispatch] = useActionState(formAction, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(parseJsonSafe(product?.images, [], true));
  const [productTitle, setProductTitle] = useState(product?.title ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');

  const [features, setFeatures] = useState<Feature[]>(parseJsonSafe(product?.features, [{ title: '', description: '' }], true));
  const [specifications, setSpecifications] = useState<Specification[]>(parseJsonSafe(product?.specifications, [{ key: '', value: '' }], true));

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

      if (!res.ok) throw new Error("Failed to upload image");

      const { publicUrl } = await res.json();
      setImageUrls(prev => [...prev, publicUrl]);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: 'Upload Gagal',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  }
  
  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };
  const addFeature = () => setFeatures([...features, { title: '', description: '' }]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };
  const addSpecification = () => setSpecifications([...specifications, { key: '', value: '' }]);
  const removeSpecification = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index));


  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? 'Sukses' : 'Gagal',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={dispatch} className="space-y-8">
        {isEditing && <input type="hidden" name="id" value={product.id} />}
        <input type="hidden" name="images" value={JSON.stringify(imageUrls)} />
        <input type="hidden" name="features" value={JSON.stringify(features.filter(f => f && typeof f.title === 'string' && f.title.trim() !== ''))} />
        <input type="hidden" name="specifications" value={JSON.stringify(
            specifications.filter(s => s && typeof s.key === 'string' && s.key.trim() !== '')
        )} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>Informasi utama yang akan ditampilkan di halaman produk.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title">Judul Produk</Label>
                            <Input id="title" name="title" required value={productTitle} onChange={handleTitleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">Deskripsi Singkat</Label>
                            <Textarea id="description" name="description" required defaultValue={product?.description} />
                        </div>
                        <div className="space-y-1">
                          <Label>Deskripsi Lengkap</Label>
                          <RichTextEditor name="longDescription" defaultValue={product?.longDescription ?? ''} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Gambar Produk</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Fitur & Spesifikasi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Fitur Utama</Label>
                          <div className="space-y-2">
                            {features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} placeholder={`Judul Fitur ${index + 1}`} />
                                <Input value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} placeholder={`Deskripsi Fitur ${index + 1}`} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={addFeature}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Fitur</Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Spesifikasi</Label>
                          <div className="space-y-2">
                            {specifications.map((spec, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={spec.key} onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)} placeholder="Label (e.g. Ukuran)" />
                                <Input value={spec.value} onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)} placeholder="Nilai (e.g. 21.5 inci)" />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecification(index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={addSpecification}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Spesifikasi</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Pengaturan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="slug">Slug URL</Label>
                            <Input id="slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="subCategoryId">Kategori Produk</Label>
                          <Select name="subCategoryId" required defaultValue={product?.subCategoryId?.toString()}>
                            <SelectTrigger><SelectValue placeholder="Pilih sub-kategori..." /></SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectGroup key={category.id}>
                                  <SelectLabel>{category.name}</SelectLabel>
                                  {category.subCategories.map((subCategory) => (<SelectItem key={subCategory.id} value={subCategory.id.toString()}>{subCategory.name}</SelectItem>))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Toko Online</CardTitle>
                        <CardDescription>Tautkan produk ini ke halaman marketplace.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor="tokopediaUrl">Link Tokopedia</Label>
                          <Input id="tokopediaUrl" name="tokopediaUrl" defaultValue={product?.tokopediaUrl ?? ''} placeholder="https://tokopedia.com/link-produk" />
                      </div>
                      <div className="space-y-1">
                          <Label htmlFor="shopeeUrl">Link Shopee</Label>
                          <Input id="shopeeUrl" name="shopeeUrl" defaultValue={product?.shopeeUrl ?? ''} placeholder="https://shopee.co.id/link-produk" />
                      </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>SEO (Search Engine Optimization)</CardTitle>
                        <CardDescription>Bantu mesin pencari seperti Google memahami produk Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="space-y-1">
                          <Label htmlFor="metaTitle">Meta Title</Label>
                          <Input id="metaTitle" name="metaTitle" defaultValue={product?.metaTitle ?? ''} />
                           <p className="text-xs text-muted-foreground">Judul di tab browser dan hasil Google. Jika kosong, akan menggunakan judul produk.</p>
                        </div>
                         <div className="space-y-1">
                          <Label htmlFor="metaDescription">Meta Description</Label>
                          <Textarea id="metaDescription" name="metaDescription" defaultValue={product?.metaDescription ?? ''}/>
                           <p className="text-xs text-muted-foreground">Deskripsi singkat (max 160 karakter) untuk hasil Google.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="flex justify-end mt-8">
            <SubmitButton isEditing={isEditing} />
        </div>
    </form>
  )
}
