

'use client';

import { useState, useActionState, useEffect } from 'react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type CategoryWithSubCategories = ProductCategory & {
  subCategories: ProductSubCategory[];
};

type ProductFormProps = {
  categories: CategoryWithSubCategories[];
  product?: Product | null;
}

type Feature = {
    id: number | string;
    title: string;
    description: string;
}

type Specifications = {
    headers: string[];
    rows: (string[] & { id: number | string })[];
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

const parseJsonSafe = (json: any, fallback: any) => {
    let parsedJson;
    if (typeof json === 'string') {
        try {
            parsedJson = JSON.parse(json);
        } catch (e) {
            return fallback;
        }
    } else {
        parsedJson = json ?? fallback;
    }
    
    if (typeof parsedJson === 'object' && parsedJson !== null && 'headers' in parsedJson && 'rows' in parsedJson) {
        if (!Array.isArray(parsedJson.headers)) {
            parsedJson.headers = fallback.headers;
        }
        if (!Array.isArray(parsedJson.rows)) {
            parsedJson.rows = fallback.rows;
        }
        parsedJson.rows = parsedJson.rows.map((row: string[] | (string[] & {id: any}), index: number) => {
            const newRow = [...row] as (string[] & { id: number | string});
            // @ts-ignore
            if (!newRow.id) {
               newRow.id = `row-${Date.now()}-${index}`;
            }
            return newRow;
        });
    } else if (Array.isArray(parsedJson)) {
        return parsedJson.map((item, index) => ({
            ...item,
            id: item.id || `item-${Date.now()}-${index}`
        }));
    } else {
        return fallback;
    }

    return parsedJson;
};

// Moved outside the main component
const DynamicSpecEditor = ({ title, specifications, setSpecifications }: { title: string, specifications: Specifications, setSpecifications: React.Dispatch<React.SetStateAction<Specifications>> }) => {

  const handleSpecHeaderChange = (index: number, value: string) => {
    setSpecifications(prev => {
        const newHeaders = [...prev.headers];
        newHeaders[index] = value;
        return { ...prev, headers: newHeaders };
    });
  }

  const addSpecHeader = () => {
    setSpecifications(prev => ({
        headers: [...prev.headers, ''],
        rows: prev.rows.map(row => [...row, ''] as (string[] & { id: string | number}))
    }));
  }

  const removeSpecHeader = (index: number) => {
    setSpecifications(prev => ({
        headers: prev.headers.filter((_, i) => i !== index),
        rows: prev.rows.map(row => row.filter((_, i) => i !== index) as (string[] & { id: string | number}))
    }));
  }

  const handleSpecRowChange = (rowIndex: number, colIndex: number, value: string) => {
    setSpecifications(prev => {
        const newRows = [...prev.rows];
        const newRow = [...newRows[rowIndex]] as (string[] & {id: any});
        newRow[colIndex] = value;
        newRow.id = newRows[rowIndex].id;
        newRows[rowIndex] = newRow;
        return { ...prev, rows: newRows };
    });
  }
  
  const addSpecRow = () => {
    setSpecifications(prev => {
        const newRow = Array(prev.headers.length).fill('') as (string[] & { id: string | number });
        newRow.id = `new-${Date.now()}`;
        return { ...prev, rows: [...prev.rows, newRow] };
    });
  }

  const removeSpecRow = (rowIndex: number) => {
    setSpecifications(prev => ({
        ...prev,
        rows: prev.rows.filter((_, i) => i !== rowIndex)
    }));
  }

  const getSummary = (htmlString: string) => {
    if (!htmlString) return '';
    const text = htmlString.replace(/<[^>]*>?/gm, '');
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="p-4 border rounded-md space-y-2 bg-muted/50">
                    <Label className="text-sm font-semibold">Judul Kolom</Label>
                    <div className="grid grid-cols-1 gap-2">
                        {specifications?.headers?.map((header, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input value={header} onChange={(e) => handleSpecHeaderChange(index, e.target.value)} placeholder={`Kolom ${index + 1}`} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecHeader(index)} className="text-destructive h-9 w-9 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addSpecHeader}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Kolom</Button>
                </div>
                 <div className="space-y-2">
                    <Label className="text-sm font-semibold">Baris Data</Label>
                    <Accordion type="multiple" className="w-full space-y-2">
                      {specifications?.rows?.map((row, rowIndex) => {
                          const summary = getSummary(row[0]);
                          return (
                            <AccordionItem value={`spec-row-${row.id}`} key={row.id} className="border rounded-md px-4 bg-card">
                                <div className="flex justify-between items-center">
                                  <AccordionTrigger className="text-sm font-medium flex-grow py-3 text-left">
                                      <span className="truncate">
                                        Baris {rowIndex + 1}: {summary || 'Data Baru'}
                                      </span>
                                  </AccordionTrigger>
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(rowIndex)} className="text-destructive h-8 w-8 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                                <AccordionContent>
                                    <div className="flex flex-col gap-4 pt-2">
                                        {row.map((cell, colIndex) => (
                                          <div key={colIndex} className="space-y-1">
                                            <Label className="text-sm text-muted-foreground">{specifications.headers[colIndex] || `Kolom ${colIndex + 1}`}</Label>
                                            <RichTextEditor
                                                key={`spec-${row.id}-${colIndex}`}
                                                defaultValue={cell}
                                                onUpdate={({ editor }) => handleSpecRowChange(rowIndex, colIndex, editor.getHTML())}
                                            />
                                          </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                          );
                      })}
                    </Accordion>
                    <Button type="button" variant="outline" size="sm" onClick={addSpecRow}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Baris</Button>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}


export function ProductForm({ categories, product = null }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!product;

  const formAction = isEditing ? updateProduct : createProduct;
  // @ts-ignore
  const [state, dispatch] = useActionState(formAction, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(parseJsonSafe(product?.images, []));
  const [productTitle, setProductTitle] = useState(product?.title ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');

  const [features, setFeatures] = useState<Feature[]>(parseJsonSafe(product?.features, []));
  
  const [technicalSpecifications, setTechnicalSpecifications] = useState<Specifications>(parseJsonSafe(product?.technicalSpecifications, { headers: [''], rows: [] }));
  const [generalSpecifications, setGeneralSpecifications] = useState<Specifications>(parseJsonSafe(product?.generalSpecifications, { headers: [''], rows: [] }));
  
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
    setFeatures(currentFeatures => {
        const newFeatures = [...currentFeatures];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        return newFeatures;
    });
  };
  const addFeature = () => setFeatures([...features, { id: `new-${Date.now()}`, title: '', description: '' }]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleFormSubmit = (formData: FormData) => {
    const featuresToSave = features.map(({id, ...rest}) => rest).filter(f => {
        const descHtml = f.description || '';
        const descText = descHtml.replace(/<[^>]*>?/gm, '').trim();
        return (f.title && f.title.trim() !== '') || descText !== '';
    });
    formData.set('features', JSON.stringify(featuresToSave));
    
    // Technical Specifications
    const filteredTechHeaders = technicalSpecifications.headers.filter(h => h.trim() !== '');
    const techSpecsToSave = {
        headers: filteredTechHeaders,
        rows: technicalSpecifications.rows.map(rowWithId => {
            const { id, ...rest } = rowWithId;
            return Object.values(rest).slice(0, filteredTechHeaders.length);
        }).filter(row => row.some(cell => typeof cell === 'string' && cell.replace(/<[^>]*>?/gm, '').trim() !== ''))
    };
    formData.set('technicalSpecifications', JSON.stringify(techSpecsToSave));
    
    // General Specifications
    const filteredGeneralHeaders = generalSpecifications.headers.filter(h => h.trim() !== '');
    const generalSpecsToSave = {
        headers: filteredGeneralHeaders,
        rows: generalSpecifications.rows.map(rowWithId => {
            const { id, ...rest } = rowWithId;
            return Object.values(rest).slice(0, filteredGeneralHeaders.length);
        }).filter(row => row.some(cell => typeof cell === 'string' && cell.replace(/<[^>]*>?/gm, '').trim() !== ''))
    };
    formData.set('generalSpecifications', JSON.stringify(generalSpecsToSave));

    dispatch(formData);
  }

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
    <form action={handleFormSubmit} className="space-y-8">
        {isEditing && <input type="hidden" name="id" value={product.id} />}
        <input type="hidden" name="images" value={JSON.stringify(imageUrls)} />
        
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
                        <CardTitle>Fitur Utama</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Accordion type="multiple" className="w-full space-y-2">
                          {features.map((feature, index) => (
                              <AccordionItem value={`feature-${feature.id}`} key={feature.id} className="border rounded-md px-4 bg-card">
                                  <div className="flex justify-between items-center">
                                      <AccordionTrigger className="text-sm font-medium flex-grow py-3 text-left">
                                          <span className="truncate">Fitur: {feature.title || `Fitur Baru ${index + 1}`}</span>
                                      </AccordionTrigger>
                                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="text-destructive h-8 w-8 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                                  </div>
                                  <AccordionContent>
                                      <div className="space-y-4 pt-2">
                                          <div className='space-y-1'>
                                              <Label htmlFor={`feature-title-${feature.id}`}>Judul Fitur</Label>
                                              <Input id={`feature-title-${feature.id}`} value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} placeholder={`Judul Fitur ${index + 1}`} />
                                          </div>
                                          <div className='space-y-1'>
                                              <Label>Deskripsi Fitur</Label>
                                              <RichTextEditor
                                                  key={`feature-desc-${feature.id}`}
                                                  defaultValue={feature.description}
                                                  onUpdate={({ editor }) => handleFeatureChange(index, 'description', editor.getHTML())}
                                              />
                                          </div>
                                      </div>
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </Accordion>
                      <Button type="button" variant="outline" size="sm" onClick={addFeature} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" /> Tambah Fitur</Button>
                    </CardContent>
                </Card>

                <DynamicSpecEditor
                  title="Spesifikasi Teknis"
                  specifications={technicalSpecifications}
                  setSpecifications={setTechnicalSpecifications}
                />
                
                <DynamicSpecEditor
                  title="Spesifikasi Umum"
                  specifications={generalSpecifications}
                  setSpecifications={setGeneralSpecifications}
                />

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
