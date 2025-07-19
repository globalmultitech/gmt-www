
'use client';

import { useActionState, useEffect, useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings, MenuItem, SocialMediaLinks, TrustedByLogo, FeatureCard } from '@/lib/settings';
import { updateWebSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { DynamicIcon } from '@/components/dynamic-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

export default function SettingsClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateWebSettings, undefined);

  const [formState, setFormState] = useState(settings);
  const [uploadingStates, setUploadingStates] = useState<{[key: string]: boolean | {[key: number]: boolean}}>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formState) !== JSON.stringify(settings));
  }, [formState, settings]);

  const handleFieldChange = (field: keyof WebSettings, value: any) => {
    setFormState(prev => ({...prev, [field]: value}));
  };

  const handleArrayChange = (field: keyof WebSettings, index: number, subField: string, value: any) => {
    setFormState(prev => {
        const newArray = [...(prev[field] as any[])];
        newArray[index] = {...newArray[index], [subField]: value};
        return {...prev, [field]: newArray};
    });
  };
  
  const handleStringArrayChange = (field: keyof WebSettings, index: number, value: any) => {
     setFormState(prev => {
        const newArray = [...(prev[field] as any[])];
        newArray[index] = value;
        return {...prev, [field]: newArray};
    });
  };

  const addItemToArray = (field: keyof WebSettings, newItem: any) => {
    setFormState(prev => ({...prev, [field]: [...(prev[field] as any[]), newItem]}));
  };

  const removeItemFromArray = (field: keyof WebSettings, index: number) => {
    setFormState(prev => ({...prev, [field]: (prev[field] as any[]).filter((_, i) => i !== index)}));
  };

  const handleSocialChange = (platform: keyof SocialMediaLinks, value: string) => {
    setFormState(prev => ({...prev, socialMedia: {...prev.socialMedia, [platform]: value}}));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof WebSettings, index?: number, subField?: 'image' | 'src') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadingKey = index !== undefined ? `${fieldName}-${index}` : fieldName;
    setUploadingStates(prev => ({ ...prev, [uploadingKey]: true }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { publicUrl } = await res.json();
      
      if (index !== undefined && subField) {
        handleArrayChange(fieldName, index, subField, publicUrl);
      } else {
        handleFieldChange(fieldName, publicUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setUploadingStates(prev => ({ ...prev, [uploadingKey]: false }));
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
        <h1 className="text-3xl font-bold">Pengaturan Website</h1>
        <p className="text-muted-foreground">Kelola semua konten dinamis yang tampil di website Anda dari sini.</p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="settingsData" value={JSON.stringify(formState)} />

        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-1']}>
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Informasi Umum & Kontak</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor={'logo-upload'}>Logo Perusahaan</Label>
                                <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden border">
                                    {formState.logoUrl ? ( <Image src={formState.logoUrl} alt="Logo Preview" fill sizes="300px" className="object-cover" /> ) : ( <ImageIcon className="w-10 h-10 text-muted-foreground m-auto" /> )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input id={'logo-upload'} type="file" onChange={(e) => handleImageUpload(e, 'logoUrl')} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={!!uploadingStates['logoUrl']} />
                                    {uploadingStates['logoUrl'] && <Loader2 className="animate-spin" />}
                                </div>
                            </div>
                            <div className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="companyName">Nama Perusahaan</Label><Input id="companyName" value={formState.companyName} onChange={e => handleFieldChange('companyName', e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="whatsappSales">Nomor WhatsApp Sales</Label><Input id="whatsappSales" value={formState.whatsappSales} onChange={e => handleFieldChange('whatsappSales', e.target.value)} placeholder="+6281234567890" /></div>
                            <div className="space-y-2"><Label htmlFor="footerText">Teks di Footer</Label><Textarea id="footerText" value={formState.footerText} onChange={e => handleFieldChange('footerText', e.target.value)} /></div>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Informasi Kontak Footer</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                            <div className="md:col-span-2 space-y-1">
                                <Label htmlFor="address">Alamat</Label>
                                <Input id="address" value={formState.address ?? ''} onChange={e => handleFieldChange('address', e.target.value)} placeholder="139 Baker St, E1 7PT, London" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="contactEmail">Email Kontak</Label>
                                <Input id="contactEmail" type="email" value={formState.contactEmail ?? ''} onChange={e => handleFieldChange('contactEmail', e.target.value)} placeholder="contacts@example.com" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="contactPhone">Telepon Kontak</Label>
                                <Input id="contactPhone" value={formState.contactPhone ?? ''} onChange={e => handleFieldChange('contactPhone', e.target.value)} placeholder="(02) 123 333 444" />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <Label htmlFor="openingHours">Jam Buka</Label>
                                <Input id="openingHours" value={formState.openingHours ?? ''} onChange={e => handleFieldChange('openingHours', e.target.value)} placeholder="8am-5pm Mon - Fri" />
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Link Sosial Media</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                            {(['twitter', 'facebook', 'instagram', 'linkedin'] as const).map(platform => (
                                <div className="space-y-1" key={platform}>
                                    <Label htmlFor={`social-${platform}`} className="capitalize">{platform}</Label>
                                    <Input id={`social-${platform}`} value={formState.socialMedia?.[platform] || ''} onChange={(e) => handleSocialChange(platform, e.target.value)} placeholder={`https://www.${platform}.com/nama_akun`} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Menu Navigasi</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardHeader>
                            <CardDescription>Atur item yang muncul di menu navigasi utama.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formState.menuItems.map((item, index) => (
                                <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                                    <div className="grid grid-cols-2 gap-2 flex-grow">
                                        <div className="space-y-1">
                                            <Label htmlFor={`menu-label-${index}`} className="text-xs">Label</Label>
                                            <Input id={`menu-label-${index}`} value={item.label} onChange={(e) => handleArrayChange('menuItems', index, 'label', e.target.value)} placeholder="Beranda" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor={`menu-href-${index}`} className="text-xs">Tautan (Href)</Label>
                                            <Input id={`menu-href-${index}`} value={item.href} onChange={(e) => handleArrayChange('menuItems', index, 'href', e.target.value)} placeholder="/" />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromArray('menuItems', index)} className="text-destructive h-9 w-9">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addItemToArray('menuItems', {label: '', href: ''})}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item Menu
                            </Button>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Halaman Utama: Hero Section</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor={'hero-image-upload'}>Gambar Latar Hero</Label>
                                <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden border">
                                    {formState.heroImageUrl ? ( <Image src={formState.heroImageUrl} alt="Hero Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /> ) : ( <ImageIcon className="w-10 h-10 text-muted-foreground m-auto" /> )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input id={'hero-image-upload'} type="file" onChange={(e) => handleImageUpload(e, 'heroImageUrl')} accept="image/png, image/jpeg, image/webp" disabled={!!uploadingStates['heroImageUrl']} />
                                    {uploadingStates['heroImageUrl'] && <Loader2 className="animate-spin" />}
                                </div>
                            </div>
                            <div className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="heroHeadline">Judul Utama (Headline)</Label><Input id="heroHeadline" value={formState.heroHeadline ?? ''} onChange={e => handleFieldChange('heroHeadline', e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="heroDescription">Deskripsi</Label><Textarea id="heroDescription" value={formState.heroDescription ?? ''} onChange={e => handleFieldChange('heroDescription', e.target.value)} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="heroButton1Text">Teks Tombol 1</Label><Input id="heroButton1Text" value={formState.heroButton1Text ?? ''} onChange={e => handleFieldChange('heroButton1Text', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="heroButton1Link">Link Tombol 1</Label><Input id="heroButton1Link" value={formState.heroButton1Link ?? ''} onChange={e => handleFieldChange('heroButton1Link', e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="heroButton2Text">Teks Tombol 2</Label><Input id="heroButton2Text" value={formState.heroButton2Text ?? ''} onChange={e => handleFieldChange('heroButton2Text', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="heroButton2Link">Link Tombol 2</Label><Input id="heroButton2Link" value={formState.heroButton2Link ?? ''} onChange={e => handleFieldChange('heroButton2Link', e.target.value)} /></div>
                            </div>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Halaman Utama: Kartu Fitur</AccordionTrigger>
                <AccordionContent>
                     <Card>
                        <CardContent className="space-y-4 pt-6">
                            {formState.featureCards.map((card, index) => (
                                <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                                    <div className="grid grid-cols-3 gap-2 flex-grow">
                                        <div className="space-y-1">
                                            <Label htmlFor={`fc-icon-${index}`} className="text-xs">Ikon (Lucide)</Label>
                                            <Select value={card.icon} onValueChange={(value) => handleArrayChange('featureCards', index, 'icon', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih ikon..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableIcons.map(iconName => (
                                                        <SelectItem key={iconName} value={iconName}>
                                                            <div className="flex items-center gap-2">
                                                                <DynamicIcon name={iconName} className="h-4 w-4" />
                                                                <span>{iconName}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor={`fc-title-${index}`} className="text-xs">Judul</Label>
                                            <Input id={`fc-title-${index}`} value={card.title} onChange={(e) => handleArrayChange('featureCards', index, 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor={`fc-desc-${index}`} className="text-xs">Deskripsi</Label>
                                            <Input id={`fc-desc-${index}`} value={card.description} onChange={(e) => handleArrayChange('featureCards', index, 'description', e.target.value)} />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromArray('featureCards', index)} className="text-destructive h-9 w-9">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addItemToArray('featureCards', {icon: 'Activity', title: '', description: ''})}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kartu Fitur
                            </Button>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Halaman Utama: About Us Section</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor={'about-us-image-upload'}>Gambar About Us</Label>
                                <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden border">
                                    {formState.aboutUsImageUrl ? ( <Image src={formState.aboutUsImageUrl} alt="About Us Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /> ) : ( <ImageIcon className="w-10 h-10 text-muted-foreground m-auto" /> )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input id={'about-us-image-upload'} type="file" onChange={(e) => handleImageUpload(e, 'aboutUsImageUrl')} accept="image/png, image/jpeg, image/webp" disabled={!!uploadingStates['aboutUsImageUrl']} />
                                    {uploadingStates['aboutUsImageUrl'] && <Loader2 className="animate-spin" />}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="aboutUsSubtitle">Subjudul</Label><Input id="aboutUsSubtitle" value={formState.aboutUsSubtitle ?? ''} onChange={e => handleFieldChange('aboutUsSubtitle', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="aboutUsTitle">Judul</Label><Input id="aboutUsTitle" value={formState.aboutUsTitle ?? ''} onChange={e => handleFieldChange('aboutUsTitle', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="aboutUsDescription">Deskripsi</Label><Textarea id="aboutUsDescription" value={formState.aboutUsDescription ?? ''} onChange={e => handleFieldChange('aboutUsDescription', e.target.value)} /></div>
                                <div className="space-y-2">
                                    <Label>Checklist Items</Label>
                                    {formState.aboutUsChecklist.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input value={item} onChange={(e) => handleStringArrayChange('aboutUsChecklist', index, e.target.value)} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromArray('aboutUsChecklist', index)} className="text-destructive h-9 w-9">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => addItemToArray('aboutUsChecklist', '')}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Checklist
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Halaman Utama: CTA Section</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor={'cta-image-upload'}>Gambar CTA</Label>
                                <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden border">
                                    {formState.ctaImageUrl ? ( <Image src={formState.ctaImageUrl} alt="CTA Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /> ) : ( <ImageIcon className="w-10 h-10 text-muted-foreground m-auto" /> )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input id={'cta-image-upload'} type="file" onChange={(e) => handleImageUpload(e, 'ctaImageUrl')} accept="image/png, image/jpeg, image/webp" disabled={!!uploadingStates['ctaImageUrl']} />
                                    {uploadingStates['ctaImageUrl'] && <Loader2 className="animate-spin" />}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="ctaHeadline">Headline</Label><Input id="ctaHeadline" value={formState.ctaHeadline ?? ''} onChange={e => handleFieldChange('ctaHeadline', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="ctaDescription">Deskripsi</Label><Textarea id="ctaDescription" value={formState.ctaDescription ?? ''} onChange={e => handleFieldChange('ctaDescription', e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label htmlFor="ctaButtonText">Teks Tombol</Label><Input id="ctaButtonText" value={formState.ctaButtonText ?? ''} onChange={e => handleFieldChange('ctaButtonText', e.target.value)} /></div>
                                    <div className="space-y-2"><Label htmlFor="ctaButtonLink">Link Tombol</Label><Input id="ctaButtonLink" value={formState.ctaButtonLink ?? ''} onChange={e => handleFieldChange('ctaButtonLink', e.target.value)} /></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
                <AccordionTrigger className="text-lg font-semibold p-4 bg-muted/50 rounded-md">Halaman Utama: Logo Mitra (Trusted By)</AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardHeader>
                            <CardDescription>Kelola logo perusahaan yang ditampilkan di bagian "Trusted by".</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="trustedByText">Teks Judul</Label>
                                <Input id="trustedByText" value={formState.trustedByText ?? ''} onChange={e => handleFieldChange('trustedByText', e.target.value)} placeholder="Contoh: Trusted by the world's leading companies" />
                            </div>
                            <div className="space-y-4">
                                {formState.trustedByLogos.map((logo, index) => (
                                    <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                                        <div className="relative w-24 h-16 rounded-md bg-muted overflow-hidden border">
                                            {logo.src ? ( <Image src={logo.src} alt={logo.alt} fill sizes="96px" className="object-contain p-1" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 flex-grow">
                                            <div className="space-y-1">
                                                <Label htmlFor={`logo-file-${index}`} className="text-xs">File Gambar Logo</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input id={`logo-file-${index}`} type="file" onChange={(e) => handleImageUpload(e, 'trustedByLogos', index, 'src')} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={!!(uploadingStates['trustedByLogos'] as any)?.[index]} />
                                                    {(uploadingStates['trustedByLogos'] as any)?.[index] && <Loader2 className="animate-spin" />}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`logo-alt-${index}`} className="text-xs">Teks Alternatif (Alt)</Label>
                                                <Input id={`logo-alt-${index}`} value={logo.alt} onChange={(e) => handleArrayChange('trustedByLogos', index, 'alt', e.target.value)} placeholder="Nama Klien" />
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromArray('trustedByLogos', index)} className="text-destructive h-9 w-9">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" onClick={() => addItemToArray('trustedByLogos', {src: '', alt: ''})}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Logo
                            </Button>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

        </Accordion>

        <div className="mt-8 flex justify-end">
          <SubmitButton isDirty={isDirty}/>
        </div>
      </form>
    </div>
  );
}
