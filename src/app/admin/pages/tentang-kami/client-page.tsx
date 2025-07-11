
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
import Image from 'next/image';
import type { TimelineEvent, TeamMember } from '@prisma/client';

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isDirty} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

type TentangKamiPageClientProps = {
  settings: WebSettings;
  initialTimeline: TimelineEvent[];
  initialTeamMembers: TeamMember[];
};

export default function TentangKamiPageClientPage({ settings, initialTimeline, initialTeamMembers }: TentangKamiPageClientProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateTentangKamiPageSettings, undefined);
  
  const [formState, setFormState] = useState({
    aboutPageTitle: settings.aboutPageTitle ?? '',
    aboutPageSubtitle: settings.aboutPageSubtitle ?? '',
    missionTitle: settings.missionTitle ?? '',
    missionText: settings.missionText ?? '',
    visionTitle: settings.visionTitle ?? '',
    visionText: settings.visionText ?? '',
    timeline: initialTimeline,
    teamMembers: initialTeamMembers,
  });
  
  const [uploadingStates, setUploadingStates] = useState<{[key: number]: boolean}>({});
  const [isDirty, setIsDirty] = useState(false);

  const getInitialFormState = () => ({
    aboutPageTitle: settings.aboutPageTitle ?? '',
    aboutPageSubtitle: settings.aboutPageSubtitle ?? '',
    missionTitle: settings.missionTitle ?? '',
    missionText: settings.missionText ?? '',
    visionTitle: settings.visionTitle ?? '',
    visionText: settings.visionText ?? '',
    timeline: initialTimeline,
    teamMembers: initialTeamMembers,
  });

  useEffect(() => {
    setIsDirty(JSON.stringify(formState) !== JSON.stringify(getInitialFormState()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);
  
  const handleFieldChange = (field: keyof typeof formState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (arrayName: 'timeline' | 'teamMembers', index: number, field: string, value: string) => {
    setFormState(prev => {
        const newArray = [...prev[arrayName]];
        // @ts-ignore
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [arrayName]: newArray };
    });
  };

  const addItem = (arrayName: 'timeline' | 'teamMembers') => {
    if (arrayName === 'timeline') {
      // @ts-ignore
      setFormState(prev => ({...prev, timeline: [...prev.timeline, { id: Date.now(), year: '', event: '', createdAt: new Date(), updatedAt: new Date() }]}));
    } else {
      // @ts-ignore
      setFormState(prev => ({...prev, teamMembers: [...prev.teamMembers, { id: Date.now(), name: '', role: '', image: '', linkedin: '#', aiHint: '', createdAt: new Date(), updatedAt: new Date() }]}));
    }
  };

  const removeItem = (arrayName: 'timeline' | 'teamMembers', index: number) => {
    setFormState(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingStates(prev => ({...prev, [index]: true}));
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload image');
        
        const { publicUrl } = await res.json();
        handleItemChange('teamMembers', index, 'image', publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: 'Upload Gagal', variant: 'destructive' });
      } finally {
        setUploadingStates(prev => ({...prev, [index]: false}));
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
      if (isSuccess) setIsDirty(false);
    }
  }, [state, toast]);


  return (
    <form action={formAction} className="space-y-6">
       <input type="hidden" name="tentangKamiData" value={JSON.stringify(formState)} />
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Pengaturan Halaman Tentang Kami</h1>
            <p className="text-muted-foreground">Kelola konten yang tampil di halaman Tentang Kami.</p>
        </div>
      </div>
        <Card>
            <CardHeader>
                <CardTitle>Header, Misi & Visi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-2"><Label htmlFor="aboutPageTitle">Judul Halaman</Label><Input id="aboutPageTitle" value={formState.aboutPageTitle} onChange={e => handleFieldChange('aboutPageTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="aboutPageSubtitle">Subjudul Halaman</Label><Input id="aboutPageSubtitle" value={formState.aboutPageSubtitle} onChange={e => handleFieldChange('aboutPageSubtitle', e.target.value)} /></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2"><Label htmlFor="missionTitle">Judul Misi</Label><Input id="missionTitle" value={formState.missionTitle} onChange={e => handleFieldChange('missionTitle', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="missionText">Teks Misi</Label><Textarea id="missionText" value={formState.missionText} onChange={e => handleFieldChange('missionText', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="visionTitle">Judul Visi</Label><Input id="visionTitle" value={formState.visionTitle} onChange={e => handleFieldChange('visionTitle', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="visionText">Teks Visi</Label><Textarea id="visionText" value={formState.visionText} onChange={e => handleFieldChange('visionText', e.target.value)} /></div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Sejarah Perusahaan (Timeline)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {formState.timeline.map((item, index) => (
                    <div key={item.id} className="flex items-end gap-2 p-2 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                            <div className="space-y-1"><Label className="text-xs">Tahun</Label><Input value={item.year} onChange={e => handleItemChange('timeline', index, 'year', e.target.value)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Kejadian</Label><Input value={item.event} onChange={e => handleItemChange('timeline', index, 'event', e.target.value)} /></div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem('timeline', index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addItem('timeline')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Sejarah</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Tim Kami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {formState.teamMembers.map((member, index) => (
                    <div key={member.id} className="flex items-start gap-4 p-4 border rounded-md">
                        <div className="flex-shrink-0 space-y-2">
                          <div className="relative w-24 h-24 rounded-full bg-muted overflow-hidden border">
                            {member.image ? ( <Image src={member.image} alt={member.name} fill className="object-cover" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                          </div>
                          <div className="flex items-center gap-2 w-24">
                            <Input type="file" onChange={(e) => handleImageUpload(e, index)} accept="image/png, image/jpeg, image/webp" disabled={uploadingStates[index]} className="w-full"/>
                            {uploadingStates[index] && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        </div>
                        <div className="flex-grow space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1"><Label className="text-xs">Nama</Label><Input value={member.name} onChange={e => handleItemChange('teamMembers', index, 'name', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Jabatan</Label><Input value={member.role} onChange={e => handleItemChange('teamMembers', index, 'role', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Link LinkedIn (Opsional)</Label><Input value={member.linkedin || ''} onChange={e => handleItemChange('teamMembers', index, 'linkedin', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">AI Hint (u/ gambar)</Label><Input value={member.aiHint || ''} onChange={e => handleItemChange('teamMembers', index, 'aiHint', e.target.value)} /></div>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem('teamMembers', index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addItem('teamMembers')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Anggota Tim</Button>
            </CardContent>
        </Card>
        <div className="flex justify-end">
            <SubmitButton isDirty={isDirty}/>
        </div>
    </form>
  );
}
