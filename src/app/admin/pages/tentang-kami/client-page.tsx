'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings, TimelineEvent, TeamMember } from '@/lib/settings';
import { updateTentangKamiPageSettings } from './actions';
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

export default function TentangKamiPageClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateTentangKamiPageSettings, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(settings.timeline ?? []);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(settings.teamMembers ?? []);

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
        <h1 className="text-3xl font-bold">Pengaturan Halaman Tentang Kami</h1>
        <p className="text-muted-foreground">Kelola konten yang tampil di halaman Tentang Kami.</p>
      </div>

      <form action={formAction} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Header Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="aboutPageTitle">Judul Halaman</Label><Input id="aboutPageTitle" name="aboutPageTitle" defaultValue={settings.aboutPageTitle ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="aboutPageSubtitle">Subjudul Halaman</Label><Input id="aboutPageSubtitle" name="aboutPageSubtitle" defaultValue={settings.aboutPageSubtitle ?? ''} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Misi & Visi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="missionTitle">Judul Misi</Label><Input id="missionTitle" name="missionTitle" defaultValue={settings.missionTitle ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="missionText">Teks Misi</Label><Textarea id="missionText" name="missionText" defaultValue={settings.missionText ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="visionTitle">Judul Visi</Label><Input id="visionTitle" name="visionTitle" defaultValue={settings.visionTitle ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="visionText">Teks Visi</Label><Textarea id="visionText" name="visionText" defaultValue={settings.visionText ?? ''} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Sejarah Perusahaan (Timeline)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {timeline.map((item, index) => (
                    <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                            <div className="space-y-1"><Label className="text-xs">Tahun</Label><Input name={`timeline[${index}][year]`} value={item.year} onChange={e => handleArrayOfObjectsChange(index, 'year', e.target.value, timeline, setTimeline)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Kejadian</Label><Input name={`timeline[${index}][event]`} value={item.event} onChange={e => handleArrayOfObjectsChange(index, 'event', e.target.value, timeline, setTimeline)} /></div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, timeline, setTimeline)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({ year: '', event: ''}, timeline, setTimeline)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Sejarah</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Tim Kami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                        <input type="hidden" name={`teamMembers[${index}][image]`} value={member.image} />
                        <div className="flex-shrink-0 space-y-2"><div className="relative w-24 h-24 rounded-full bg-muted overflow-hidden border">{member.image ? ( <Image src={member.image} alt={member.name} fill className="object-cover" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}</div><Input type="file" onChange={(e) => handleDynamicImageUpload(e, index, 'image', teamMembers, setTeamMembers)} accept="image/png, image/jpeg" disabled={isUploading} className="w-24"/></div>
                        <div className="flex-grow space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1"><Label className="text-xs">Nama</Label><Input name={`teamMembers[${index}][name]`} value={member.name} onChange={e => handleArrayOfObjectsChange(index, 'name', e.target.value, teamMembers, setTeamMembers)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Jabatan</Label><Input name={`teamMembers[${index}][role]`} value={member.role} onChange={e => handleArrayOfObjectsChange(index, 'role', e.target.value, teamMembers, setTeamMembers)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Link LinkedIn (Opsional)</Label><Input name={`teamMembers[${index}][linkedin]`} value={member.linkedin} onChange={e => handleArrayOfObjectsChange(index, 'linkedin', e.target.value, teamMembers, setTeamMembers)} /></div>
                                <div className="space-y-1"><Label className="text-xs">AI Hint (u/ gambar)</Label><Input name={`teamMembers[${index}][aiHint]`} value={member.aiHint} onChange={e => handleArrayOfObjectsChange(index, 'aiHint', e.target.value, teamMembers, setTeamMembers)} /></div>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, teamMembers, setTeamMembers)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({ name: '', role: '', image: '', linkedin: '', aiHint: ''}, teamMembers, setTeamMembers)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Anggota Tim</Button>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}