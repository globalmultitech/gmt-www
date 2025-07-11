
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateLayananPageSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSignedURL } from '../../actions';
import Image from 'next/image';
import { DynamicIcon } from '@/components/dynamic-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isDirty} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

export default function LayananPageClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateLayananPageSettings, undefined);

  const initialFormState = {
    servicesPageTitle: settings.servicesPageTitle ?? '',
    servicesPageSubtitle: settings.servicesPageSubtitle ?? '',
    servicesPageCommitmentTitle: settings.servicesPageCommitmentTitle ?? '',
    servicesPageCommitmentText: settings.servicesPageCommitmentText ?? '',
    servicesPageHeaderImageUrl: settings.servicesPageHeaderImageUrl ?? '',
    professionalServices: settings.professionalServices ?? [],
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
    setFormState(prev => ({...prev, [field]: value}));
  };
  
  const handleServiceChange = (index: number, field: string, value: any) => {
    setFormState(prev => {
        const newServices = [...prev.professionalServices];
        newServices[index] = {...newServices[index], [field]: value};
        return {...prev, professionalServices: newServices};
    });
  };

  const handleDetailChange = (serviceIndex: number, detailIndex: number, value: string) => {
    setFormState(prev => {
        const newServices = [...prev.professionalServices];
        const newDetails = [...newServices[serviceIndex].details];
        newDetails[detailIndex] = value;
        newServices[serviceIndex] = {...newServices[serviceIndex], details: newDetails};
        return {...prev, professionalServices: newServices};
    });
  };

  const addService = () => {
    setFormState(prev => ({...prev, professionalServices: [...prev.professionalServices, { icon: 'Activity', title: '', description: '', details: []}]}));
  };
  const removeService = (index: number) => {
    setFormState(prev => ({...prev, professionalServices: prev.professionalServices.filter((_, i) => i !== index)}));
  };

  const addDetail = (serviceIndex: number) => {
    setFormState(prev => {
        const newServices = [...prev.professionalServices];
        const newDetails = [...(newServices[serviceIndex].details || []), ''];
        newServices[serviceIndex] = {...newServices[serviceIndex], details: newDetails};
        return {...prev, professionalServices: newServices};
    });
  };
  const removeDetail = (serviceIndex: number, detailIndex: number) => {
    setFormState(prev => {
        const newServices = [...prev.professionalServices];
        const newDetails = newServices[serviceIndex].details.filter((_, i) => i !== detailIndex);
        newServices[serviceIndex] = {...newServices[serviceIndex], details: newDetails};
        return {...prev, professionalServices: newServices};
    });
  };

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const checksum = await computeSHA256(file);
      const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
      
      await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      handleFieldChange('servicesPageHeaderImageUrl', publicUrl);

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
      if (isSuccess) {
        setIsDirty(false);
      }
    }
  }, [state, toast]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Halaman Layanan</h1>
        <p className="text-muted-foreground">Kelola konten yang tampil di halaman Layanan.</p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="layananData" value={JSON.stringify(formState)} />
        
        <Card>
            <CardHeader>
                <CardTitle>Header Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="servicesPageTitle">Judul Halaman</Label><Input id="servicesPageTitle" value={formState.servicesPageTitle} onChange={e => handleFieldChange('servicesPageTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="servicesPageSubtitle">Subjudul Halaman</Label><Input id="servicesPageSubtitle" value={formState.servicesPageSubtitle} onChange={e => handleFieldChange('servicesPageSubtitle', e.target.value)} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Daftar Layanan</CardTitle>
                <CardDescription>Atur layanan yang ditampilkan di halaman ini dan halaman utama.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {formState.professionalServices.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="space-y-2 p-4 border rounded-md">
                        <div className="flex items-end gap-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                                <div className="space-y-1">
                                    <Label className="text-xs">Ikon</Label>
                                    <Select value={service.icon} onValueChange={(value) => handleServiceChange(serviceIndex, 'icon', value)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih ikon..." /></SelectTrigger>
                                        <SelectContent>{availableIcons.map(iconName => (<SelectItem key={iconName} value={iconName}><div className="flex items-center gap-2"><DynamicIcon name={iconName} className="h-4 w-4" /><span>{iconName}</span></div></SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1"><Label className="text-xs">Judul</Label><Input value={service.title} onChange={e => handleServiceChange(serviceIndex, 'title', e.target.value)} /></div>
                                <div className="space-y-1"><Label className="text-xs">Deskripsi</Label><Input value={service.description} onChange={e => handleServiceChange(serviceIndex, 'description', e.target.value)} /></div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeService(serviceIndex)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="pl-4 ml-4 border-l space-y-2">
                            <Label className="text-xs font-semibold">Detail Layanan</Label>
                            {(service.details || []).map((detail, detailIndex) => (<div key={detailIndex} className="flex items-center gap-2"><Input value={detail} onChange={e => handleDetailChange(serviceIndex, detailIndex, e.target.value)} /><Button type="button" variant="ghost" size="icon" onClick={() => removeDetail(serviceIndex, detailIndex)} className="text-destructive h-8 w-8"><Trash2 className="h-4 w-4" /></Button></div>))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addDetail(serviceIndex)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Detail</Button>
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addService}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Layanan</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Bagian Komitmen Keamanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="servicesPageCommitmentTitle">Judul Komitmen</Label><Input id="servicesPageCommitmentTitle" value={formState.servicesPageCommitmentTitle} onChange={e => handleFieldChange('servicesPageCommitmentTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="servicesPageCommitmentText">Teks Komitmen</Label><Textarea id="servicesPageCommitmentText" value={formState.servicesPageCommitmentText} onChange={e => handleFieldChange('servicesPageCommitmentText', e.target.value)} /></div>
                <div className="space-y-2">
                    <Label htmlFor="header-image-upload">Gambar Komitmen</Label>
                    <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden border">
                        {formState.servicesPageHeaderImageUrl ? (
                        <Image src={formState.servicesPageHeaderImageUrl} alt="Header Preview" fill className="object-cover" />
                        ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Input id="header-image-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading} />
                        {isUploading && <Loader2 className="animate-spin" />}
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <SubmitButton isDirty={isDirty}/>
        </div>
      </form>
    </div>
  );
}
