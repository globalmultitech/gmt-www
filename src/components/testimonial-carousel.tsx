
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

const testimonials = [
    {
        quote: "We've been using Daltech for a few years now, and we're very happy with the results. They're a great team to work with, and they're always willing to go the extra mile to help us succeed.",
        name: 'John Doe',
        role: 'CEO, Company',
        image: 'https://placehold.co/100x100.png',
        aiHint: 'professional man portrait',
    },
    {
        quote: "The team at Daltech is incredibly talented and passionate about what they do. They took the time to understand our business and our goals, and they delivered a solution that exceeded our expectations.",
        name: 'Jane Smith',
        role: 'CTO, Another Corp',
        image: 'https://placehold.co/100x100.png',
        aiHint: 'professional woman portrait',
    },
    {
        quote: "Daltech's data security services are top-notch. They helped us identify and mitigate a number of potential vulnerabilities, and we're now confident that our data is safe and secure.",
        name: 'Peter Jones',
        role: 'Head of IT, Tech Inc.',
        image: 'https://placehold.co/100x100.png',
        aiHint: 'smiling man portrait',
    },
];

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
                <Skeleton className="w-[300px] h-[450px] rounded-lg" />
                 <div className="absolute -top-6 -left-6 bg-primary p-4 rounded-full text-white">
                    <Quote className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}

export function TestimonialCarousel() {
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
                            <p className="font-semibold text-primary uppercase tracking-widest mb-2">Testimonial</p>
                            <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6">What our clients say about us</h2>
                            <div className="flex text-yellow-400 mb-4">
                                <Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" />
                            </div>
                            <p className="text-xl md:text-2xl text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                            <h3 className="text-2xl font-bold font-headline">{testimonial.name}</h3>
                            <p className="text-primary font-semibold">{testimonial.role}</p>
                        </div>
                        <div className="relative hidden lg:block">
                            <Image 
                                src={'https://placehold.co/600x400.png'}
                                alt={testimonial.name}
                                width={300}
                                height={450}
                                className="rounded-lg shadow-lg"
                                data-ai-hint={testimonial.aiHint}
                            />
                             <div className="absolute -top-6 -left-6 bg-primary p-4 rounded-full text-white">
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
