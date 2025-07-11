
'use client';

import { useActionState, useEffect, useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings, MenuItem, SocialMediaLinks, TrustedByLogo, FeatureCard, ProfessionalService, Testimonial, BlogPost } from '@/lib/settings';
import { updateWebSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSignedURL } from '../actions';
import Image from 'next/image';
import { DynamicIcon } from '@/components/dynamic-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// A curated list of relevant Lucide icons for business/tech contexts
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
    'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Tools', 'Trash', 'Trash2', 'TrendingDown',
    'TrendingUp', 'Truck', 'Twitch', 'Twitter', 'Type', 'Umbrella', 'Unlock', 'Upload', 'User',
    'UserCheck', 'UserPlus', 'UserX', 'Users', 'Video', 'Voicemail', 'Wallet', 'Watch',
    'Wifi', 'Wind', 'X', 'XCircle', 'Youtube', 'Zap'
].sort();


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

type ImageUrls = {
  logoUrl: string;
  heroImageUrl: string;
  aboutUsImageUrl: string;
  ctaImageUrl: string;
};

type ImageUploaderProps = {
  fieldId: string;
  fieldName: keyof ImageUrls;
  label: string;
  imageUrl: string;
  altText: string;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ImageUrls) => void;
};

function ImageUploader({ fieldId, fieldName, label, imageUrl, altText, isUploading, onFileChange }: ImageUploaderProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden border">
        {imageUrl ? (
          <Image src={imageUrl} alt={altText} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Input
          id={fieldId}
          type="file"
          onChange={(e) => onFileChange(e, fieldName)}
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          disabled={isUploading}
        />
        {isUploading && <Loader2 className="animate-spin" />}
      </div>
    </div>
  );
}

export default function SettingsClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateWebSettings, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  
  const [imageUrls, setImageUrls] = useState<ImageUrls>({
    logoUrl: settings.logoUrl ?? '',
    heroImageUrl: settings.heroImageUrl ?? '',
    aboutUsImageUrl: settings.aboutUsImageUrl ?? '',
    ctaImageUrl: settings.ctaImageUrl ?? '',
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(settings.menuItems ?? [{ label: '', href: '' }]);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLinks>(settings.socialMedia ?? {});
  const [trustedByLogos, setTrustedByLogos] = useState<TrustedByLogo[]>(settings.trustedByLogos ?? [{ src: '', alt: ''}]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>(settings.featureCards ?? []);
  const [aboutUsChecklist, setAboutUsChecklist] = useState<string[]>(settings.aboutUsChecklist ?? ['']);
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>(settings.professionalServices ?? []);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(settings.testimonials ?? []);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(settings.blogPosts ?? []);


  const handleArrayOfObjectsChange = <T,>(index: number, field: keyof T, value: string, state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => {
      const newState = [...state];
      newState[index] = { ...newState[index], [field]: value };
      setState(newState);
  };
  const addArrayOfObjectsItem = <T,>(newItem: T, state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => setState([...state, newItem]);
  const removeArrayOfObjectsItem = <T,>(index: number, state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => setState(state.filter((_, i) => i !== index));

  const handleArrayOfStringsChange = (index: number, value: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
      const newState = [...state];
      newState[index] = value;
      setState(newState);
  }
  const addArrayOfStringsItem = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => setState([...state, '']);
  const removeArrayOfStringsItem = (index: number, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => setState(state.filter((_, i) => i !== index));

  const handleSocialChange = (platform: keyof SocialMediaLinks, value: string) => setSocialLinks(prev => ({ ...prev, [platform]: value }));
  const handleServiceDetailChange = (serviceIndex: number, detailIndex: number, value: string) => {
    const newServices = [...professionalServices];
    if(!newServices[serviceIndex].details) newServices[serviceIndex].details = [];
    newServices[serviceIndex].details[detailIndex] = value;
    setProfessionalServices(newServices);
  }
  const addServiceDetail = (serviceIndex: number) => {
    const newServices = [...professionalServices];
    if(!newServices[serviceIndex].details) newServices[serviceIndex].details = [];
    newServices[serviceIndex].details.push('');
    setProfessionalServices(newServices);
  }
  const removeServiceDetail = (serviceIndex: number, detailIndex: number) => {
    const newServices = [...professionalServices];
    newServices[serviceIndex].details = newServices[serviceIndex].details.filter((_, i) => i !== detailIndex);
    setProfessionalServices(newServices);
  }

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ImageUrls) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const checksum = await computeSHA256(file);
      const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
      
      await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      setImageUrls(prev => ({ ...prev, [fieldName]: publicUrl }));

    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
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
        <h1 className="text-3xl font-bold">Pengaturan Website</h1>
        <p className="text-muted-foreground">Kelola semua konten dinamis yang tampil di website Anda dari sini.</p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Hidden inputs to store image URLs */}
        <input type="hidden" name="logoUrl" value={imageUrls.logoUrl} />
        <input type="hidden" name="heroImageUrl" value={imageUrls.heroImageUrl} />
        <input type="hidden" name="aboutUsImageUrl" value={imageUrls.aboutUsImageUrl} />
        <input type="hidden" name="ctaImageUrl" value={imageUrls.ctaImageUrl} />

        {/* Card: Informasi Umum */}
        <Card>
          <CardHeader><CardTitle>Informasi Umum & Kontak</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <ImageUploader fieldId="logo-upload" fieldName="logoUrl" label="Logo Perusahaan" imageUrl={imageUrls.logoUrl} altText="Logo Preview" isUploading={isUploading} onFileChange={handleFileChange} />
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="companyName">Nama Perusahaan</Label><Input id="companyName" name="companyName" defaultValue={settings.companyName} /></div>
              <div className="space-y-2"><Label htmlFor="whatsappSales">Nomor WhatsApp Sales</Label><Input id="whatsappSales" name="whatsappSales" defaultValue={settings.whatsappSales} placeholder="+6281234567890" /></div>
              <div className="space-y-2"><Label htmlFor="footerText">Teks di Footer</Label><Textarea id="footerText" name="footerText" defaultValue={settings.footerText} /></div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Informasi Kontak Footer */}
        <Card>
            <CardHeader><CardTitle>Informasi Kontak Footer</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="address">Alamat</Label>
                    <Input id="address" name="address" defaultValue={settings.address ?? ''} placeholder="139 Baker St, E1 7PT, London" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="contactEmail">Email Kontak</Label>
                    <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settings.contactEmail ?? ''} placeholder="contacts@example.com" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="contactPhone">Telepon Kontak</Label>
                    <Input id="contactPhone" name="contactPhone" defaultValue={settings.contactPhone ?? ''} placeholder="(02) 123 333 444" />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="openingHours">Jam Buka</Label>
                    <Input id="openingHours" name="openingHours" defaultValue={settings.openingHours ?? ''} placeholder="8am-5pm Mon - Fri" />
                </div>
            </CardContent>
        </Card>
        
        {/* Social Media Links */}
        <Card>
            <CardHeader><CardTitle>Link Sosial Media</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['twitter', 'facebook', 'instagram', 'linkedin'] as const).map(platform => (
                    <div className="space-y-1" key={platform}>
                        <Label htmlFor={`social-${platform}`} className="capitalize">{platform}</Label>
                        <Input
                            id={`social-${platform}`}
                            name={`socialMedia[${platform}]`}
                            value={socialLinks[platform] || ''}
                            onChange={(e) => handleSocialChange(platform, e.target.value)}
                            placeholder={`https://${platform}.com/nama_akun`}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>

        {/* Card: Menu Navigasi */}
        <Card>
            <CardHeader>
                <CardTitle>Menu Navigasi</CardTitle>
                <CardDescription>Atur item yang muncul di menu navigasi utama.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {menuItems.map((item, index) => (
                    <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                            <div className="space-y-1">
                                <Label htmlFor={`menu-label-${index}`} className="text-xs">Label</Label>
                                <Input id={`menu-label-${index}`} name={`menuItems[${index}][label]`} value={item.label} onChange={(e) => handleArrayOfObjectsChange(index, 'label', e.target.value, menuItems, setMenuItems)} placeholder="Beranda" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`menu-href-${index}`} className="text-xs">Tautan (Href)</Label>
                                <Input id={`menu-href-${index}`} name={`menuItems[${index}][href]`} value={item.href} onChange={(e) => handleArrayOfObjectsChange(index, 'href', e.target.value, menuItems, setMenuItems)} placeholder="/" />
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, menuItems, setMenuItems)} className="text-destructive h-9 w-9">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({label: '', href: ''}, menuItems, setMenuItems)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item Menu
                </Button>
            </CardContent>
        </Card>
        
        {/* Card: Hero Section */}
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle><CardDescription>Atur tampilan utama di halaman depan.</CardDescription></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <ImageUploader fieldId="hero-image-upload" fieldName="heroImageUrl" label="Gambar Latar Hero" imageUrl={imageUrls.heroImageUrl} altText="Hero Preview" isUploading={isUploading} onFileChange={handleFileChange} />
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="heroHeadline">Judul Utama (Headline)</Label><Input id="heroHeadline" name="heroHeadline" defaultValue={settings.heroHeadline ?? ''} /></div>
              <div className="space-y-2"><Label htmlFor="heroDescription">Deskripsi</Label><Textarea id="heroDescription" name="heroDescription" defaultValue={settings.heroDescription ?? ''} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="heroButton1Text">Teks Tombol 1</Label><Input id="heroButton1Text" name="heroButton1Text" defaultValue={settings.heroButton1Text ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="heroButton1Link">Link Tombol 1</Label><Input id="heroButton1Link" name="heroButton1Link" defaultValue={settings.heroButton1Link ?? ''} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="heroButton2Text">Teks Tombol 2</Label><Input id="heroButton2Text" name="heroButton2Text" defaultValue={settings.heroButton2Text ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="heroButton2Link">Link Tombol 2</Label><Input id="heroButton2Link" name="heroButton2Link" defaultValue={settings.heroButton2Link ?? ''} /></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Section */}
        <Card>
            <CardHeader><CardTitle>Kartu Fitur</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {featureCards.map((card, index) => (
                    <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                        <div className="grid grid-cols-3 gap-2 flex-grow">
                             <div className="space-y-1">
                                <Label htmlFor={`fc-icon-${index}`} className="text-xs">Ikon (Lucide)</Label>
                                <Select
                                    name={`featureCards[${index}][icon]`}
                                    value={card.icon}
                                    onValueChange={(value) => handleArrayOfObjectsChange(index, 'icon', value, featureCards, setFeatureCards)}
                                >
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
                                <Input id={`fc-title-${index}`} name={`featureCards[${index}][title]`} value={card.title} onChange={(e) => handleArrayOfObjectsChange(index, 'title', e.target.value, featureCards, setFeatureCards)} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`fc-desc-${index}`} className="text-xs">Deskripsi</Label>
                                <Input id={`fc-desc-${index}`} name={`featureCards[${index}][description]`} value={card.description} onChange={(e) => handleArrayOfObjectsChange(index, 'description', e.target.value, featureCards, setFeatureCards)} />
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, featureCards, setFeatureCards)} className="text-destructive h-9 w-9">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({icon: 'Activity', title: '', description: ''}, featureCards, setFeatureCards)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kartu Fitur
                </Button>
            </CardContent>
        </Card>

        {/* About Us Section */}
        <Card>
            <CardHeader><CardTitle>About Us Section</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                 <ImageUploader fieldId="about-us-image-upload" fieldName="aboutUsImageUrl" label="Gambar About Us" imageUrl={imageUrls.aboutUsImageUrl} altText="About Us Preview" isUploading={isUploading} onFileChange={handleFileChange} />
                <div className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="aboutUsSubtitle">Subjudul</Label><Input id="aboutUsSubtitle" name="aboutUsSubtitle" defaultValue={settings.aboutUsSubtitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="aboutUsTitle">Judul</Label><Input id="aboutUsTitle" name="aboutUsTitle" defaultValue={settings.aboutUsTitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="aboutUsDescription">Deskripsi</Label><Textarea id="aboutUsDescription" name="aboutUsDescription" defaultValue={settings.aboutUsDescription ?? ''} /></div>
                    <div className="space-y-2">
                        <Label>Checklist Items</Label>
                        {aboutUsChecklist.map((item, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <Input name={`aboutUsChecklist[${index}]`} value={item} onChange={(e) => handleArrayOfStringsChange(index, e.target.value, aboutUsChecklist, setAboutUsChecklist)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfStringsItem(index, aboutUsChecklist, setAboutUsChecklist)} className="text-destructive h-9 w-9">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayOfStringsItem(aboutUsChecklist, setAboutUsChecklist)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Checklist
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
            <CardHeader><CardTitle>Services Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label htmlFor="servicesSubtitle">Subjudul</Label><Input id="servicesSubtitle" name="servicesSubtitle" defaultValue={settings.servicesSubtitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="servicesTitle">Judul</Label><Input id="servicesTitle" name="servicesTitle" defaultValue={settings.servicesTitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="servicesDescription">Deskripsi</Label><Input id="servicesDescription" name="servicesDescription" defaultValue={settings.servicesDescription ?? ''} /></div>
                </div>
                <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Layanan Profesional</h3>
                    {professionalServices.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="space-y-2 p-4 border rounded-md mb-4">
                             <div className="flex items-end gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Ikon</Label>
                                         <Select
                                            name={`professionalServices[${serviceIndex}][icon]`}
                                            value={service.icon}
                                            onValueChange={(value) => handleArrayOfObjectsChange(serviceIndex, 'icon', value, professionalServices, setProfessionalServices)}
                                        >
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
                                        <Label className="text-xs">Judul</Label>
                                        <Input name={`professionalServices[${serviceIndex}][title]`} value={service.title} onChange={e => handleArrayOfObjectsChange(serviceIndex, 'title', e.target.value, professionalServices, setProfessionalServices)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Deskripsi</Label>
                                        <Input name={`professionalServices[${serviceIndex}][description]`} value={service.description} onChange={e => handleArrayOfObjectsChange(serviceIndex, 'description', e.target.value, professionalServices, setProfessionalServices)} />
                                    </div>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(serviceIndex, professionalServices, setProfessionalServices)} className="text-destructive h-9 w-9">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="pl-4 ml-4 border-l space-y-2">
                                <Label className="text-xs font-semibold">Detail Layanan</Label>
                                {(service.details || []).map((detail, detailIndex) => (
                                    <div key={detailIndex} className="flex items-center gap-2">
                                        <Input name={`professionalServices[${serviceIndex}][details][${detailIndex}]`} value={detail} onChange={e => handleServiceDetailChange(serviceIndex, detailIndex, e.target.value)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeServiceDetail(serviceIndex, detailIndex)} className="text-destructive h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                 <Button type="button" variant="outline" size="sm" onClick={() => addServiceDetail(serviceIndex)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Detail
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({ icon: 'Activity', title: '', description: '', details: []}, professionalServices, setProfessionalServices)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Layanan
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
            <CardHeader><CardTitle>CTA Section</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <ImageUploader fieldId="cta-image-upload" fieldName="ctaImageUrl" label="Gambar CTA" imageUrl={imageUrls.ctaImageUrl} altText="CTA Preview" isUploading={isUploading} onFileChange={handleFileChange} />
                <div className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="ctaHeadline">Headline</Label><Input id="ctaHeadline" name="ctaHeadline" defaultValue={settings.ctaHeadline ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="ctaDescription">Deskripsi</Label><Textarea id="ctaDescription" name="ctaDescription" defaultValue={settings.ctaDescription ?? ''} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="ctaButtonText">Teks Tombol</Label><Input id="ctaButtonText" name="ctaButtonText" defaultValue={settings.ctaButtonText ?? ''} /></div>
                        <div className="space-y-2"><Label htmlFor="ctaButtonLink">Link Tombol</Label><Input id="ctaButtonLink" name="ctaButtonLink" defaultValue={settings.ctaButtonLink ?? ''} /></div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Trusted By Section */}
         <Card>
            <CardHeader>
                <CardTitle>Logo Mitra (Trusted By)</CardTitle>
                <CardDescription>Kelola logo perusahaan yang ditampilkan di bagian "Trusted by".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="trustedByText">Teks Judul</Label>
                    <Input id="trustedByText" name="trustedByText" defaultValue={settings.trustedByText ?? ''} placeholder="Contoh: Trusted by the world's leading companies" />
                </div>
                <div className="space-y-4">
                    {trustedByLogos.map((logo, index) => (
                        <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                            <input type="hidden" name={`trustedByLogos[${index}][src]`} value={logo.src} />
                            <div className="relative w-24 h-16 rounded-md bg-muted overflow-hidden border">
                                {logo.src ? ( <Image src={logo.src} alt={logo.alt} fill className="object-contain p-1" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                            </div>
                            <div className="grid grid-cols-1 gap-2 flex-grow">
                                <div className="space-y-1">
                                    <Label htmlFor={`logo-file-${index}`} className="text-xs">File Gambar Logo</Label>
                                    <Input id={`logo-file-${index}`} type="file" onChange={(e) => handleDynamicImageUpload(e, index, 'src', trustedByLogos, setTrustedByLogos)} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={isUploading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={`logo-alt-${index}`} className="text-xs">Teks Alternatif (Alt)</Label>
                                    <Input id={`logo-alt-${index}`} name={`trustedByLogos[${index}][alt]`} value={logo.alt} onChange={(e) => handleArrayOfObjectsChange(index, 'alt', e.target.value, trustedByLogos, setTrustedByLogos)} placeholder="Nama Klien" />
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, trustedByLogos, setTrustedByLogos)} className="text-destructive h-9 w-9">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({src: '', alt: ''}, trustedByLogos, setTrustedByLogos)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Logo
                </Button>
            </CardContent>
        </Card>
        
        {/* Testimonials */}
        <Card>
            <CardHeader><CardTitle>Testimonial</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {testimonials.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                        <input type="hidden" name={`testimonials[${index}][image]`} value={item.image} />
                        <div className="flex-shrink-0 space-y-2">
                             <div className="relative w-24 h-24 rounded-md bg-muted overflow-hidden border">
                                {item.image ? ( <Image src={item.image} alt={item.name} fill className="object-cover" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                            </div>
                            <Input type="file" onChange={(e) => handleDynamicImageUpload(e, index, 'image', testimonials, setTestimonials)} accept="image/png, image/jpeg" disabled={isUploading} className="w-24"/>
                        </div>
                        <div className="flex-grow space-y-2">
                           <div className="space-y-1">
                                <Label className="text-xs">Kutipan</Label>
                                <Textarea name={`testimonials[${index}][quote]`} value={item.quote} onChange={e => handleArrayOfObjectsChange(index, 'quote', e.target.value, testimonials, setTestimonials)} />
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                    <Label className="text-xs">Nama</Label>
                                    <Input name={`testimonials[${index}][name]`} value={item.name} onChange={e => handleArrayOfObjectsChange(index, 'name', e.target.value, testimonials, setTestimonials)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Jabatan</Label>
                                    <Input name={`testimonials[${index}][role]`} value={item.role} onChange={e => handleArrayOfObjectsChange(index, 'role', e.target.value, testimonials, setTestimonials)} />
                                </div>
                           </div>
                           <div className="space-y-1">
                                <Label className="text-xs">AI Hint (untuk gambar)</Label>
                                <Input name={`testimonials[${index}][aiHint]`} value={item.aiHint || ''} onChange={e => handleArrayOfObjectsChange(index, 'aiHint', e.target.value, testimonials, setTestimonials)} />
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, testimonials, setTestimonials)} className="text-destructive h-9 w-9">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({ quote: '', name: '', role: '', image: '', aiHint: ''}, testimonials, setTestimonials)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Testimonial
                </Button>
            </CardContent>
        </Card>
        
        {/* Blog Posts */}
        <Card>
            <CardHeader><CardTitle>Postingan Blog</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 {blogPosts.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                        <input type="hidden" name={`blogPosts[${index}][image]`} value={item.image} />
                        <div className="flex-shrink-0 space-y-2">
                             <div className="relative w-40 h-24 rounded-md bg-muted overflow-hidden border">
                                {item.image ? ( <Image src={item.image} alt={item.title} fill className="object-cover" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                            </div>
                            <Input type="file" onChange={(e) => handleDynamicImageUpload(e, index, 'image', blogPosts, setBlogPosts)} accept="image/png, image/jpeg" disabled={isUploading} className="w-40"/>
                        </div>
                        <div className="flex-grow space-y-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Judul</Label>
                                <Input name={`blogPosts[${index}][title]`} value={item.title} onChange={e => handleArrayOfObjectsChange(index, 'title', e.target.value, blogPosts, setBlogPosts)} />
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                    <Label className="text-xs">Tanggal</Label>
                                    <Input name={`blogPosts[${index}][date]`} value={item.date} onChange={e => handleArrayOfObjectsChange(index, 'date', e.target.value, blogPosts, setBlogPosts)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Penulis</Label>
                                    <Input name={`blogPosts[${index}][author]`} value={item.author} onChange={e => handleArrayOfObjectsChange(index, 'author', e.target.value, blogPosts, setBlogPosts)} />
                                </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                    <Label className="text-xs">Tautan (Href)</Label>
                                    <Input name={`blogPosts[${index}][href]`} value={item.href} onChange={e => handleArrayOfObjectsChange(index, 'href', e.target.value, blogPosts, setBlogPosts)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">AI Hint (untuk gambar)</Label>
                                    <Input name={`blogPosts[${index}][aiHint]`} value={item.aiHint} onChange={e => handleArrayOfObjectsChange(index, 'aiHint', e.target.value, blogPosts, setBlogPosts)} />
                                </div>
                           </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayOfObjectsItem(index, blogPosts, setBlogPosts)} className="text-destructive h-9 w-9">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                 ))}
                 <Button type="button" variant="outline" onClick={() => addArrayOfObjectsItem({ image: '', aiHint: '', date: '', author: 'Admin', title: '', href: '/resources' }, blogPosts, setBlogPosts)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Postingan Blog
                </Button>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
