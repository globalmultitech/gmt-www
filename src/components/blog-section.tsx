'use client';

import { useEffect, useState } from 'react';
import { getBlogPostSummary } from '@/app/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Bot, Calendar, User } from 'lucide-react';
import Link from 'next/link';

const mockBlogPosts = [
  {
    id: 1,
    title: 'Masa Depan Perbankan: Tren Teknologi di Tahun 2024',
    content: "Industri perbankan terus berevolusi dengan adopsi teknologi baru. Dari kecerdasan buatan hingga blockchain, bank-bank modern mengintegrasikan solusi digital untuk meningkatkan efisiensi operasional dan pengalaman nasabah. Di tengah persaingan yang semakin ketat, inovasi menjadi kunci untuk tetap relevan. Artikel ini akan membahas tren teknologi kunci yang membentuk masa depan perbankan, termasuk bagaimana personalisasi layanan berbasis data dan keamanan siber menjadi prioritas utama.",
    author: 'Andi Wijaya',
    date: '15 Juli 2024',
  },
  {
    id: 2,
    title: 'Bagaimana Digital Kiosk Merevolusi Layanan Pelanggan',
    content: 'Kiosk digital bukan lagi sekadar mesin transaksi. Kini, perangkat ini menjadi titik sentuh utama untuk pengalaman pelanggan yang interaktif dan efisien. Dengan kemampuan untuk melakukan berbagai layanan mandiri, mulai dari pembukaan rekening hingga pembayaran tagihan, kiosk mengurangi beban kerja staf dan memotong waktu antrian secara signifikan. Pembahasan ini akan mengupas tuntas manfaat, tantangan, dan studi kasus implementasi digital kiosk yang sukses.',
    author: 'Citra Dewi',
    date: '02 Juli 2024',
  },
  {
    id: 3,
    title: 'Pentingnya Integrasi Sistem dalam Transformasi Digital',
    content: 'Transformasi digital yang berhasil tidak hanya tentang mengadopsi teknologi baru, tetapi juga tentang bagaimana teknologi tersebut saling terhubung. Integrasi sistem yang mulus antara core banking, CRM, dan platform layanan pelanggan adalah fondasi untuk menciptakan pandangan 360 derajat terhadap nasabah. Tanpa integrasi yang tepat, data akan terisolasi, menciptakan inefisiensi dan pengalaman pelanggan yang terputus-putus. Mari kita dalami strategi integrasi yang efektif.',
    author: 'Rina Kartika',
    date: '25 Juni 2024',
  },
];

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  summary?: string;
  error?: string;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      const summarizedPosts = await Promise.all(
        mockBlogPosts.map(async (post) => {
          const result = await getBlogPostSummary(post.content);
          if (result.error) {
            return { ...post, error: result.error };
          }
          return { ...post, summary: result.summary };
        })
      );
      setPosts(summarizedPosts);
      setLoading(false);
    };

    fetchSummaries();
  }, []);

  if (loading) {
    return <BlogSkeleton />;
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl h-16">{post.title}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground pt-2">
                <div className="flex items-center"><User className="h-4 w-4 mr-2" /><span>{post.author}</span></div>
                <span className='mx-2'>|</span>
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" /><span>{post.date}</span></div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-sm text-primary">Ringkasan AI</h4>
                </div>
                {post.summary ? (
                    <p className="text-sm text-muted-foreground italic">"{post.summary}"</p>
                ) : (
                     <p className="text-sm text-destructive">{post.error || "Gagal memuat ringkasan."}</p>
                )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="#" className="font-semibold text-primary hover:text-accent flex items-center">
                Baca Artikel Lengkap <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-md space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-6 w-32" />
            </CardFooter>
        </Card>
      ))}
    </div>
  );
}
