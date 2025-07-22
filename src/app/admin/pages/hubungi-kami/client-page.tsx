
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateHubungiKamiPageSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isDirty} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

export default function HubungiKamiPageClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateHubungiKamiPageSettings, undefined);

  const [formState, setFormState] = useState(settings);
  const [isUploading, setIsUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formState) !== JSON.stringify(settings));
  }, [formState, settings]);

  const handleFieldChange = (field: keyof typeof formState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal mengunggah gambar");
      const { publicUrl } = await res.json();
      handleFieldChange('contactPageMapImageUrl', publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      event.target.value = '';
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Halaman Hubungi Kami</h1>
        <p className="text-muted-foreground">Kelola konten yang tampil di halaman Hubungi Kami.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Konten Halaman</CardTitle>
          <CardDescription>Atur judul, subjudul, dan gambar peta untuk halaman kontak.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactPageTitle">Judul Halaman</Label>
              <Input
                id="contactPageTitle"
                name="contactPageTitle"
                value={formState.contactPageTitle ?? ''}
                onChange={e => handleFieldChange('contactPageTitle', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPageSubtitle">Subjudul Halaman</Label>
              <Textarea
                id="contactPageSubtitle"
                name="contactPageSubtitle"
                value={formState.contactPageSubtitle ?? ''}
                onChange={e => handleFieldChange('contactPageSubtitle', e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="map-image-upload">Gambar Peta Lokasi</Label>
            <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden border">
              {formState.contactPageMapImageUrl ? (
                <Image src={formState.contactPageMapImageUrl} alt="Preview Peta" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Input
                id="map-image-upload"
                name="contactPageMapImageUrl"
                type="file"
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/webp"
                disabled={isUploading}
                className="hidden" 
              />
               <input type="hidden" name="contactPageMapImageUrl" value={formState.contactPageMapImageUrl ?? ''} />
              <Button asChild variant="outline">
                <label htmlFor="map-image-upload" className="cursor-pointer">
                  {isUploading ? <Loader2 className="mr-2 animate-spin" /> : 'Unggah Gambar'}
                </label>
              </Button>
              {isUploading && <p className="text-sm text-muted-foreground">Mengunggah...</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4">
        <SubmitButton isDirty={isDirty}/>
      </div>
    </form>
  );
}
