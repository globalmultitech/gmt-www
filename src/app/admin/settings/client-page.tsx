
'use client';

import { useActionState, useEffect, useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings, MenuItem } from '@/lib/settings';
import { updateWebSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSignedURL } from '../actions';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-48">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

// ========== Komponen Baru untuk Logika yang Lebih Bersih ==========

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

type JsonTextareaProps = {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  rows?: number;
  description?: string;
};

function JsonTextarea({ id, name, label, defaultValue, rows = 8, description }: JsonTextareaProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Textarea id={id} name={name} rows={rows} defaultValue={defaultValue} />
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
    );
}


// ========== Komponen Utama yang Ditulis Ulang ==========

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

  const [menuItems, setMenuItems] = useState<MenuItem[]>(settings.menuItems ?? []);

  const handleMenuChange = (index: number, field: 'label' | 'href', value: string) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index][field] = value;
    setMenuItems(newMenuItems);
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { label: '', href: '' }]);
  };

  const removeMenuItem = (index: number) => {
    const newMenuItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(newMenuItems);
  };

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
      toast({
        title: 'Upload Gagal',
        description: 'Gagal mengunggah gambar. Silakan coba lagi.',
        variant: 'destructive',
      });
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
    }
  }, [state, toast]);

  const getJsonString = (data: any, defaultData: any) => JSON.stringify(data ?? defaultData, null, 2);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan Website</h1>
        <p className="text-muted-foreground">Kelola semua konten dinamis yang tampil di website Anda dari sini.</p>
      </div>

      <form action={formAction}>
        {/* Hidden inputs untuk menyimpan URL gambar */}
        <input type="hidden" name="logoUrl" value={imageUrls.logoUrl} />
        <input type="hidden" name="heroImageUrl" value={imageUrls.heroImageUrl} />
        <input type="hidden" name="aboutUsImageUrl" value={imageUrls.aboutUsImageUrl} />
        <input type="hidden" name="ctaImageUrl" value={imageUrls.ctaImageUrl} />
        <input type="hidden" name="menuItems" value={JSON.stringify(menuItems)} />

        {/* Card: Informasi Umum */}
        <Card>
          <CardHeader><CardTitle>Informasi Umum & Kontak</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <ImageUploader fieldId="logo-upload" fieldName="logoUrl" label="Logo Perusahaan" imageUrl={imageUrls.logoUrl} altText="Logo Preview" isUploading={isUploading} onFileChange={handleFileChange} />
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="companyName">Nama Perusahaan</Label><Input id="companyName" name="companyName" defaultValue={settings.companyName} required /></div>
              <div className="space-y-2"><Label htmlFor="whatsappSales">Nomor WhatsApp Sales</Label><Input id="whatsappSales" name="whatsappSales" defaultValue={settings.whatsappSales} required placeholder="+6281234567890" /></div>
              <div className="space-y-2"><Label htmlFor="footerText">Teks di Footer</Label><Textarea id="footerText" name="footerText" defaultValue={settings.footerText} required /></div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Menu Navigasi */}
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Menu Navigasi</CardTitle>
                <CardDescription>Atur item yang muncul di menu navigasi utama.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {menuItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                            <div className="space-y-1">
                                <Label htmlFor={`menu-label-${index}`} className="text-xs">Label</Label>
                                <Input
                                    id={`menu-label-${index}`}
                                    value={item.label}
                                    onChange={(e) => handleMenuChange(index, 'label', e.target.value)}
                                    placeholder="Beranda"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`menu-href-${index}`} className="text-xs">Tautan (Href)</Label>
                                <Input
                                    id={`menu-href-${index}`}
                                    value={item.href}
                                    onChange={(e) => handleMenuChange(index, 'href', e.target.value)}
                                    placeholder="/"
                                />
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeMenuItem(index)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addMenuItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item Menu
                </Button>
            </CardContent>
        </Card>
        
        {/* Card: Hero Section */}
        <Card className="mt-6">
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

        {/* JSON textareas for other fields - these can be replaced with forms later */}
        <textarea name="socialMedia" defaultValue={getJsonString(settings.socialMedia, {})} className="hidden" />
        <textarea name="featureCards" defaultValue={getJsonString(settings.featureCards, [])} className="hidden" />
        <textarea name="aboutUsSubtitle" defaultValue={settings.aboutUsSubtitle ?? ''} className="hidden" />
        <textarea name="aboutUsTitle" defaultValue={settings.aboutUsTitle ?? ''} className="hidden" />
        <textarea name="aboutUsDescription" defaultValue={settings.aboutUsDescription ?? ''} className="hidden" />
        <textarea name="aboutUsChecklist" defaultValue={getJsonString(settings.aboutUsChecklist, [])} className="hidden" />
        <textarea name="servicesSubtitle" defaultValue={settings.servicesSubtitle ?? ''} className="hidden" />
        <textarea name="servicesTitle" defaultValue={settings.servicesTitle ?? ''} className="hidden" />
        <textarea name="servicesDescription" defaultValue={settings.servicesDescription ?? ''} className="hidden" />
        <textarea name="professionalServices" defaultValue={getJsonString(settings.professionalServices, [])} className="hidden" />
        <textarea name="ctaHeadline" defaultValue={settings.ctaHeadline ?? ''} className="hidden" />
        <textarea name="ctaDescription" defaultValue={settings.ctaDescription ?? ''} className="hidden" />
        <textarea name="ctaButtonText" defaultValue={settings.ctaButtonText ?? ''} className="hidden" />
        <textarea name="ctaButtonLink" defaultValue={settings.ctaButtonLink ?? ''} className="hidden" />
        <textarea name="trustedByText" defaultValue={settings.trustedByText ?? ''} className="hidden" />
        <textarea name="trustedByLogos" defaultValue={getJsonString(settings.trustedByLogos, [])} className="hidden" />
        <textarea name="testimonials" defaultValue={getJsonString(settings.testimonials, [])} className="hidden" />
        <textarea name="blogPosts" defaultValue={getJsonString(settings.blogPosts, [])} className="hidden" />

        <div className="mt-8 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
