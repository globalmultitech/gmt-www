
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function HubungiKamiSettingsClientPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pengaturan Halaman Hubungi Kami</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Konten Halaman</CardTitle>
                    <CardDescription>
                        Semua konten untuk halaman &quot;Hubungi Kami&quot;, seperti judul, subjudul, dan informasi kontak, dikelola di halaman Pengaturan Umum.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-muted-foreground">
                        Silakan buka Pengaturan Umum untuk mengubah informasi yang ditampilkan di halaman Hubungi Kami.
                    </p>
                    <Button asChild>
                        <Link href="/admin/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Buka Pengaturan Umum
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
