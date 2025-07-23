
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, PlusCircle, Trash2 } from 'lucide-react';
import type { WebSettings } from '@/lib/settings';
import { updateTentangKamiPageSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import type { PartnerLogo, CustomerLogo } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isDirty} className="w-48 sticky bottom-8 shadow-2xl">
      {pending ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
    </Button>
  );
}

type TentangKamiPageClientProps = {
  settings: WebSettings;
  initialPartners: PartnerLogo[];
  initialCustomers: CustomerLogo[];
};

type PartnerLogoItem = PartnerLogo;
type CustomerLogoItem = CustomerLogo;


export default function TentangKamiPageClientPage({ settings, initialPartners, initialCustomers }: TentangKamiPageClientProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateTentangKamiPageSettings, undefined);
  
  const getInitialFormState = () => ({
    aboutPageTitle: settings.aboutPageTitle ?? '',
    aboutPageSubtitle: settings.aboutPageSubtitle ?? '',
    partners: initialPartners,
    customers: initialCustomers,
  });

  const [formState, setFormState] = useState(getInitialFormState());
  const [uploadingStates, setUploadingStates] = useState<{[key: string]: boolean}>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormState(getInitialFormState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, initialPartners, initialCustomers]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formState) !== JSON.stringify(getInitialFormState()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);
  
  const handleFieldChange = (field: keyof typeof formState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (arrayName: 'partners' | 'customers', index: number, field: keyof PartnerLogoItem | keyof CustomerLogoItem, value: string) => {
    setFormState(prev => {
        const newArray = [...prev[arrayName]];
        // @ts-ignore
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [arrayName]: newArray };
    });
  };

  const addLogo = (arrayName: 'partners' | 'customers') => {
    const newItem: PartnerLogoItem | CustomerLogoItem = arrayName === 'partners' 
      ? { id: Date.now(), src: '', alt: '', description: '', createdAt: new Date(), updatedAt: new Date() }
      : { id: Date.now(), src: '', alt: '', createdAt: new Date(), updatedAt: new Date() };
    // @ts-ignore
    setFormState(prev => ({...prev, [arrayName]: [...prev[arrayName], newItem]}));
  };

  const removeLogo = (arrayName: 'partners' | 'customers', index: number) => {
    setFormState(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, arrayName: 'partners' | 'customers') => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const uploadKey = `${arrayName}-upload`;
      setUploadingStates(prev => ({...prev, [uploadKey]: true}));
      
      const formData = new FormData();
      for (const file of files) {
          formData.append("file", file);
      }
      
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Failed to upload images');
        
        const { publicUrls } = await res.json();
        
        setFormState(prev => {
            const newLogos = publicUrls.map((url: string) => (
                arrayName === 'partners'
                ? { id: Date.now() + Math.random(), src: url, alt: '', description: '', createdAt: new Date(), updatedAt: new Date() }
                : { id: Date.now() + Math.random(), src: url, alt: '', createdAt: new Date(), updatedAt: new Date() }
            ));
            // @ts-ignore
            return {...prev, [arrayName]: [...prev[arrayName], ...newLogos]};
        });

      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: 'Upload Gagal', variant: 'destructive' });
      } finally {
        setUploadingStates(prev => ({...prev, [uploadKey]: false}));
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
      if (isSuccess) setIsDirty(false);
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
       <input type="hidden" name="tentangKamiData" value={JSON.stringify(formState)} />
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Pengaturan Halaman Tentang Kami</h1>
            <p className="text-muted-foreground">Kelola konten yang tampil di halaman Tentang Kami.</p>
        </div>
      </div>
        <Card>
            <CardHeader>
                <CardTitle>Header Halaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-2"><Label htmlFor="aboutPageTitle">Judul Halaman</Label><Input id="aboutPageTitle" value={formState.aboutPageTitle} onChange={e => handleFieldChange('aboutPageTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="aboutPageSubtitle">Subjudul Halaman</Label><Textarea id="aboutPageSubtitle" value={formState.aboutPageSubtitle} onChange={e => handleFieldChange('aboutPageSubtitle', e.target.value)} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Logo Partner</CardTitle>
                <CardDescription>Tambah satu atau beberapa logo partner sekaligus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="p-4 border rounded-md bg-muted/50">
                    <Label htmlFor="partner-upload">Unggah Logo Partner Baru</Label>
                    <div className="flex items-center gap-2 pt-1">
                        <Input id="partner-upload" type="file" onChange={(e) => handleImageUpload(e, 'partners')} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={uploadingStates['partners-upload']} multiple />
                        {uploadingStates['partners-upload'] && <Loader2 className="animate-spin" />}
                    </div>
                </div>
                {formState.partners.map((logo, index) => (
                    <div key={logo.id} className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-md">
                        <div className="flex-shrink-0 w-full md:w-auto">
                           <div className="relative w-32 h-32 rounded-md bg-muted overflow-hidden border">
                              {logo.src ? ( <Image src={logo.src} alt={logo.alt} fill sizes="128px" className="object-contain p-2" /> ) : ( <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" /> )}
                           </div>
                        </div>

                        <div className="flex-grow grid grid-cols-1 gap-4 w-full">
                          <div className="space-y-1">
                              <Label className="text-xs">URL Gambar Logo</Label>
                              <Input value={logo.src} disabled />
                          </div>
                          <div className="space-y-1">
                              <Label className="text-xs">Nama Partner / Alt Text</Label>
                              <Input value={logo.alt} onChange={e => handleLogoChange('partners', index, 'alt', e.target.value)} />
                          </div>
                           <div className="space-y-1">
                              <Label className="text-xs">Deskripsi Partner</Label>
                              <Textarea value={logo.description ?? ''} onChange={e => handleLogoChange('partners', index, 'description', e.target.value)} />
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLogo('partners', index)} className="text-destructive h-9 w-9 flex-shrink-0"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Logo Pelanggan</CardTitle>
              <CardDescription>Tambah satu atau beberapa logo pelanggan sekaligus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
              <div className="p-4 border rounded-md bg-muted/50">
                  <Label htmlFor="customer-upload">Unggah Logo Pelanggan Baru</Label>
                  <div className="flex items-center gap-2 pt-1">
                      <Input id="customer-upload" type="file" onChange={(e) => handleImageUpload(e, 'customers')} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={uploadingStates['customers-upload']} multiple />
                      {uploadingStates['customers-upload'] && <Loader2 className="animate-spin" />}
                  </div>
              </div>
              {formState.customers.map((logo, index) => (
                  <div key={logo.id} className="flex items-end gap-4 p-2 border rounded-md">
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">URL Gambar Logo</Label>
                            <Input value={logo.src} disabled />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Nama / Alt Text</Label>
                            <Input value={logo.alt} onChange={e => handleLogoChange('customers', index, 'alt', e.target.value)} />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeLogo('customers', index)} className="text-destructive h-9 w-9 flex-shrink-0"><Trash2 className="h-4 w-4" /></Button>
                  </div>
              ))}
          </CardContent>
      </Card>
      
        <div className="flex justify-end">
            <SubmitButton isDirty={isDirty}/>
        </div>
    </form>
  );
}
