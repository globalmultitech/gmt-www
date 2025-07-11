
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateTentangKamiPageSettings, updateTimeline, updateTeamMembers } from './actions';
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
  const [headerState, headerFormAction] = useActionState(updateTentangKamiPageSettings, undefined);
  const [timelineState, timelineFormAction] = useActionState(updateTimeline, undefined);
  const [teamState, teamFormAction] = useActionState(updateTeamMembers, undefined);
  
  const [headerForm, setHeaderForm] = useState({
    aboutPageTitle: settings.aboutPageTitle ?? '',
    aboutPageSubtitle: settings.aboutPageSubtitle ?? '',
    missionTitle: settings.missionTitle ?? '',
    missionText: settings.missionText ?? '',
    visionTitle: settings.visionTitle ?? '',
    visionText: settings.visionText ?? '',
  });
  
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

  const [uploadingStates, setUploadingStates] = useState<{[key: number]: boolean}>({});
  const [isHeaderDirty, setIsHeaderDirty] = useState(false);
  const [isTimelineDirty, setIsTimelineDirty] = useState(false);
  const [isTeamDirty, setIsTeamDirty] = useState(false);

  useEffect(() => {
    setHeaderForm({
      aboutPageTitle: settings.aboutPageTitle ?? '',
      aboutPageSubtitle: settings.aboutPageSubtitle ?? '',
      missionTitle: settings.missionTitle ?? '',
      missionText: settings.missionText ?? '',
      visionTitle: settings.visionTitle ?? '',
      visionText: settings.visionText ?? '',
    });
    setTimeline(initialTimeline);
    setTeamMembers(initialTeamMembers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, initialTimeline, initialTeamMembers]);

  useEffect(() => {
    setIsHeaderDirty(JSON.stringify(headerForm) !== JSON.stringify({
      aboutPageTitle: settings.aboutPageTitle ?? '',
      aboutPageSubtitle: settings.aboutPageSubtitle ?? '',
      missionTitle: settings.missionTitle ?? '',
      missionText: settings.missionText ?? '',
      visionTitle: settings.visionTitle ?? '',
      visionText: settings.visionText ?? '',
    }));
  }, [headerForm, settings]);
  
  useEffect(() => {
      setIsTimelineDirty(JSON.stringify(timeline) !== JSON.stringify(initialTimeline));
  }, [timeline, initialTimeline]);
  
  useEffect(() => {
      setIsTeamDirty(JSON.stringify(teamMembers) !== JSON.stringify(initialTeamMembers));
  }, [teamMembers, initialTeamMembers]);

  const handleHeaderChange = (field: keyof typeof headerForm, value: string) => {
    setHeaderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTimelineChange = (index: number, field: keyof TimelineEvent, value: string) => {
    setTimeline(prev => {
      const newTimeline = [...prev];
      // @ts-ignore
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      return newTimeline;
    });
  };

  const handleTeamChange = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => {
      const newMembers = [...prev];
       // @ts-ignore
      newMembers[index] = { ...newMembers[index], [field]: value };
      return newMembers;
    });
  };

  const addTimelineItem = () => {
    // @ts-ignore
    setTimeline(prev => [...prev, { id: Date.now(), year: '', event: '', createdAt: new Date(), updatedAt: new Date() }]);
  };
  const removeTimelineItem = (index: number) => {
    setTimeline(prev => prev.filter((_, i) => i !== index));
  };
  
  const addTeamMember = () => {
    // @ts-ignore
    setTeamMembers(prev => [...prev, { id: Date.now(), name: '', role: '', image: '', linkedin: '#', aiHint: '', createdAt: new Date(), updatedAt: new Date() }]);
  };
  const removeTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingStates(prev => ({...prev, [index]: true}));
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload image');
        }
        
        const { publicUrl } = await res.json();
        handleTeamChange(index, 'image', publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: 'Upload Gagal', variant: 'destructive' });
      } finally {
        setUploadingStates(prev => ({...prev, [index]: false}));
        event.target.value = '';
      }
  }

  useEffect(() => {
    if (headerState?.message) {
      const isSuccess = headerState.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: headerState.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) setIsHeaderDirty(false);
    }
  }, [headerState, toast]);

  useEffect(() => {
    if (timelineState?.message) {
      const isSuccess = timelineState.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: timelineState.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) setIsTimelineDirty(false);
    }
  }, [timelineState, toast]);

  useEffect(() => {
    if (teamState?.message) {
      const isSuccess = teamState.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: teamState.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) setIsTeamDirty(false);
    }
  }, [teamState, toast]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Halaman Tentang Kami</h1>
        <p className="text-muted-foreground">Kelola konten yang tampil di halaman Tentang Kami.</p>
      </div>

      <form action={headerFormAction} className="space-y-6">
        <input type="hidden" name="tentangKamiData" value={JSON.stringify(headerForm)} />
        <Card>
            <CardHeader>
                <CardTitle>Header, Misi & Visi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="aboutPageTitle">Judul Halaman</Label><Input id="aboutPageTitle" value={headerForm.aboutPageTitle} onChange={e => handleHeaderChange('aboutPageTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="aboutPageSubtitle">Subjudul Halaman</Label><Input id="aboutPageSubtitle" value={headerForm.aboutPageSubtitle} onChange={e => handleHeaderChange('aboutPageSubtitle', e.target.value)} /></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2"><Label htmlFor="missionTitle">Judul Misi</Label><Input id="missionTitle" value={headerForm.missionTitle} onChange={e => handleHeaderChange('missionTitle', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="missionText">Teks Misi</Label><Textarea id="missionText" value={headerForm.missionText} onChange={e => handleHeaderChange('missionText', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="visionTitle">Judul Visi</Label><Input id="visionTitle" value={headerForm.visionTitle} onChange={e => handleHeaderChange('visionTitle', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="visionText">Teks Visi</Label><Textarea id="visionText" value={headerForm.visionText} onChange={e => handleHeaderChange('visionText', e.target.value)} /></div>
                </div>
                 <div className="flex justify-end">
                    <SubmitButton isDirty={isHeaderDirty}/>
                </div>
            </CardContent>
        </Card>
      </form>

      <form action={timelineFormAction} className="space-y-6 mt-6">
        <input type="hidden" name="timelineData" value={JSON.stringify(timeline)} />
        <Card>
            <CardHeader>
                <CardTitle>Sejarah Perusahaan (Timeline)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {timeline.map((item, index) => (
                    <div key={item.id} className="flex items-end gap-2 p-2 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                            <div className="space-y-1"><Label className="text-xs">Tahun</Label><Input value={item.year} onChange={e => handleTimelineChange(index, 'year', e.target.value)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Kejadian</Label><Input value={item.event} onChange={e => handleTimelineChange(index, 'event', e.target.value)} /></div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTimelineItem(index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addTimelineItem}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Sejarah</Button>
                <div className="flex justify-end">
                    <SubmitButton isDirty={isTimelineDirty}/>
                </div>
            </CardContent>
        </Card>
      </form>

      <form action={teamFormAction} className="space-y-6 mt-6">
        <input type="hidden" name="teamData" value={JSON.stringify(teamMembers)} />
        <Card>
            <CardHeader>
                <CardTitle>Tim Kami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {teamMembers.map((member, index) => (
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
                                <div className="space-y-1"><Label className="text-xs">Nama</Label><Input value={member.name} onChange={e => handleTeamChange(index, 'name', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Jabatan</Label><Input value={member.role} onChange={e => handleTeamChange(index, 'role', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Link LinkedIn (Opsional)</Label><Input value={member.linkedin || ''} onChange={e => handleTeamChange(index, 'linkedin', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">AI Hint (u/ gambar)</Label><Input value={member.aiHint || ''} onChange={e => handleTeamChange(index, 'aiHint', e.target.value)} /></div>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTeamMember(index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addTeamMember}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Anggota Tim</Button>
                 <div className="flex justify-end">
                    <SubmitButton isDirty={isTeamDirty}/>
                </div>
            </CardContent>
        </Card>
      </form>
    </div>
  );
}
