
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    image: 'https://placehold.co/1920x1080.png',
    aiHint: 'modern office technology',
    subtitle: 'IT-Solution',
    title: 'Providing the best services & IT solution',
    buttonText: 'Read More',
    href: '/solusi',
  },
  {
    image: 'https://placehold.co/1920x1080.png',
    aiHint: 'data security server',
    subtitle: 'Data Security',
    title: 'Advanced data security for your business',
    buttonText: 'Discover More',
    href: '/layanan',
  },
  {
    image: 'https://placehold.co/1920x1080.png',
    aiHint: 'business growth chart',
    subtitle: 'Business Reform',
    title: 'Transforming your business with technology',
    buttonText: 'Get Started',
    href: '/hubungi-kami',
  },
];

export function HeroSlider() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="relative h-[80vh] md:h-screen text-white">
       <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
        <CarouselContent className='h-full'>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className='h-full'>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  data-ai-hint={slide.aiHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl">
                            <p className="font-semibold text-primary uppercase tracking-widest mb-4 slide-in-up" style={{animationDelay: '0.2s'}}>{slide.subtitle}</p>
                            <h1 className="text-4xl md:text-6xl font-headline font-extrabold leading-tight mb-8 slide-in-up" style={{animationDelay: '0.4s'}}>{slide.title}</h1>
                            <div className="slide-in-up" style={{animationDelay: '0.6s'}}>
                              <Button asChild size="lg">
                                <Link href={slide.href}>
                                  {slide.buttonText} <ArrowRight className="ml-2 h-5 w-5"/>
                                </Link>
                              </Button>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-10 right-10">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0 text-white border-white/50 hover:bg-primary hover:text-white" />
          <CarouselNext className="relative right-0 top-0 translate-y-0 text-white border-white/50 hover:bg-primary hover:text-white" />
        </div>
      </Carousel>
    </section>
  );
}
