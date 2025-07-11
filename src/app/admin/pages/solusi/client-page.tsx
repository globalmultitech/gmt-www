
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateSolutions, updateSolusiPageSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { DynamicIcon } from '@/components/dynamic-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Solution } from '@prisma/client';

const availableIcons = [
    'Activity', 'Airplay', 'AlarmClock', 'AlertCircle', 'Archive', 'ArrowDownCircle', 'ArrowUpCircle',
    'Award', 'Banknote', 'BarChart', 'BarChart2', 'BarChart3', 'BarChart4', 'Bell', 'Briefcase',
    'Building', 'Building2', 'Calculator', 'Calendar', 'Camera', 'CheckCircle', 'CheckSquare',
    'ChevronDown', 'ChevronUp', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle', 'CloudLightning',
    'CloudRain', 'CloudSnow', 'Code', 'Code2', 'Codepen', 'Codesandbox', 'Cog', 'Compass',
    'Contact', 'Copy', 'Cpu', 'CreditCard', 'Database', 'Disc', 'Download', 'Edit', 'Edit2',
    'Edit3', 'ExternalLink', 'Eye', 'Facebook', 'File', 'FileText', 'Filter', 'Flag', 'Folder',
    'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest', 'Github', 'Globe', 'HardDrive',
    'Headphones', 'Heart', 'HelpCircle', 'Home', 'Image', 'Inbox', 'Info', 'Instagram', 'Key',
    'Landmark', 'Layers', 'Layout', 'LifeBuoy', 'Lightbulb', 'LineChart', 'Link', 'Linkedin',
    'List', 'Lock', 'LogIn', 'LogOut', 'Mail', 'Map', 'MapPin', 'Maximize', 'Medal',
    'Menu', 'MessageCircle', 'MessageSquare', 'Mic', 'Minimize', 'Monitor', 'MonitorSmartphone',
    'Moon', 'MoreHorizontal', 'MoreVertical', 'MousePointer', 'Move', 'Music', 'Package',
    'Paperclip', 'Pause', 'PenTool', 'Percent', 'Phone', 'PieChart', 'Play', 'Power', 'Printer',
    'QrCode', 'Radio', 'RefreshCcw', 'RefreshCw', 'Repeat', 'Rocket', 'Save', 'Scale', 'Scissors',
    'ScreenShare', 'Search', 'Send', 'Server', 'Settings', 'Share', 'Share2', 'Shield',
    'ShieldCheck', 'ShoppingBag', 'ShoppingCart', 'Slack', 'Sliders', 'Smartphone', 'Speaker',
    'Star', 'Sun', 'Sunrise', 'Sunset', 'Table', 'Tag', 'Target', 'Terminal', 'ThumbsDown',
    'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Trash', 'Trash2', 'TrendingUp',
    'Truck', 'Twitch', 'Twitter', 'Type', 'Umbrella', 'Unlock', 'Upload', 'UserCheck', 'UserPlus', 'UserX', 'Users', 'Video', 'Voicemail', 'Wallet', 'Watch',
    'Wifi', 'Wind', 'X', 'XCircle', 'Youtube', 'Zap'
].sort();

type SolusiPageClientProps = {
  settings: WebSettings;
  initialSolutions: Solution[];
};

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isDirty} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

