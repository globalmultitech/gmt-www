'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings, NewsItem } from '@/lib/settings';
import { updateResourcesPageSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSignedURL } from '../../actions';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

export default function ResourcesPageClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateResourcesPageSettings, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(settings.newsItems ?? []);

  const handleArrayOfObjectsChange = <T,>(index: number, field: keyof T, value: string | string[], state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => {
      const newState = [...state];
      newState[index] = { ...newState[index], [field]: value };
      setState(newState);
  };
  const addArrayOfObjectsItem = <T,>(newItem: T, state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => setState([...state, newItem]);
  const removeArrayOfObjectsItem = <T,>(index: number, state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => setState(state.filter((_, i) => i !== index));

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleDynamicImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number, field: 'image' | 'src', state: any[], setState: React.Dispatch<React.SetStateAction<any[]>>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const checksum = await computeSHA256(file);
        const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
        await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        handleArrayOfObjectsChange(index, field, publicUrl, state, setState);
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
    }
  }, [state, toast]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Halaman Resources</h1>
        <p className="text-muted-foreground">Kelola berita dan artikel yang tampil di halaman Resources.</p>
      </div>

      <form action={formAction} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Header Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="resourcesPageTitle">Judul Halaman</Label><Input id="resourcesPageTitle" name="resourcesPageTitle" defaultValue={settings.resourcesPageTitle ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="resourcesPageSubtitle">Subjudul Halaman</Label><Input id="resourcesPageSubtitle" name="resourcesPageSubtitle" defaultValue={settings.resourcesPageSubtitle ?? ''} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Berita Terbaru</CardTitle>
                <CardDescription>Kelola daftar berita yang ditampilkan di halaman Resources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {newsItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                        <input type="hidden" name={`newsItems[${index}][image]`} value={item.image} />
                        <div className="flex-shrink-0 space-y-2"><div className="relative w-40 h-24 rounded-md bg-muted overflow-hidden border">{item.image ? (<Image src={item.image} alt={item.title} fill className="object-cover" />) : (<ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />)}</div><Input type="file" onChange={(e) => handleDynamicImageUpload(e, index, 'image', newsItems, setNewsItems)} accept="image/png, image/jpeg" disabled={isUploading} className="w-40" /></div>
                        <div className="flex-grow space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1"><Label className="text-xs">Judul</Label><Input name={`newsItems[${index}][title]`} value={item.title} onChange={e => handleArrayOfObjectsChange(index, 'title', e.target.value, newsItems, setNewsItems)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Kategori</Label><Input name={`newsItems[${index}][category]`} value={item.category} onChange={e => handleArrayOfObjectsChange(index, 'category', e.target.value, newsItems, setNewsItems)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Tanggal</Label><Input name={`newsItems[${index}][date]`} value={item.date} onChange={e => handleArrayOfObjectsChange(index, 'date', e.target.value, newsItems, setNewsItems)} /></div>
                                <div className="space-y-1"><Label className="text-xs">AI Hint</Label><Input name={`newsItems[${index}][aiHint]`} value={item.aiHint} onChange={e => handleArrayOfObjectsChange(index, 'aiHint', e.target.value, newsItems, setNewsItems)} /></div>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, newsItems, setNewsItems)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({ title: '', category: '', date: '', image: '', aiHint: ''}, newsItems, setNewsItems)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Berita</Button>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}