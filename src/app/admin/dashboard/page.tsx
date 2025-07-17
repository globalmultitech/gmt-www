
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Shapes, Handshake, Newspaper } from "lucide-react";
import prisma from '@/lib/db';
import LiveChatCard from "./live-chat-card";

async function getStats() {
    const [productCount, serviceCount, solutionCount, newsCount] = await prisma.$transaction([
        prisma.product.count(),
        prisma.professionalService.count(),
        prisma.solution.count(),
        prisma.newsItem.count(),
    ]);
    return { productCount, serviceCount, solutionCount, newsCount };
}

export default async function AdminDashboardPage() {
    const { productCount, serviceCount, solutionCount, newsCount } = await getStats();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LiveChatCard />

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Package className="h-8 w-8 text-primary" />
                            <CardTitle>Total Produk</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{productCount}</p>
                        <CardDescription>Produk yang ditampilkan di website.</CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Handshake className="h-8 w-8 text-primary" />
                            <CardTitle>Total Layanan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{serviceCount}</p>
                        <CardDescription>Layanan profesional yang ditawarkan.</CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                             <Shapes className="h-8 w-8 text-primary" />
                            <CardTitle>Total Solusi</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{solutionCount}</p>
                        <CardDescription>Solusi yang ditawarkan kepada klien.</CardDescription>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                             <Newspaper className="h-8 w-8 text-primary" />
                            <CardTitle>Total Artikel</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{newsCount}</p>
                        <CardDescription>Artikel di halaman Blog/Resources.</CardDescription>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pintasan Cepat</CardTitle>
                    <CardDescription>Akses cepat ke modul manajemen konten.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <Button asChild variant="outline"><Link href="/admin/produk">Manajemen Produk</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/pages/layanan">Manajemen Layanan</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/pages/solusi">Manajemen Solusi</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/pages/resources">Manajemen Blog</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/settings">Pengaturan Umum</Link></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
