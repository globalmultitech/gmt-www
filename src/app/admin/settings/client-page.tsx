'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateWebSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function SettingsClientPage({ settings }: { settings: WebSettings }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateWebSettings, undefined);
  
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(settings.logoUrl ?? '');
  const [heroImageUrl, setHeroImageUrl] = useState<string>(settings.heroImageUrl ?? '');
  const [aboutUsImageUrl, setAboutUsImageUrl] = useState<string>(settings.aboutUsImageUrl ?? '');

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const checksum = await computeSHA256(file);
      const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
      
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setter(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: 'Upload Gagal',
        description: 'Gagal mengunggah gambar. Silakan periksa pengaturan CORS di R2.',
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

  const getJsonString = (data: any, defaultData: any) => {
    const valueToConvert = data ?? defaultData;
    return JSON.stringify(valueToConvert, null, 2);
  };

  const socialMediaJSON = getJsonString(settings.socialMedia, {});
  const menuItemsJSON = getJsonString(settings.menuItems, []);
  const featureCardsJSON = getJsonString(settings.featureCards, []);
  const aboutUsChecklistJSON = getJsonString(settings.aboutUsChecklist, []);

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Pengaturan Website</h1>
            <p className="text-muted-foreground">Kelola informasi umum, hero section, menu, dan tautan yang tampil di website Anda.</p>
        </div>
      <form action={formAction}>
        <input type="hidden" name="logoUrl" value={logoUrl} />
        <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
        <input type="hidden" name="aboutUsImageUrl" value={aboutUsImageUrl} />

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Atur tampilan utama yang dilihat pengunjung saat pertama kali membuka website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="hero-image-upload">Gambar Latar Hero</Label>
                 <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden">
                    {heroImageUrl ? (
                        <Image src={heroImageUrl} alt="Hero Preview" fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                  <Input id="hero-image-upload" type="file" onChange={(e) => handleFileChange(e, setHeroImageUrl)} accept="image/png, image/jpeg, image/webp" disabled={isUploading}/>
                  {isUploading && <Loader2 className="animate-spin" />}
                </div>
            </div>
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
            <div className="space-y-2">
                <Label htmlFor="about-us-image-upload">Gambar About Us</Label>
                 <div className="relative w-full h-48 rounded-md bg-muted overflow-hidden">
                    {aboutUsImageUrl ? (
                        <Image src={aboutUsImageUrl} alt="About Us Preview" fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                  <Input id="about-us-image-upload" type="file" onChange={(e) => handleFileChange(e, setAboutUsImageUrl)} accept="image/png, image/jpeg, image/webp" disabled={isUploading}/>
                  {isUploading && <Loader2 className="animate-spin" />}
                </div>
            </div>
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
            <div className="space-y-2">
                <Label htmlFor="aboutUsChecklist">Poin Checklist (JSON)</Label>
                <Textarea id="aboutUsChecklist" name="aboutUsChecklist" rows={6} defaultValue={aboutUsChecklistJSON} placeholder='[\n  "Poin pertama",\n  "Poin kedua"\n]' />
                <p className="text-xs text-muted-foreground">Masukkan daftar poin dalam format array JSON.</p>
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
                        <Image src={logoUrl} alt="Logo Preview" width={140} height={32} className="rounded-md object-contain bg-muted p-1 h-10 w-auto" />
                    ) : (
                        <div className="h-10 w-40 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">Tidak ada logo</div>
                    )}
                     <Input id="image-upload" type="file" onChange={(e) => handleFileChange(e, setLogoUrl)} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={isUploading}/>
                     {isUploading && <Loader2 className="animate-spin" />}
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