export default function SolusiPageClientPage({ settings, initialSolutions }: SolusiPageClientProps) {
  const { toast } = useToast();
  const [headerState, headerFormAction] = useActionState(updateSolusiPageSettings, undefined);
  const [solutionsState, solutionsFormAction] = useActionState(updateSolutions, undefined);

  const [headerForm, setHeaderForm] = useState({
    solutionsPageTitle: settings.solutionsPageTitle ?? '',
    solutionsPageSubtitle: settings.solutionsPageSubtitle ?? '',
  });

  const [solutions, setSolutions] = useState(initialSolutions.map(s => ({
    ...s,
    keyPoints: Array.isArray(s.keyPoints) ? s.keyPoints : []
  })));

  const [isHeaderDirty, setIsHeaderDirty] = useState(false);
  const [isSolutionsDirty, setIsSolutionsDirty] = useState(false);
  const [uploadingStates, setUploadingStates] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    setHeaderForm({
        solutionsPageTitle: settings.solutionsPageTitle ?? '',
        solutionsPageSubtitle: settings.solutionsPageSubtitle ?? '',
    });
    setSolutions(initialSolutions.map(s => ({
      ...s,
      keyPoints: Array.isArray(s.keyPoints) ? s.keyPoints : []
    })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, initialSolutions]);

  useEffect(() => {
    setIsHeaderDirty(JSON.stringify(headerForm) !== JSON.stringify({
        solutionsPageTitle: settings.solutionsPageTitle ?? '',
        solutionsPageSubtitle: settings.solutionsPageSubtitle ?? '',
    }));
  }, [headerForm, settings]);

  useEffect(() => {
    const initialSolutionsFormatted = initialSolutions.map(s => ({...s, keyPoints: Array.isArray(s.keyPoints) ? s.keyPoints : [] }));
    setIsSolutionsDirty(JSON.stringify(solutions) !== JSON.stringify(initialSolutionsFormatted));
  }, [solutions, initialSolutions]);

  const handleHeaderChange = (field: keyof typeof headerForm, value: any) => {
    setHeaderForm(prev => ({...prev, [field]: value}));
  };

  const handleSolutionChange = (index: number, field: string, value: any) => {
    setSolutions(prev => {
      const newSolutions = [...prev];
      newSolutions[index] = {...newSolutions[index], [field]: value};
      return newSolutions;
    });
  };

  const handleKeyPointChange = (solutionIndex: number, pointIndex: number, value: string) => {
    setSolutions(prev => {
        const newSolutions = [...prev];
        // @ts-ignore
        const newKeyPoints = [...newSolutions[solutionIndex].keyPoints];
        newKeyPoints[pointIndex] = value;
        newSolutions[solutionIndex] = {...newSolutions[solutionIndex], keyPoints: newKeyPoints};
        return newSolutions;
    });
  };

  const addSolution = () => {
    // @ts-ignore
    setSolutions(prev => [...prev, { id: Date.now(), icon: 'Briefcase', title: '', description: '', image: '', aiHint: '', keyPoints: [], createdAt: new Date(), updatedAt: new Date() }]);
  };
  const removeSolution = (index: number) => {
    setSolutions(prev => prev.filter((_, i) => i !== index));
  };

  const addKeyPoint = (solutionIndex: number) => {
    setSolutions(prev => {
        const newSolutions = [...prev];
        // @ts-ignore
        const newKeyPoints = [...(newSolutions[solutionIndex].keyPoints || []), ''];
        newSolutions[solutionIndex] = {...newSolutions[solutionIndex], keyPoints: newKeyPoints};
        return newSolutions;
    });
  };
  const removeKeyPoint = (solutionIndex: number, pointIndex: number) => {
    setSolutions(prev => {
        const newSolutions = [...prev];
        // @ts-ignore
        const newKeyPoints = newSolutions[solutionIndex].keyPoints.filter((_, i) => i !== pointIndex);
        newSolutions[solutionIndex] = {...newSolutions[solutionIndex], keyPoints: newKeyPoints};
        return newSolutions;
    });
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
        handleSolutionChange(index, 'image', publicUrl);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerState]);

  useEffect(() => {
    if (solutionsState?.message) {
      const isSuccess = solutionsState.message.includes('berhasil');
      toast({
        title: isSuccess ? 'Sukses' : 'Gagal',
        description: solutionsState.message,
        variant: isSuccess ? 'default' : 'destructive',
      });
      if (isSuccess) setIsSolutionsDirty(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionsState]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Halaman Solusi</h1>
        <p className="text-muted-foreground">Kelola konten yang tampil di halaman Solusi.</p>
      </div>

      <form action={headerFormAction} className="space-y-6 mb-6">
        <input type="hidden" name="solusiData" value={JSON.stringify(headerForm)} />
        <Card>
            <CardHeader>
                <CardTitle>Header Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="solutionsPageTitle">Judul Halaman</Label><Input id="solutionsPageTitle" value={headerForm.solutionsPageTitle} onChange={e => handleHeaderChange('solutionsPageTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="solutionsPageSubtitle">Subjudul Halaman</Label><Input id="solutionsPageSubtitle" value={headerForm.solutionsPageSubtitle} onChange={e => handleHeaderChange('solutionsPageSubtitle', e.target.value)} /></div>
                <div className="flex justify-end"><SubmitButton isDirty={isHeaderDirty} /></div>
            </CardContent>
        </Card>
      </form>
      
      <form action={solutionsFormAction} className="space-y-6">
        <input type="hidden" name="solutionsData" value={JSON.stringify(solutions)} />
        <Card>
            <CardHeader>
                <CardTitle>Daftar Solusi</CardTitle>
                <CardDescription>Kelola daftar solusi yang ditampilkan di halaman ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {solutions.map((solution, index) => (
                    <div key={solution.id} className="space-y-2 p-4 border rounded-md">
                        <div className="flex items-end gap-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                                <div className="space-y-1"><Label className="text-xs">Ikon</Label><Select value={solution.icon} onValueChange={(value) => handleSolutionChange(index, 'icon', value)}><SelectTrigger><SelectValue placeholder="Pilih ikon..." /></SelectTrigger><SelectContent>{availableIcons.map(iconName => (<SelectItem key={iconName} value={iconName}><div className="flex items-center gap-2"><DynamicIcon name={iconName} className="h-4 w-4" /><span>{iconName}</span></div></SelectItem>))}</SelectContent></Select></div>
                                <div className="space-y-1"><Label className="text-xs">Judul</Label><Input value={solution.title} onChange={e => handleSolutionChange(index, 'title', e.target.value)} /></div>
                                <div className="md:col-span-2 space-y-1"><Label className="text-xs">Deskripsi</Label><Textarea value={solution.description} onChange={e => handleSolutionChange(index, 'description', e.target.value)} /></div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSolution(index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="pl-4 ml-4 border-l space-y-2">
                            <Label className="text-xs font-semibold">Poin Kunci</Label>
                            {/* @ts-ignore */}
                            {(solution.keyPoints || []).map((point, pointIndex) => (<div key={pointIndex} className="flex items-center gap-2"><Input value={point} onChange={e => handleKeyPointChange(index, pointIndex, e.target.value)} /><Button type="button" variant="ghost" size="icon" onClick={() => removeKeyPoint(index, pointIndex)} className="text-destructive h-8 w-8"><Trash2 className="h-4 w-4" /></Button></div>))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addKeyPoint(index)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Poin</Button>
                        </div>
                        <div className="pt-2">
                            <Label className="text-xs">Gambar</Label>
                            <div className="relative w-full h-32 rounded-md bg-muted overflow-hidden border">
                                {solution.image ? ( <Image src={solution.image} alt={solution.title} fill className="object-cover" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <Input type="file" onChange={(e) => handleImageUpload(e, index)} accept="image/png, image/jpeg, image/webp" disabled={uploadingStates[index]}/>
                              {uploadingStates[index] && <Loader2 className="h-4 w-4 animate-spin" />}
                            </div>
                        </div>
                         <div className="space-y-1">
                            <Label className="text-xs">AI Hint (u/ gambar)</Label>
                            <Input value={solution.aiHint || ''} onChange={e => handleSolutionChange(index, 'aiHint', e.target.value)} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addSolution}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Solusi</Button>
                <div className="flex justify-end pt-4">
                  <SubmitButton isDirty={isSolutionsDirty} />
                </div>
            </CardContent>
        </Card>
      </form>
    </div>
  );
}
