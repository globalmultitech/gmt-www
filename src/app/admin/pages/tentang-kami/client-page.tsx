
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateTentangKamiPageSettings } from './actions';
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

export default function TentangKamiPageClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateTentangKamiPageSettings, undefined);
  
  const initialFormState = {
    aboutPageTitle: settings.aboutPageTitle ?? '',
    aboutPageSubtitle: settings.aboutPageSubtitle ?? '',
    missionTitle: settings.missionTitle ?? '',
    missionText: settings.missionText ?? '',
    visionTitle: settings.visionTitle ?? '',
    visionText: settings.visionText ?? '',
    timeline: settings.timeline ?? [],
    teamMembers: settings.teamMembers ?? [],
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

  const handleArrayChange = (field: 'timeline' | 'teamMembers', index: number, subField: string, value: string) => {
    setFormState(prev => {
      const newArray = [...prev[field]];
      // @ts-ignore
      newArray[index] = { ...newArray[index], [subField]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const addItemToArray = (field: 'timeline' | 'teamMembers') => {
    if (field === 'timeline') {
      setFormState(prev => ({...prev, timeline: [...prev.timeline, { year: '', event: ''}]}));
    } else {
      setFormState(prev => ({...prev, teamMembers: [...prev.teamMembers, { name: '', role: '', image: '', linkedin: '', aiHint: ''}]}));
    }
  };

  const removeItemFromArray = (field: 'timeline' | 'teamMembers', index: number) => {
    setFormState(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
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
        handleArrayChange('teamMembers', index, 'image', publicUrl);
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
        <h1 className="text-3xl font-bold">Pengaturan Halaman Tentang Kami</h1>
        <p className="text-muted-foreground">Kelola konten yang tampil di halaman Tentang Kami.</p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="tentangKamiData" value={JSON.stringify(formState)} />
        <Card>
            <CardHeader>
                <CardTitle>Header Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="aboutPageTitle">Judul Halaman</Label><Input id="aboutPageTitle" value={formState.aboutPageTitle} onChange={e => handleFieldChange('aboutPageTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="aboutPageSubtitle">Subjudul Halaman</Label><Input id="aboutPageSubtitle" value={formState.aboutPageSubtitle} onChange={e => handleFieldChange('aboutPageSubtitle', e.target.value)} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Misi & Visi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="missionTitle">Judul Misi</Label><Input id="missionTitle" value={formState.missionTitle} onChange={e => handleFieldChange('missionTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="missionText">Teks Misi</Label><Textarea id="missionText" value={formState.missionText} onChange={e => handleFieldChange('missionText', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="visionTitle">Judul Visi</Label><Input id="visionTitle" value={formState.visionTitle} onChange={e => handleFieldChange('visionTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="visionText">Teks Visi</Label><Textarea id="visionText" value={formState.visionText} onChange={e => handleFieldChange('visionText', e.target.value)} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Sejarah Perusahaan (Timeline)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {formState.timeline.map((item, index) => (
                    <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                            <div className="space-y-1"><Label className="text-xs">Tahun</Label><Input value={item.year} onChange={e => handleArrayChange('timeline', index, 'year', e.target.value)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Kejadian</Label><Input value={item.event} onChange={e => handleArrayChange('timeline', index, 'event', e.target.value)} /></div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromArray('timeline', index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addItemToArray('timeline')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Sejarah</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Tim Kami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {formState.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                        <div className="flex-shrink-0 space-y-2"><div className="relative w-24 h-24 rounded-full bg-muted overflow-hidden border">{member.image ? ( <Image src={member.image} alt={member.name} fill className="object-cover" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}</div><Input type="file" onChange={(e) => handleImageUpload(e, index)} accept="image/png, image/jpeg" disabled={isUploading} className="w-24"/></div>
                        <div className="flex-grow space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1"><Label className="text-xs">Nama</Label><Input value={member.name} onChange={e => handleArrayChange('teamMembers', index, 'name', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Jabatan</Label><Input value={member.role} onChange={e => handleArrayChange('teamMembers', index, 'role', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Link LinkedIn (Opsional)</Label><Input value={member.linkedin} onChange={e => handleArrayChange('teamMembers', index, 'linkedin', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">AI Hint (u/ gambar)</Label><Input value={member.aiHint} onChange={e => handleArrayChange('teamMembers', index, 'aiHint', e.target.value)} /></div>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromArray('teamMembers', index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addItemToArray('teamMembers')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Anggota Tim</Button>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <SubmitButton isDirty={isDirty}/>
        </div>
      </form>
    </div>
  );
}
