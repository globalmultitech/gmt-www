
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
import { Loader2, PlusCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import type { Solution } from '@prisma/client';
import { createSolution, updateSolution } from './actions';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicIcon } from '@/components/dynamic-icon';
import RichTextEditor from '@/app/admin/produk/rich-text-editor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type KeyPoint = {
    title: string;
    image?: string;
    description: string;
}

type SolusiFormProps = {
  solution?: Solution | null;
  parentSolutions: Solution[];
}

const availableIcons = [
    'Activity', 'Airplay', 'AlarmClock', 'AlertCircle', 'Archive', 'ArrowDownCircle', 'ArrowUpCircle',
    'Award', 'Banknote', 'BarChart', 'BarChart2', 'BarChart3', 'BarChart4', 'Bell', 'Briefcase',
    'Building', 'Building2', 'Calculator', 'Calendar', 'Camera', 'CheckCircle', 'CheckSquare',
    'ChevronDown', 'ChevronUp', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle', 'CloudLightning',
    'CloudRain', 'CloudSnow', 'Code', 'Code2', 'Codepen', 'Codesandbox', 'Cog', 'Compass',
    'Contact', 'Copy', 'Cpu', 'CreditCard', 'Database', 'Disc', 'Download', 'Edit', 'Edit2',
    'Edit3', 'ExternalLink', 'Eye', 'Facebook', 'File', 'FileText', 'Filter', 'Flag', 'Folder', 'Gem',
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
      {pending ? <Loader2 className="animate-spin" /> : (isEditing ? 'Simpan Perubahan' : 'Tambah Solusi')}
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

export function SolusiForm({ solution = null, parentSolutions }: SolusiFormProps) {
  const { toast } = useToast();
  const isEditing = !!solution;
  const formAction = isEditing ? updateSolution : createSolution;
  // @ts-ignore
  const [state, dispatch] = useActionState(formAction, undefined);
  
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [imageUrl, setImageUrl] = useState<string>(solution?.image ?? '');
  const [solutionTitle, setSolutionTitle] = useState(solution?.title ?? '');
  const [slug, setSlug] = useState(solution?.slug ?? '');

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

  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>(parseJsonSafe(solution?.keyPoints, [{ title: '', description: '' }]));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setSolutionTitle(newTitle);
    setSlug(generateSlug(newTitle));
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'keyPoints', index?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadKey = index !== undefined ? `${fieldName}-${index}` : fieldName;
    setIsUploading(prev => ({...prev, [uploadKey]: true}));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal mengunggah gambar");
      const { publicUrl } = await res.json();
      
       if (fieldName === 'image') {
        setImageUrl(publicUrl);
      } else if (index !== undefined) {
        handleArrayChange(setKeyPoints, index, 'image', publicUrl);
      }

    } catch (error) {
      toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setIsUploading(prev => ({...prev, [uploadKey]: false}));
      event.target.value = '';
    }
  };
  
  const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<KeyPoint[]>>, index: number, field: keyof KeyPoint, value: string) => {
    setter(prev => {
        const newArray = [...prev];
        newArray[index] = { ...newArray[index], [field]: value };
        return newArray;
    });
  };
  
  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<KeyPoint[]>>) => setter(prev => [...prev, { title: '', description: '' }]);
  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<KeyPoint[]>>, index: number) => setter(prev => prev.filter((_, i) => i !== index));

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? 'Sukses' : 'Gagal',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  const handleFormSubmit = (formData: FormData) => {
    const keyPointsToSave = keyPoints.filter(f => (f.title && f.title.trim() !== '') || (f.description && f.description.replace(/<[^>]*>?/gm, '').trim() !== ''));
    formData.set('keyPoints', JSON.stringify(keyPointsToSave));
    dispatch(formData);
  }

  const PointEditor = ({ title, points, setPoints, onUpload, onArrayChange, onAddItem, onRemoveItem }: any) => (
    <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
            <Accordion type="multiple" className="w-full space-y-2">
            {points.map((item: KeyPoint, index: number) => (
                <AccordionItem value={`point-${index}`} key={index} className="border rounded-md px-4 bg-card">
                    <div className="flex justify-between items-center">
                        <AccordionTrigger className="text-sm font-medium flex-grow py-3 text-left">
                           <span className="truncate">Poin: {item.title || `Poin Baru ${index + 1}`}</span>
                        </AccordionTrigger>
                        <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveItem(setPoints, index)} className="text-destructive h-8 w-8 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <AccordionContent>
                        <div className="border-t pt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div className="space-y-1">
                                    <Label htmlFor={`point-title-${index}`}>Judul Poin {index + 1}</Label>
                                    <Input id={`point-title-${index}`} value={item.title} onChange={(e) => onArrayChange(setPoints, index, 'title', e.target.value)} placeholder={`Judul Poin ${index + 1}`} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gambar (Opsional)</Label>
                                    <div className="relative w-full h-24 rounded-md bg-muted overflow-hidden border">
                                        {item.image ? ( <Image src={item.image} alt="Preview" fill className="object-contain p-1" /> ) : ( <div className="flex items-center justify-center h-full w-full"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div> )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Input type="file" onChange={(e: any) => onUpload(e, index)} accept="image/png, image/jpeg, image/webp" disabled={isUploading[`points-${index}`]} />
                                        {isUploading[`points-${index}`] && <Loader2 className="animate-spin" />}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label>Deskripsi Poin</Label>
                                <RichTextEditor
                                    key={`point-desc-${index}`}
                                    defaultValue={item.description}
                                    onUpdate={({ editor }) => onArrayChange(setPoints, index, 'description', editor.getHTML())}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
            <Button type="button" variant="outline" size="sm" onClick={() => onAddItem(setPoints)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Poin</Button>
        </CardContent>
    </Card>
  );

  return (
    <form action={handleFormSubmit} className="space-y-8">
        {isEditing && <input type="hidden" name="id" value={solution.id} />}
        <input type="hidden" name="image" value={imageUrl} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>Informasi utama yang akan ditampilkan di halaman solusi.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title">Judul Solusi</Label>
                            <Input id="title" name="title" required value={solutionTitle} onChange={handleTitleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" name="description" required defaultValue={solution?.description} rows={5} />
                        </div>
                    </CardContent>
                </Card>

                <PointEditor
                  title="Poin-poin Kunci"
                  points={keyPoints}
                  setPoints={setKeyPoints}
                  onUpload={(e: any, index: number) => handleFileChange(e, 'keyPoints', index)}
                  onArrayChange={handleArrayChange}
                  onAddItem={addArrayItem}
                  onRemoveItem={removeArrayItem}
                />

            </div>

            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Pengaturan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="parentId">Solusi Induk (Opsional)</Label>
                            <Select name="parentId" defaultValue={solution?.parentId?.toString() ?? 'none'}>
                                <SelectTrigger><SelectValue placeholder="Pilih solusi induk..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- Jadikan Solusi Induk --</SelectItem>
                                    {parentSolutions
                                        .filter(p => !solution || p.id !== solution.id) // Exclude self from list
                                        .map(parent => (
                                            <SelectItem key={parent.id} value={parent.id.toString()}>
                                                {parent.title}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Jadikan ini sebagai sub-solusi dari solusi lain.</p>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="slug">URL (Slug)</Label>
                            <Input id="slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="icon">Ikon</Label>
                            <Select name="icon" required defaultValue={solution?.icon}>
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
                        <CardTitle>Gambar Solusi</CardTitle>
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
                          <Input id="image-upload" type="file" onChange={(e) => handleFileChange(e, 'image')} accept="image/png, image/jpeg, image/webp" disabled={isUploading['image']}/>
                          {isUploading['image'] && <Loader2 className="animate-spin" />}
                        </div>
                        <div className="space-y-1 pt-2">
                            <Label htmlFor="aiHint">AI Hint (untuk gambar)</Label>
                            <Input id="aiHint" name="aiHint" defaultValue={solution?.aiHint ?? ''} />
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
