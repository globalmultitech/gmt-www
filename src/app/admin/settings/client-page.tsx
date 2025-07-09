'use client';

import { useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { WebSettings } from '@prisma/client';
import { updateWebSettings } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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

  // Prisma stores JSON as a specific type, need to stringify for Textarea
  const socialMediaJSON = JSON.stringify(settings.socialMedia, null, 2);
  const menuItemsJSON = JSON.stringify(settings.menuItems, null, 2);

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Pengaturan Website</h1>
            <p className="text-muted-foreground">Kelola informasi umum, menu, dan tautan yang tampil di website Anda.</p>
        </div>
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
