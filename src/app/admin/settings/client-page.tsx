
'use client';

import { useActionState, useEffect, useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
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

        {/* Card: About Us Section */}
        <Card className="mt-6">
            <CardHeader><CardTitle>About Us Section</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <ImageUploader fieldId="aboutus-image-upload" fieldName="aboutUsImageUrl" label="Gambar About Us" imageUrl={imageUrls.aboutUsImageUrl} altText="About Us Preview" isUploading={isUploading} onFileChange={handleFileChange} />
                <div className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="aboutUsSubtitle">Sub-judul</Label><Input id="aboutUsSubtitle" name="aboutUsSubtitle" defaultValue={settings.aboutUsSubtitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="aboutUsTitle">Judul</Label><Input id="aboutUsTitle" name="aboutUsTitle" defaultValue={settings.aboutUsTitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="aboutUsDescription">Deskripsi</Label><Textarea id="aboutUsDescription" name="aboutUsDescription" defaultValue={settings.aboutUsDescription ?? ''} /></div>
                </div>
            </CardContent>
        </Card>

        {/* Card: CTA Section */}
        <Card className="mt-6">
            <CardHeader><CardTitle>Call-to-Action (CTA) Section</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <ImageUploader fieldId="cta-image-upload" fieldName="ctaImageUrl" label="Gambar Latar CTA" imageUrl={imageUrls.ctaImageUrl} altText="CTA Preview" isUploading={isUploading} onFileChange={handleFileChange} />
                <div className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="ctaHeadline">Judul CTA</Label><Input id="ctaHeadline" name="ctaHeadline" defaultValue={settings.ctaHeadline ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="ctaDescription">Deskripsi CTA</Label><Textarea id="ctaDescription" name="ctaDescription" defaultValue={settings.ctaDescription ?? ''} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="ctaButtonText">Teks Tombol CTA</Label><Input id="ctaButtonText" name="ctaButtonText" defaultValue={settings.ctaButtonText ?? ''} /></div>
                        <div className="space-y-2"><Label htmlFor="ctaButtonLink">Link Tombol CTA</Label><Input id="ctaButtonLink" name="ctaButtonLink" defaultValue={settings.ctaButtonLink ?? ''} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="trustedByText">Teks "Trusted By"</Label><Input id="trustedByText" name="trustedByText" defaultValue={settings.trustedByText ?? ''} /></div>
                </div>
            </CardContent>
        </Card>
        
        {/* Card: Pengaturan Lanjutan (JSON) */}
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Pengaturan Lanjutan (Format JSON)</CardTitle>
                <CardDescription>Ubah data JSON di bawah ini untuk mengatur menu, kartu fitur, layanan, testimoni, dll. Harap berhati-hati.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <JsonTextarea id="menuItems" name="menuItems" label="Menu Navigasi" defaultValue={getJsonString(settings.menuItems, [])} />
                <JsonTextarea id="featureCards" name="featureCards" label="Kartu Fitur" defaultValue={getJsonString(settings.featureCards, [])} description="Gunakan nama ikon dari lucide.dev" />
                <JsonTextarea id="aboutUsChecklist" name="aboutUsChecklist" label="Checklist About Us" defaultValue={getJsonString(settings.aboutUsChecklist, [])} />
                <JsonTextarea id="professionalServices" name="professionalServices" label="Layanan Profesional" defaultValue={getJsonString(settings.professionalServices, [])} />
                <JsonTextarea id="trustedByLogos" name="trustedByLogos" label="Logo Mitra" defaultValue={getJsonString(settings.trustedByLogos, [])} />
                <JsonTextarea id="testimonials" name="testimonials" label="Testimoni" defaultValue={getJsonString(settings.testimonials, [])} />
                <JsonTextarea id="blogPosts" name="blogPosts" label="Postingan Blog" defaultValue={getJsonString(settings.blogPosts, [])} />
                <JsonTextarea id="socialMedia" name="socialMedia" label="Link Sosial Media" defaultValue={getJsonString(settings.socialMedia, {})} />
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
