
'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Quote, Star } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import type { Testimonial } from '@/lib/settings';

function TestimonialSkeleton() {
    return (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-12 w-3/4 mb-6" />
                <div className="flex text-yellow-400 mb-4">
                    <Star /><Star /><Star /><Star /><Star />
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6 mb-6" />
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-6 w-32" />
            </div>
            <div className="relative hidden lg:block">
                <Skeleton className="w-[600px] h-[400px] rounded-lg" />
                 <div className="absolute -top-6 -left-6 bg-primary p-4 rounded-full text-white">
                    <Quote className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [isClient, setIsClient] = useState(false);
  const plugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <TestimonialSkeleton />;
  }

  if (!testimonials || testimonials.length === 0) {
    return (
        <div className="text-center py-12 text-muted-foreground">
            <p>Belum ada testimoni untuk ditampilkan.</p>
        </div>
    );
  }

  return (
    <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
    >
        <CarouselContent>
            {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="font-semibold text-sky-blue uppercase tracking-widest mb-2">Testimonial</p>
                            <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 text-primary">What our clients say about us</h2>
                            <div className="flex text-yellow-400 mb-4">
                                <Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" />
                            </div>
                            <p className="text-xl md:text-2xl text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                            <h3 className="text-2xl font-bold font-headline">{testimonial.name}</h3>
                            <p className="text-primary font-semibold">{testimonial.role}</p>
                        </div>
                        <div className="relative hidden lg:block">
                            <Image 
                                src={testimonial.image || 'https://placehold.co/600x400.png'}
                                alt={testimonial.name}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-lg"
                                data-ai-hint={testimonial.aiHint || 'person'}
                            />
                             <div className="absolute -top-4 -left-4 bg-primary p-4 rounded-full text-white z-10">
                                <Quote className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
        <div className="absolute -bottom-10 right-0 flex gap-2">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
          <CarouselNext className="relative right-0 top-0 translate-y-0" />
        </div>
    </Carousel>
  );
}
