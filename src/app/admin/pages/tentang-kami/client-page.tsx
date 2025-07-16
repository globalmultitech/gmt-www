
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

type LogoItem = {
    id: number;
    src: string;
    alt: string;
}

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

  const handleLogoChange = (arrayName: 'partners' | 'customers', index: number, field: keyof LogoItem, value: string) => {
    setFormState(prev => {
        const newArray = [...prev[arrayName]];
        // @ts-ignore
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [arrayName]: newArray };
    });
  };

  const addLogo = (arrayName: 'partners' | 'customers') => {
    const newItem: LogoItem = {
        id: Date.now(), // Temporary ID for new items
        src: '',
        alt: ''
    };
    // @ts-ignore
    setFormState(prev => ({...prev, [arrayName]: [...prev[arrayName], newItem]}));
  };

  const removeLogo = (arrayName: 'partners' | 'customers', index: number) => {
    setFormState(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, arrayName: 'partners' | 'customers', index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const uploadKey = `${arrayName}-${index}`;
      setUploadingStates(prev => ({...prev, [uploadKey]: true}));
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload image');
        
        const { publicUrl } = await res.json();
        handleLogoChange(arrayName, index, 'src', publicUrl);
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

  const LogoGrid = ({ title, arrayName, logos, onAdd, onRemove, onChange, onUpload }: { 
      title: string,
      arrayName: 'partners' | 'customers',
      logos: LogoItem[],
      onAdd: (name: 'partners' | 'customers') => void,
      onRemove: (name: 'partners' | 'customers', index: number) => void,
      onChange: (name: 'partners' | 'customers', index: number, field: keyof LogoItem, value: string) => void,
      onUpload: (e: React.ChangeEvent<HTMLInputElement>, name: 'partners' | 'customers', index: number) => void,
  }) => (
      <Card>
          <CardHeader>
              <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
              {logos.map((logo, index) => (
                  <div key={logo.id} className="flex items-end gap-4 p-2 border rounded-md">
                      <div className="relative w-24 h-16 rounded-md bg-muted overflow-hidden border">
                          {logo.src ? ( <Image src={logo.src} alt={logo.alt} fill sizes="96px" className="object-contain p-1" /> ) : <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                      </div>
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Nama / Alt Text</Label>
                            <Input value={logo.alt} onChange={e => onChange(arrayName, index, 'alt', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">File Gambar Logo</Label>
                          <div className="flex items-center gap-2">
                            <Input type="file" onChange={(e) => onUpload(e, arrayName, index)} accept="image/png, image/jpeg, image/webp, image/svg+xml" disabled={uploadingStates[`${arrayName}-${index}`]} />
                            {uploadingStates[`${arrayName}-${index}`] && <Loader2 className="animate-spin" />}
                          </div>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(arrayName, index)} className="text-destructive h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                  </div>
              ))}
              <Button type="button" variant="outline" onClick={() => onAdd(arrayName)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Logo</Button>
          </CardContent>
      </Card>
  );

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

        <LogoGrid 
            title="Logo Partner"
            arrayName="partners"
            logos={formState.partners}
            onAdd={addLogo}
            onRemove={removeLogo}
            onChange={handleLogoChange}
            onUpload={handleImageUpload}
        />

        <LogoGrid 
            title="Logo Pelanggan"
            arrayName="customers"
            logos={formState.customers}
            onAdd={addLogo}
            onRemove={removeLogo}
            onChange={handleLogoChange}
            onUpload={handleImageUpload}
        />
      
        <div className="flex justify-end">
            <SubmitButton isDirty={isDirty}/>
        </div>
    </form>
  );
}
