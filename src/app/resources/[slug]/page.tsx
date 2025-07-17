
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await prisma.newsItem.findMany({
    where: { slug: { not: '' } },
    select: { slug: true },
  });
 
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPostBySlug(slug: string) {
  const post = await prisma.newsItem.findUnique({
    where: { slug },
  });
  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }
  
  const mainImageUrl = post.image ?? undefined;

  return {
    title: post.title,
    description: post.content?.substring(0, 160) || 'Baca artikel selengkapnya.',
    openGraph: {
        title: post.title,
        description: post.content?.substring(0, 160) || 'Baca artikel selengkapnya.',
        images: mainImageUrl ? [mainImageUrl] : [],
    },
  };
}

const Breadcrumbs = ({ postTitle }: { postTitle: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4" /> Beranda</Link>
    <ChevronRight className="h-4 w-4" />
    <Link href="/resources" className="hover:text-primary">Knowledge Center</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="font-semibold text-foreground truncate max-w-xs">{postTitle}</span>
  </nav>
);

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <div className="bg-secondary pt-20">
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs postTitle={post.title} />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
            <p className="text-base font-semibold text-primary">{post.category}</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-x-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.createdAt.toISOString()}>
                        {format(new Date(post.createdAt), "d MMMM yyyy", { locale: id })}
                    </time>
                </div>
            </div>

            {post.image && (
                <div className="relative mt-8 h-96 w-full rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                </div>
            )}
            
            <article className="prose prose-lg dark:prose-invert max-w-none mt-12">
                <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </article>

        </div>
      </div>
    </>
  );
}
