
'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
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

  const [menuItems, setMenuItems] = useState<MenuItem[]>(settings.menuItems || []);

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
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const checksum = await computeSHA256(file);
      const { signedUrl, publicUrl } = await getSignedURL(file.type, file.size, checksum);
      
      await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      setLogoUrl(publicUrl);

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
  
  // Prepare a hidden input for the form
  const menuItemsJSON = JSON.stringify(menuItems);

  // Keep other JSON fields for now, but we can replace them later.
  const getJsonString = (data: any, defaultData: any) => JSON.stringify(data ?? defaultData, null, 2);
  const socialMediaJSON = getJsonString(settings.socialMedia, {});
  const featureCardsJSON = getJsonString(settings.featureCards, []);
  const aboutUsChecklistJSON = getJsonString(settings.aboutUsChecklist, []);
  const professionalServicesJSON = getJsonString(settings.professionalServices, []);
  const trustedByLogosJSON = getJsonString(settings.trustedByLogos, []);
  const testimonialsJSON = getJsonString(settings.testimonials, []);
  const blogPostsJSON = getJsonString(settings.blogPosts, []);


  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Pengaturan Website</h1>
            <p className="text-muted-foreground">Kelola semua konten dinamis yang tampil di website Anda dari sini.</p>
        </div>

        <form action={formAction}>
            <input type="hidden" name="logoUrl" value={logoUrl} />
            <input type="hidden" name="menuItems" value={menuItemsJSON} />
            {/* These are kept for now to avoid breaking the form submission */}
            <input type="hidden" name="heroImageUrl" value={settings.heroImageUrl || ''} />
            <input type="hidden" name="aboutUsImageUrl" value={settings.aboutUsImageUrl || ''} />
            <input type="hidden" name="ctaImageUrl" value={settings.ctaImageUrl || ''} />
            <input type="hidden" name="heroHeadline" value={settings.heroHeadline || ''} />
            <input type="hidden" name="heroDescription" value={settings.heroDescription || ''} />
            <input type="hidden" name="heroButton1Text" value={settings.heroButton1Text || ''} />
            <input type="hidden" name="heroButton1Link" value={settings.heroButton1Link || ''} />
            <input type="hidden" name="heroButton2Text" value={settings.heroButton2Text || ''} />
            <input type="hidden" name="heroButton2Link" value={settings.heroButton2Link || ''} />
            <input type="hidden" name="aboutUsSubtitle" value={settings.aboutUsSubtitle || ''} />
            <input type="hidden" name="aboutUsTitle" value={settings.aboutUsTitle || ''} />
            <input type="hidden" name="aboutUsDescription" value={settings.aboutUsDescription || ''} />
            <input type="hidden" name="servicesSubtitle" value={settings.servicesSubtitle || ''} />
            <input type="hidden" name="servicesTitle" value={settings.servicesTitle || ''} />
            <input type="hidden" name="servicesDescription" value={settings.servicesDescription || ''} />
            <input type="hidden" name="ctaHeadline" value={settings.ctaHeadline || ''} />
            <input type="hidden" name="ctaDescription" value={settings.ctaDescription || ''} />
            <input type="hidden" name="ctaButtonText" value={settings.ctaButtonText || ''} />
            <input type="hidden" name="ctaButtonLink" value={settings.ctaButtonLink || ''} />
            <input type="hidden" name="trustedByText" value={settings.trustedByText || ''} />
            <textarea name="socialMedia" defaultValue={socialMediaJSON} className="hidden" />
            <textarea name="featureCards" defaultValue={featureCardsJSON} className="hidden" />
            <textarea name="aboutUsChecklist" defaultValue={aboutUsChecklistJSON} className="hidden" />
            <textarea name="professionalServices" defaultValue={professionalServicesJSON} className="hidden" />
            <textarea name="trustedByLogos" defaultValue={trustedByLogosJSON} className="hidden" />
            <textarea name="testimonials" defaultValue={testimonialsJSON} className="hidden" />
            <textarea name="blogPosts" defaultValue={blogPostsJSON} className="hidden" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
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
                                <Input id="image-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={isUploading}/>
                                {isUploading && <Loader2 className="animate-spin" />}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Nama Perusahaan</Label>
                            <Input id="companyName" name="companyName" defaultValue={settings.companyName} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsappSales">Nomor WhatsApp Sales</Label>
                            <Input id="whatsappSales" name="whatsappSales" defaultValue={settings.whatsappSales} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="footerText">Teks di Footer</Label>
                            <Textarea id="footerText" name="footerText" defaultValue={settings.footerText} required />
                        </div>
                    </CardContent>
                </Card>

                <Card>
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
            </div>
            
            <div className="mt-8 flex justify-end">
                <SubmitButton />
            </div>
        </form>
    </div>
  );
}
