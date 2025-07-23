
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2, Wand2 } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateResourcesPageSettings, generateBlogPostContent } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import type { NewsItem } from '@prisma/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import RichTextEditor from '@/app/admin/produk/rich-text-editor';

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isDirty} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

type ResourcesPageClientProps = {
  settings: WebSettings;
  initialNewsItems: NewsItem[];
};

export default function ResourcesPageClientPage({ settings, initialNewsItems }: ResourcesPageClientProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateResourcesPageSettings, undefined);

  const getInitialFormState = () => ({
    resourcesPageTitle: settings.resourcesPageTitle ?? '',
    resourcesPageSubtitle: settings.resourcesPageSubtitle ?? '',
    newsItems: initialNewsItems.map(item => ({ ...item, slug: item.slug || '' })),
  });

  const [formState, setFormState] = useState(getInitialFormState());
  
  const [uploadingStates, setUploadingStates] = useState<{ [id: number]: boolean }>({});
  const [generatingStates, setGeneratingStates] = useState<{ [id: number]: boolean }>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormState(getInitialFormState());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, initialNewsItems]);
  
  useEffect(() => {
    setIsDirty(JSON.stringify(formState) !== JSON.stringify(getInitialFormState()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);
  
  const toSlug = (name: string) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleFieldChange = (field: keyof typeof formState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormState(prev => {
        const newItems = [...prev.newsItems];
        // @ts-ignore
        newItems[index] = { ...newItems[index], [field]: value };
        return {...prev, newsItems: newItems};
    });
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const newSlug = toSlug(newTitle);
    setFormState(prev => {
      const newItems = [...prev.newsItems];
      const currentItem = newItems[index];
      currentItem.title = newTitle;
      currentItem.slug = newSlug;
      return {...prev, newsItems: newItems};
    });
  }

  const addItem = () => {
    const newItem: NewsItem = {
      id: Date.now(), // Temporary ID
      title: '',
      slug: '',
      category: '',
      image: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // @ts-ignore
    setFormState(prev => ({...prev, newsItems: [newItem, ...prev.newsItems]}));
  };

  const removeItem = (index: number) => {
    setFormState(prev => ({...prev, newsItems: prev.newsItems.filter((_, i) => i !== index)}));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setUploadingStates(prev => ({...prev, [itemId]: true}));
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload image');
        }
        
        const { publicUrl } = await res.json();
        const itemIndex = formState.newsItems.findIndex(item => item.id === itemId);
        handleItemChange(itemIndex, 'image', publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: 'Upload Gagal', variant: 'destructive' });
      } finally {
        setUploadingStates(prev => ({...prev, [itemId]: false}));
        event.target.value = '';
      }
  }

  const handleGenerateContent = async (itemId: number) => {
    const itemIndex = formState.newsItems.findIndex(item => item.id === itemId);
    const currentItem = formState.newsItems[itemIndex];

    if (!currentItem.title) {
        toast({ title: 'Judul Kosong', description: 'Silakan isi judul terlebih dahulu.', variant: 'destructive'});
        return;
    }

    setGeneratingStates(prev => ({...prev, [itemId]: true}));

    try {
        const result = await generateBlogPostContent(currentItem.title);
        if (result.error) {
            throw new Error(result.error);
        }
        handleItemChange(itemIndex, 'content', result.content as string);
        toast({ title: 'Konten Dihasilkan', description: 'Draf konten berhasil dibuat oleh AI.' });
    } catch (error: any) {
        toast({ title: 'Generasi Gagal', description: error.message, variant: 'destructive' });
    } finally {
        setGeneratingStates(prev => ({...prev, [itemId]: false}));
    }
  };

  useEffect(() => {
    if (state?.message) {
      const isSuccess = state.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: state.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) setIsDirty(false);
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="resourcesData" value={JSON.stringify(formState)} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Halaman Knowledge Center</h1>
        <p className="text-muted-foreground">Kelola berita dan artikel yang tampil di halaman Knowledge Center.</p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Header Halaman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="resourcesPageTitle">Judul Halaman</Label><Input id="resourcesPageTitle" value={formState.resourcesPageTitle} onChange={e => handleFieldChange('resourcesPageTitle', e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="resourcesPageSubtitle">Subjudul Halaman</Label><Input id="resourcesPageSubtitle" value={formState.resourcesPageSubtitle} onChange={e => handleFieldChange('resourcesPageSubtitle', e.target.value)} /></div>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Daftar Artikel/Berita</CardTitle>
              <CardDescription>Kelola daftar artikel yang ditampilkan di halaman Knowledge Center.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
              <Accordion type="multiple" className="w-full space-y-2">
                {formState.newsItems.map((item, index) => (
                    <AccordionItem value={`article-${item.id}`} key={item.id} className="border rounded-md px-4 bg-card">
                        <div className="flex justify-between items-center">
                            <AccordionTrigger className="text-sm font-medium flex-grow py-3 text-left">
                                <span className="truncate">Artikel: {item.title || `Artikel Baru ${index + 1}`}</span>
                            </AccordionTrigger>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-destructive h-8 w-8 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <AccordionContent>
                           <div className="border-t pt-4 space-y-4">
                                <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 space-y-2">
                                <div className="relative w-40 h-24 rounded-md bg-muted overflow-hidden border">
                                    {/* @ts-ignore */}
                                    {item.image ? (<Image src={item.image} alt={item.title} fill className="object-cover" />) : (<ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />)}
                                </div>
                                <Input type="file" onChange={(e) => handleImageUpload(e, item.id)} accept="image/png, image/jpeg, image/webp" disabled={uploadingStates[item.id]} className="w-40" />
                                </div>
                                <div className="flex-grow grid grid-cols-1 gap-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Kategori</Label>
                                            {/* @ts-ignore */}
                                            <Input value={item.category} onChange={e => handleItemChange(index, 'category', e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">URL Slug</Label>
                                            {/* @ts-ignore */}
                                            <Input value={item.slug || ''} onChange={e => handleItemChange(index, 'slug', e.target.value)} disabled />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Judul</Label>
                                        <div className="flex gap-2">
                                        {/* @ts-ignore */}
                                        <Input value={item.title} onChange={e => handleTitleChange(index, e.target.value)} />
                                        <Button type="button" variant="outline" size="icon" onClick={() => handleGenerateContent(item.id)} disabled={generatingStates[item.id]}>
                                            {generatingStates[item.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-primary" />}
                                        </Button>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div className="space-y-1">
                                <Label className="text-xs">Konten</Label>
                                 <RichTextEditor
                                    key={`content-${item.id}`}
                                    defaultValue={item.content || ''}
                                    onUpdate={({ editor }) => handleItemChange(index, 'content', editor.getHTML())}
                                />
                                </div>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
              <Button type="button" variant="outline" onClick={addItem} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" /> Tambah Artikel</Button>
          </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4">
        <SubmitButton isDirty={isDirty}/>
      </div>
    </form>
  );
}
