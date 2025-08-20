
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import BlogPostClientPage from './blog-post-client-page';

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

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClientPage post={post} />;
}
