
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { login } from './actions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full !mt-8" size="lg" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Masuk'}
    </Button>
  );
}

function LoginFormContent() {
  const [state, formAction] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const errorFromUrl = searchParams.get('error');

  const error = state?.message || errorFromUrl;

  return (
    <Card className="w-full max-w-sm shadow-2xl bg-background/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Logo companyName={"Admin"} />
        </div>
        <CardTitle className="font-headline text-2xl">Admin Content Management</CardTitle>
        <CardDescription>Silakan masuk untuk mengelola konten website.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
           <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Gagal</AlertTitle>
            <AlertDescription>
              {error === 'unauthorized' ? 'Sesi Anda telah berakhir, silakan login kembali.' : error}
            </AlertDescription>
          </Alert>
        )}
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@gmt.co.id" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div 
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/login-background.png')" }}
    >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10">
            <Suspense fallback={<Card className="w-full max-w-sm h-96 shadow-2xl" />}>
                <LoginFormContent />
            </Suspense>
        </div>
    </div>
  );
}
