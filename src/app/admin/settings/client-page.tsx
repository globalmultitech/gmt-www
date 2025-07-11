
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-48 sticky bottom-8">
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

  // State for complex JSON fields - keep them as they were, we are only changing the UI for some
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>(settings.featureCards ?? []);
  const [aboutUsChecklist, setAboutUsChecklist] = useState<string[]>(settings.aboutUsChecklist ?? []);
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>(settings.professionalServices ?? []);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(settings.testimonials ?? []);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(settings.blogPosts ?? []);


  const handleMenuChange = (index: number, field: 'label' | 'href', value: string) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index][field] = value;
    setMenuItems(newMenuItems);
  };

  const addMenuItem = () => setMenuItems([...menuItems, { label: '', href: '' }]);
  const removeMenuItem = (index: number) => setMenuItems(menuItems.filter((_, i) => i !== index));
  
  const handleSocialChange = (platform: keyof SocialMediaLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };
  
  const handleTrustedLogoChange = (index: number, field: keyof TrustedByLogo, value: string) => {
    const newLogos = [...trustedByLogos];
    newLogos[index] = { ...newLogos[index], [field]: value };
    setTrustedByLogos(newLogos);
  }

  const addTrustedLogo = () => {
    setTrustedByLogos([...trustedByLogos, { src: '', alt: '' }]);
  }

  const removeTrustedLogo = (index: number) => {
    setTrustedByLogos(trustedByLogos.filter((_, i) => i !== index));
  }
  
  const handleLogoImageChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const checksum = await computeSHA256(file);
      const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
      
      await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      
      handleTrustedLogoChange(index, 'src', publicUrl);
    } catch (error) {
       console.error("Upload error:", error);
       toast({ title: 'Upload Gagal', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
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
        
        {/* These complex fields will be kept as hidden inputs and are not editable in this simplified UI */}
        <input type="hidden" name="featureCards" value={JSON.stringify(featureCards)} />
        <input type="hidden" name="aboutUsChecklist" value={JSON.stringify(aboutUsChecklist)} />
        <input type="hidden" name="professionalServices" value={JSON.stringify(professionalServices)} />
        <input type="hidden" name="testimonials" value={JSON.stringify(testimonials)} />
        <input type="hidden" name="blogPosts" value={JSON.stringify(blogPosts)} />


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
                            defaultValue={socialLinks[platform] || ''}
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
                                <Input id={`menu-label-${index}`} name={`menuItems[${index}][label]`} value={item.label} onChange={(e) => handleMenuChange(index, 'label', e.target.value)} placeholder="Beranda" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`menu-href-${index}`} className="text-xs">Tautan (Href)</Label>
                                <Input id={`menu-href-${index}`} name={`menuItems[${index}][href]`} value={item.href} onChange={(e) => handleMenuChange(index, 'href', e.target.value)} placeholder="/" />
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeMenuItem(index)} className="text-destructive h-9 w-9">
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

        {/* About Us Section */}
        <Card>
            <CardHeader><CardTitle>About Us Section</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                 <ImageUploader fieldId="about-us-image-upload" fieldName="aboutUsImageUrl" label="Gambar About Us" imageUrl={imageUrls.aboutUsImageUrl} altText="About Us Preview" isUploading={isUploading} onFileChange={handleFileChange} />
                <div className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="aboutUsSubtitle">Subjudul</Label><Input id="aboutUsSubtitle" name="aboutUsSubtitle" defaultValue={settings.aboutUsSubtitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="aboutUsTitle">Judul</Label><Input id="aboutUsTitle" name="aboutUsTitle" defaultValue={settings.aboutUsTitle ?? ''} /></div>
                    <div className="space-y-2"><Label htmlFor="aboutUsDescription">Deskripsi</Label><Textarea id="aboutUsDescription" name="aboutUsDescription" defaultValue={settings.aboutUsDescription ?? ''} /></div>
                </div>
            </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
            <CardHeader><CardTitle>Services Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="servicesSubtitle">Subjudul</Label><Input id="servicesSubtitle" name="servicesSubtitle" defaultValue={settings.servicesSubtitle ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="servicesTitle">Judul</Label><Input id="servicesTitle" name="servicesTitle" defaultValue={settings.servicesTitle ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="servicesDescription">Deskripsi</Label><Textarea id="servicesDescription" name="servicesDescription" defaultValue={settings.servicesDescription ?? ''} /></div>
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
                            <div className="relative w-16 h-16 rounded-md bg-muted overflow-hidden border">
                                {logo.src ? ( <Image src={logo.src} alt={logo.alt} fill className="object-contain" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                            </div>
                            <div className="grid grid-cols-1 gap-2 flex-grow">
                                <div className="space-y-1">
                                    <Label htmlFor={`logo-file-${index}`} className="text-xs">File Gambar Logo</Label>
                                    <Input id={`logo-file-${index}`} type="file" onChange={(e) => handleLogoImageChange(e, index)} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={isUploading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={`logo-alt-${index}`} className="text-xs">Teks Alternatif (Alt)</Label>
                                    <Input id={`logo-alt-${index}`} name={`trustedByLogos[${index}][alt]`} value={logo.alt} onChange={(e) => handleTrustedLogoChange(index, 'alt', e.target.value)} placeholder="Nama Klien" />
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTrustedLogo(index)} className="text-destructive h-9 w-9">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={addTrustedLogo}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Logo
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

    