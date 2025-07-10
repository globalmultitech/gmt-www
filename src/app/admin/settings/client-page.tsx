
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
    <Button type="submit" disabled={pending}>
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
  accept?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  placeholder?: ReactNode;
};

function ImageUploader({
  fieldId,
  fieldName,
  label,
  imageUrl,
  altText,
  isUploading,
  onFileChange,
  accept = "image/png, image/jpeg, image/webp",
  imageContainerClassName = "relative w-full h-48 rounded-md bg-muted overflow-hidden",
  imageClassName = "object-cover",
  placeholder = <ImageIcon className="w-10 h-10 text-muted-foreground" />,
}: ImageUploaderProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className={imageContainerClassName}>
        {imageUrl ? (
          <Image src={imageUrl} alt={altText} fill className={imageClassName} />
        ) : (
          <div className="flex items-center justify-center h-full w-full">{placeholder}</div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Input
          id={fieldId}
          type="file"
          onChange={(e) => onFileChange(e, fieldName)}
          accept={accept}
          disabled={isUploading}
        />
        {isUploading && <Loader2 className="animate-spin" />}
      </div>
    </div>
  );
}

type JsonTextareaProps = {
  fieldId: string;
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
  description: ReactNode;
  placeholder?: string;
};

function JsonTextarea({ fieldId, name, label, defaultValue, rows, description, placeholder }: JsonTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Textarea id={fieldId} name={name} rows={rows} defaultValue={defaultValue} placeholder={placeholder} />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default function SettingsClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateWebSettings, undefined);
  
  const [isUploading, setIsUploading] = useState<keyof ImageUrls | null>(null);
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
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ImageUrls) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(fieldName);
    try {
      const checksum = await computeSHA256(file);
      const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
      
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setImageUrls(prev => ({ ...prev, [fieldName]: publicUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: 'Upload Gagal',
        description: 'Gagal mengunggah gambar. Silakan periksa pengaturan CORS di R2.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(null);
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

  const jsonDefaults = {
    socialMedia: {},
    menuItems: [],
    featureCards: [],
    aboutUsChecklist: [],
    professionalServices: [],
    trustedByLogos: [],
    testimonials: [],
    blogPosts: [],
  };

  const jsonSettings = (Object.keys(jsonDefaults) as Array<keyof typeof jsonDefaults>).reduce((acc, key) => {
    const value = settings[key as keyof WebSettings] ?? jsonDefaults[key];
    acc[key] = JSON.stringify(value, null, 2);
    return acc;
  }, {} as Record<keyof typeof jsonDefaults, string>);

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Pengaturan Website</h1>
            <p className="text-muted-foreground">Kelola informasi umum, hero section, menu, dan tautan yang tampil di website Anda.</p>
        </div>
        <form action={formAction}>
            {Object.entries(imageUrls).map(([key, value]) => (
                <input type="hidden" name={key} value={value} key={key} />
            ))}

            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>Atur tampilan utama yang dilihat pengunjung saat pertama kali membuka website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ImageUploader
                        fieldId="hero-image-upload"
                        fieldName="heroImageUrl"
                        label="Gambar Latar Hero"
                        imageUrl={imageUrls.heroImageUrl}
                        altText="Hero Preview"
                        isUploading={isUploading === 'heroImageUrl'}
                        onFileChange={handleFileChange}
                    />
                    <div className="space-y-2">
                        <Label htmlFor="heroHeadline">Judul Utama (Headline)</Label>
                        <Input id="heroHeadline" name="heroHeadline" defaultValue={settings.heroHeadline ?? ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroDescription">Deskripsi</Label>
                        <Textarea id="heroDescription" name="heroDescription" defaultValue={settings.heroDescription ?? ''} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="heroButton1Text">Teks Tombol 1</Label>
                            <Input id="heroButton1Text" name="heroButton1Text" defaultValue={settings.heroButton1Text ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="heroButton1Link">Link Tombol 1</Label>
                            <Input id="heroButton1Link" name="heroButton1Link" defaultValue={settings.heroButton1Link ?? ''} placeholder="/layanan"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="heroButton2Text">Teks Tombol 2</Label>
                            <Input id="heroButton2Text" name="heroButton2Text" defaultValue={settings.heroButton2Text ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="heroButton2Link">Link Tombol 2</Label>
                            <Input id="heroButton2Link" name="heroButton2Link" defaultValue={settings.heroButton2Link ?? ''} placeholder="/hubungi-kami"/>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>About Us Section</CardTitle>
                    <CardDescription>Atur konten untuk bagian "About Us" di halaman utama.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ImageUploader
                        fieldId="about-us-image-upload"
                        fieldName="aboutUsImageUrl"
                        label="Gambar About Us"
                        imageUrl={imageUrls.aboutUsImageUrl}
                        altText="About Us Preview"
                        isUploading={isUploading === 'aboutUsImageUrl'}
                        onFileChange={handleFileChange}
                    />
                    <div className="space-y-2">
                        <Label htmlFor="aboutUsSubtitle">Sub-judul</Label>
                        <Input id="aboutUsSubtitle" name="aboutUsSubtitle" defaultValue={settings.aboutUsSubtitle ?? ''} placeholder="ABOUT US" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aboutUsTitle">Judul</Label>
                        <Input id="aboutUsTitle" name="aboutUsTitle" defaultValue={settings.aboutUsTitle ?? ''} placeholder="We are the best IT solution"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aboutUsDescription">Deskripsi</Label>
                        <Textarea id="aboutUsDescription" name="aboutUsDescription" defaultValue={settings.aboutUsDescription ?? ''} />
                    </div>
                    <JsonTextarea
                        fieldId="aboutUsChecklist"
                        name="aboutUsChecklist"
                        label="Poin Checklist (JSON)"
                        defaultValue={jsonSettings.aboutUsChecklist}
                        rows={6}
                        placeholder={'[\n  "Poin pertama",\n  "Poin kedua"\n]'}
                        description="Masukkan daftar poin dalam format array JSON."
                    />
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Services Section</CardTitle>
                    <CardDescription>Atur konten untuk bagian layanan di halaman utama.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="servicesSubtitle">Sub-judul Layanan</Label>
                        <Input id="servicesSubtitle" name="servicesSubtitle" defaultValue={settings.servicesSubtitle ?? ''} placeholder="WHAT WE DO" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="servicesTitle">Judul Layanan</Label>
                        <Input id="servicesTitle" name="servicesTitle" defaultValue={settings.servicesTitle ?? ''} placeholder="Layanan Profesional Kami"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="servicesDescription">Deskripsi Layanan</Label>
                        <Textarea id="servicesDescription" name="servicesDescription" defaultValue={settings.servicesDescription ?? ''} />
                    </div>
                    <JsonTextarea
                        fieldId="professionalServices"
                        name="professionalServices"
                        label
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>CTA & Trusted By Section</CardTitle>
                    <CardDescription>Atur konten untuk bagian Call-to-Action di halaman utama.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="cta-image-upload">Gambar Latar CTA</Label>
                        <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden">
                            {ctaImageUrl ? (
                                <Image src={ctaImageUrl} alt="CTA Preview" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <Input id="cta-image-upload" type="file" onChange={(e) => handleFileChange(e, 'cta', setCtaImageUrl)} accept="image/png, image/jpeg, image/webp" disabled={isUploading === 'cta'}/>
                            {isUploading === 'cta' && <Loader2 className="animate-spin" />}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ctaHeadline">Judul CTA</Label>
                        <Input id="ctaHeadline" name="ctaHeadline" defaultValue={settings.ctaHeadline ?? ''} placeholder="Ready to take your business to the next level?" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ctaDescription">Deskripsi CTA</Label>
                        <Textarea id="ctaDescription" name="ctaDescription" defaultValue={settings.ctaDescription ?? ''} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ctaButtonText">Teks Tombol CTA</Label>
                            <Input id="ctaButtonText" name="ctaButtonText" defaultValue={settings.ctaButtonText ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ctaButtonLink">Link Tombol CTA</Label>
                            <Input id="ctaButtonLink" name="ctaButtonLink" defaultValue={settings.ctaButtonLink ?? ''} placeholder="/hubungi-kami"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trustedByText">Teks "Trusted By"</Label>
                        <Input id="trustedByText" name="trustedByText" defaultValue={settings.trustedByText ?? ''} placeholder="Trusted by the world's leading companies"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trustedByLogos">Logo Mitra (JSON)</Label>
                        <Textarea id="trustedByLogos" name="trustedByLogos" rows={8} defaultValue={trustedByLogosJSON} />
                        <p className="text-xs text-muted-foreground">Masukkan daftar logo dalam format array JSON. Contoh: `[{"src": "/url/logo.svg", "alt": "Nama Logo"}]`</p>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Testimonials Section</CardTitle>
                    <CardDescription>Atur konten untuk bagian testimoni di halaman utama.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="testimonials">Konten Testimoni (JSON)</Label>
                        <Textarea id="testimonials" name="testimonials" rows={12} defaultValue={testimonialsJSON} />
                        <p className="text-xs text-muted-foreground">Masukkan daftar testimoni dalam format array JSON.</p>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Blog Section</CardTitle>
                    <CardDescription>Atur konten untuk bagian blog di halaman utama.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="blogPosts">Konten Postingan Blog (JSON)</Label>
                        <Textarea id="blogPosts" name="blogPosts" rows={12} defaultValue={blogPostsJSON} />
                        <p className="text-xs text-muted-foreground">Masukkan daftar postingan blog dalam format array JSON.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Informasi Umum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="image-upload">Logo Perusahaan</Label>
                        <div className="flex items-center gap-4">
                            {logoUrl ? (
                                <Image src={logoUrl} alt={`Logo ${settings.companyName}`} width={140} height={32} className="rounded-md object-contain bg-muted p-1 h-10 w-auto" />
                            ) : (
                                <div className="h-10 w-40 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">Tidak ada logo</div>
                            )}
                            <Input id="image-upload" type="file" onChange={(e) => handleFileChange(e, 'logo', setLogoUrl)} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={isUploading === 'logo'}/>
                            {isUploading === 'logo' && <Loader2 className="animate-spin" />}
                        </div>
                        <p className="text-xs text-muted-foreground">Unggah logo perusahaan Anda. Format yang didukung: PNG, JPG, WEBP, SVG.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Nama Perusahaan</Label>
                        <Input id="companyName" name="companyName" defaultValue={settings.companyName} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsappSales">Nomor WhatsApp Sales</Label>
                        <Input id="whatsappSales" name="whatsappSales" defaultValue={settings.whatsappSales} required />
                        <p className="text-xs text-muted-foreground">Gunakan format internasional, contoh: +6281234567890</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="footerText">Teks di Footer</Label>
                        <Textarea id="footerText" name="footerText" defaultValue={settings.footerText} required />
                    </div>
                </CardContent>
            </Card>
            
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Pengaturan Lanjutan</CardTitle>
                    <CardDescription>Ubah pengaturan ini hanya jika Anda mengerti format JSON. Kesalahan format dapat menyebabkan halaman error.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="featureCards">Kartu Fitur (JSON)</Label>
                        <Textarea id="featureCards" name="featureCards" rows={12} defaultValue={featureCardsJSON} />
                        <p className="text-xs text-muted-foreground">Gunakan nama ikon dari <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a>.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="socialMedia">Link Sosial Media (JSON)</Label>
                        <Textarea id="socialMedia" name="socialMedia" rows={8} defaultValue={socialMediaJSON} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="menuItems">Menu Navigasi (JSON)</Label>
                        <Textarea id="menuItems" name="menuItems" rows={12} defaultValue={menuItemsJSON} />
                    </div>
                </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-end">
                <SubmitButton />
            </div>
        </form>
    </div>
  );
}
