
'use client';

import { useState, useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2, X, Image as ImageIcon } from 'lucide-react';
import type { ProfessionalService } from '@prisma/client';
import { createProfessionalService, updateProfessionalService } from './actions';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicIcon } from '@/components/dynamic-icon';

type LayananFormProps = {
  service?: ProfessionalService | null;
}

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

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
      {pending ? <Loader2 className="animate-spin" /> : (isEditing ? 'Simpan Perubahan' : 'Tambah Layanan')}
    </Button>
  );
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function LayananForm({ service = null }: LayananFormProps) {
  const { toast } = useToast();
  const isEditing = !!service;
  const formAction = isEditing ? updateProfessionalService : createProfessionalService;
  // @ts-ignore
  const [state, dispatch] = useActionState(formAction, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(service?.imageUrl ?? '');
  const [serviceTitle, setServiceTitle] = useState(service?.title ?? '');
  const [slug, setSlug] = useState(service?.slug ?? '');

  const parseJsonSafe = (jsonString: any, fallback: any[]) => {
    if (Array.isArray(jsonString)) return jsonString;
    if (typeof jsonString !== 'string') return fallback;
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  const [details, setDetails] = useState<string[]>(parseJsonSafe(service?.details, ['']));
  const [benefits, setBenefits] = useState<string[]>(parseJsonSafe(service?.benefits, ['']));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setServiceTitle(newTitle);
    setSlug(generateSlug(newTitle));
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal mengunggah gambar");
      const { publicUrl } = await res.json();
      setImageUrl(publicUrl);
    } catch (error) {
      toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };
  
  const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => {
        const newArray = [...prev];
        newArray[index] = value;
        return newArray;
    });
  };
  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(prev => [...prev, '']);
  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => setter(prev => prev.filter((_, i) => i !== index));

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? 'Sukses' : 'Gagal',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={dispatch} className="space-y-8">
        {isEditing && <input type="hidden" name="id" value={service.id} />}
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <input type="hidden" name="details" value={JSON.stringify(details.filter(f => f.trim() !== ''))} />
        <input type="hidden" name="benefits" value={JSON.stringify(benefits.filter(f => f.trim() !== ''))} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>Informasi utama yang akan ditampilkan di halaman layanan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title">Judul Layanan</Label>
                            <Input id="title" name="title" required value={serviceTitle} onChange={handleTitleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">Deskripsi Singkat</Label>
                            <Textarea id="description" name="description" required defaultValue={service?.description} />
                        </div>
                        <div className="space-y-1">
                          <Label>Deskripsi Lengkap (HTML didukung)</Label>
                          <Textarea id="longDescription" name="longDescription" defaultValue={service?.longDescription ?? ''} rows={10}/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Poin-poin & Manfaat</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Poin-poin Detail</Label>
                          <div className="space-y-2">
                            {details.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={item} onChange={(e) => handleArrayChange(setDetails, index, e.target.value)} placeholder={`Poin ${index + 1}`} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(setDetails, index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(setDetails)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Poin</Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Manfaat/Keuntungan</Label>
                          <div className="space-y-2">
                            {benefits.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={item} onChange={(e) => handleArrayChange(setBenefits, index, e.target.value)} placeholder={`Manfaat ${index + 1}`} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(setBenefits, index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(setBenefits)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Manfaat</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Pengaturan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="slug">URL (Slug)</Label>
                            <Input id="slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="icon">Ikon</Label>
                            <Select name="icon" required defaultValue={service?.icon}>
                                <SelectTrigger><SelectValue placeholder="Pilih ikon..." /></SelectTrigger>
                                <SelectContent>
                                    {availableIcons.map(iconName => (
                                        <SelectItem key={iconName} value={iconName}>
                                            <div className="flex items-center gap-2"><DynamicIcon name={iconName} className="h-4 w-4" /><span>{iconName}</span></div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Gambar Layanan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden border">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Input id="image-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading}/>
                          {isUploading && <Loader2 className="animate-spin" />}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="flex justify-end mt-8">
            <SubmitButton isEditing={isEditing} />
        </div>
    </form>
  )
}
