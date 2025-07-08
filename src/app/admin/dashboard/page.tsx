import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-secondary">
             <header className="bg-background border-b sticky top-0 z-10">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
                     <Button variant="outline" asChild>
                        <Link href="/admin">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Selamat Datang, Admin!</CardTitle>
                        <CardDescription>Anda telah berhasil masuk ke dasbor admin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Dari sini, Anda dapat mulai mengelola konten situs web. Fungsi ini sedang dalam pengembangan.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
