
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateResourcesPageSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSignedURL } from '../../actions';
import Image from 'next/image';

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isDirty} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

export default function ResourcesPageClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateResourcesPageSettings, undefined);

  const initialFormState = {
    resourcesPageTitle: settings.resourcesPageTitle ?? '',
    resourcesPageSubtitle: settings.resourcesPageSubtitle ?? '',
    newsItems: settings.newsItems ?? [],
  };

  const [formState, setFormState] = useState(initialFormState);
  const [isUploading, setIsUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormState(initialFormState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formState) !== JSON.stringify(initialFormState));
  }, [formState, initialFormState]);

  const handleFieldChange = (field: keyof typeof initialFormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setFormState(prev => {
        const newItems = [...prev.newsItems];
        newItems[index] = {...newItems[index], [field]: value};
        return {...prev, newsItems: newItems};
    });
  };

  const addItem = () => {
    setFormState(prev => ({...prev, newsItems: [...prev.newsItems, { title: '', category: '', date: '', image: '', aiHint: ''}]}));
  };

  const removeItem = (index: number) => {
    setFormState(prev => ({...prev, newsItems: prev.newsItems.filter((_, i) => i !== index)}));
  };

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const checksum = await computeSHA256(file);
        const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
        await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        handleItemChange(index, 'image', publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: 'Upload Gagal', variant: 'destructive' });
      } finally {
        setIsUploading(false);
        event.target.value = '';
      }
  }

  useEffect(() => {
    if (state?.message) {
      const isSuccess = state.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: state.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) {
        setIsDirty(false);
      }
    }
  }, [state, toast]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Halaman Resources</h1>
        <p className="text-muted-foreground">Kelola berita dan artikel yang tampil di halaman Resources.</p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="resourcesData" value={JSON.stringify(formState)} />
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
                <CardTitle>Berita Terbaru</CardTitle>
                <CardDescription>Kelola daftar berita yang ditampilkan di halaman Resources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {formState.newsItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                        <div className="flex-shrink-0 space-y-2"><div className="relative w-40 h-24 rounded-md bg-muted overflow-hidden border">{item.image ? (<Image src={item.image} alt={item.title} fill className="object-cover" />) : (<ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />)}</div><Input type="file" onChange={(e) => handleImageUpload(e, index)} accept="image/png, image/jpeg" disabled={isUploading} className="w-40" /></div>
                        <div className="flex-grow space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1"><Label className="text-xs">Judul</Label><Input value={item.title} onChange={e => handleItemChange(index, 'title', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Kategori</Label><Input value={item.category} onChange={e => handleItemChange(index, 'category', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Tanggal</Label><Input value={item.date} onChange={e => handleItemChange(index, 'date', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">AI Hint</Label><Input value={item.aiHint} onChange={e => handleItemChange(index, 'aiHint', e.target.value)} /></div>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Berita</Button>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <SubmitButton isDirty={isDirty}/>
        </div>
      </form>
    </div>
  );
}
