
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
import RichTextEditor from '@/app/admin/produk/rich-text-editor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type DetailPoint = {
    id: number | string;
    title: string;
    image?: string;
    description: string;
}

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

// PointEditor Component - Moved outside of the main component
const PointEditor = ({ title, points, setPoints, isUploading, setIsUploading, toast }: {
  title: string;
  points: DetailPoint[];
  setPoints: React.Dispatch<React.SetStateAction<DetailPoint[]>>;
  isUploading: { [key: string]: boolean };
  setIsUploading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  toast: (options: any) => void;
}) => {
  
  const handleArrayChange = (index: number, field: keyof DetailPoint, value: string) => {
    setPoints(currentPoints => {
        const newPoints = [...currentPoints];
        newPoints[index] = { ...newPoints[index], [field]: value };
        return newPoints;
    });
  };

  const addArrayItem = () => {
    setPoints(currentPoints => [...currentPoints, { id: `new-${Date.now()}`, title: '', description: '', image: '' }]);
  };

  const removeArrayItem = (index: number) => {
    setPoints(currentPoints => currentPoints.filter((_, i) => i !== index));
  };
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadKey = `${title.toLowerCase()}-${index}`;
    setIsUploading(prev => ({...prev, [uploadKey]: true}));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal mengunggah gambar");
      const { publicUrls } = await res.json();
      
      handleArrayChange(index, 'image', publicUrls[0]);

    } catch (error) {
      toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setIsUploading(prev => ({...prev, [uploadKey]: false}));
      event.target.value = '';
    }
  };
  
  return (
  <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
          <Accordion type="multiple" className="w-full space-y-2">
          {points.map((item, index) => (
              <AccordionItem value={`point-${item.id}`} key={item.id} className="border rounded-md px-4 bg-card">
                  <div className="flex justify-between items-center">
                      <AccordionTrigger className="text-sm font-medium flex-grow py-3 text-left">
                         <span className="truncate">Poin: {item.title || `Poin Baru ${index + 1}`}</span>
                      </AccordionTrigger>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(index)} className="text-destructive h-8 w-8 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <AccordionContent>
                      <div className="border-t pt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                              <div className="space-y-1">
                                  <Label htmlFor={`point-title-${item.id}`}>Judul Poin {index + 1}</Label>
                                  <Input id={`point-title-${item.id}`} value={item.title} onChange={(e) => handleArrayChange(index, 'title', e.target.value)} placeholder={`Judul Poin ${index + 1}`} />
                              </div>
                              <div className="space-y-2">
                                  <Label>Gambar (Opsional)</Label>
                                  <div className="relative w-full h-24 rounded-md bg-muted overflow-hidden border">
                                      {item.image ? ( <Image src={item.image} alt="Preview" fill sizes="100%" className="object-contain p-1" /> ) : ( <div className="flex items-center justify-center h-full w-full"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div> )}
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <Input type="file" onChange={(e: any) => handleUpload(e, index)} accept="image/png, image/jpeg, image/webp" disabled={isUploading[`${title.toLowerCase()}-${index}`]} />
                                      {isUploading[`${title.toLowerCase()}-${index}`] && <Loader2 className="animate-spin" />}
                                  </div>
                              </div>
                          </div>
                          <div>
                              <Label>Deskripsi Poin</Label>
                              <RichTextEditor
                                  key={`point-desc-${item.id}`}
                                  defaultValue={item.description}
                                  onUpdate={({ editor }) => handleArrayChange(index, 'description', editor.getHTML())}
                              />
                          </div>
                      </div>
                  </AccordionContent>
              </AccordionItem>
          ))}
          </Accordion>
          <Button type="button" variant="outline" size="sm" onClick={addArrayItem}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Poin</Button>
      </CardContent>
  </Card>
  )};

export function LayananForm({ service = null }: LayananFormProps) {
  const { toast } = useToast();
  const isEditing = !!service;
  const formAction = isEditing ? updateProfessionalService : createProfessionalService;
  // @ts-ignore
  const [state, dispatch] = useActionState(formAction, undefined);
  
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [imageUrl, setImageUrl] = useState<string>(service?.imageUrl ?? '');
  const [serviceTitle, setServiceTitle] = useState(service?.title ?? '');
  const [slug, setSlug] = useState(service?.slug ?? '');

  const parseJsonSafe = (jsonString: any, fallback: any[]): DetailPoint[] => {
    let parsed;
    if (Array.isArray(jsonString)) {
        parsed = jsonString;
    } else if (typeof jsonString === 'string') {
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            return fallback;
        }
    } else {
        return fallback;
    }
    
    if (!Array.isArray(parsed)) return fallback;

    return parsed.map((item, index) => ({
        ...item,
        id: item.id || `item-${Date.now()}-${index}`,
    }));
  }

  const [details, setDetails] = useState<DetailPoint[]>(parseJsonSafe(service?.details, []));
  const [benefits, setBenefits] = useState<DetailPoint[]>(parseJsonSafe(service?.benefits, []));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setServiceTitle(newTitle);
    setSlug(generateSlug(newTitle));
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadKey = 'imageUrl';
    setIsUploading(prev => ({...prev, [uploadKey]: true}));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal mengunggah gambar");
      const { publicUrls } = await res.json();
      
      setImageUrl(publicUrls[0]);

    } catch (error) {
      toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setIsUploading(prev => ({...prev, [uploadKey]: false}));
      event.target.value = '';
    }
  };
  
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
    const detailsToSave = details.map(({id, ...rest}) => rest).filter(f => (f.title && f.title.trim() !== '') || (f.description && f.description.replace(/<[^>]*>?/gm, '').trim() !== ''));
    const benefitsToSave = benefits.map(({id, ...rest}) => rest).filter(f => (f.title && f.title.trim() !== '') || (f.description && f.description.replace(/<[^>]*>?/gm, '').trim() !== ''));
    
    formData.set('details', JSON.stringify(detailsToSave));
    formData.set('benefits', JSON.stringify(benefitsToSave));

    dispatch(formData);
  }

  return (
    <form action={handleFormSubmit} className="space-y-8">
        {isEditing && <input type="hidden" name="id" value={service.id} />}
        <input type="hidden" name="imageUrl" value={imageUrl} />
        
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
                          <Label>Deskripsi Halaman Lengkap</Label>
                          <RichTextEditor name="longDescription" defaultValue={service?.longDescription ?? ''} />
                        </div>
                    </CardContent>
                </Card>

                <PointEditor
                  title="Poin-poin Detail Layanan"
                  points={details}
                  setPoints={setDetails}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  toast={toast}
                />
                
                <PointEditor
                  title="Manfaat / Keuntungan"
                  points={benefits}
                  setPoints={setBenefits}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  toast={toast}
                />
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
                        <CardTitle>Gambar Utama</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden border">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="Preview" fill sizes="100%" className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Input id="image-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading['imageUrl']}/>
                          {isUploading['imageUrl'] && <Loader2 className="animate-spin" />}
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
