
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { login } from './actions';
import { Loader2 } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full !mt-8" size="lg" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Masuk'}
    </Button>
  );
}

// This page remains a client component to use useActionState
export default function LoginPage({ searchParams }: { searchParams: { error?: string }}) {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
             {/* This will not show logo, we will fix this later by making the page a server component */}
            <Logo companyName={"Admin"} />
          </div>
          <CardTitle className="font-headline text-2xl">Admin Content Management</CardTitle>
          <CardDescription>Silakan masuk untuk mengelola konten website.</CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams.error && (
             <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Gagal</AlertTitle>
              <AlertDescription>
                {searchParams.error}
              </AlertDescription>
            </Alert>
          )}
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@gmt.co.id" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
