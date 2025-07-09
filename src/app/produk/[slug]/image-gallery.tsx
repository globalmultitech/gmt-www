'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

type ProductImageGalleryProps = {
  images: string[];
  productTitle: string;
};

export default function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const imageList = images && images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (imageList.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg border bg-muted flex items-center justify-center">
        <ImageIcon className="h-20 w-20 text-muted-foreground" />
      </div>
    );
  }

  const activeImage = imageList[activeIndex];

  return (
    <div className="sticky top-24">
      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg border bg-muted">
        <Image
          src={activeImage}
          alt={`${productTitle} - image ${activeIndex + 1}`}
          fill
          className="object-contain"
          priority={true}
        />
      </div>
      {imageList.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {imageList.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'rounded-md overflow-hidden border-2 transition-all',
                activeIndex === index ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-muted-foreground/50'
              )}
            >
              <div className="relative aspect-square bg-muted">
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
