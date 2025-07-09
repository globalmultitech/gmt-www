import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Settings } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Selamat Datang, Admin!</CardTitle>
                    <CardDescription>Pilih salah satu modul di bawah untuk mulai mengelola konten.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <Users className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Manajemen User</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm mb-4">Tambah, edit, atau hapus akun user yang dapat mengakses dashboard ini.</p>
                                <Button asChild>
                                    <Link href="/admin/users">Buka Modul</Link>
                                </Button>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <Settings className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Pengaturan Web</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm mb-4">Kelola menu, footer, nama perusahaan, dan informasi kontak website.</p>
                                <Button asChild>
                                    <Link href="/admin/settings">Buka Modul</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
