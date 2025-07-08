import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">Admin Content Management</CardTitle>
          <CardDescription>Silakan masuk untuk mengelola konten website.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" type="email" placeholder="admin@gmt.co.id" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full !mt-8" size="lg">
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
