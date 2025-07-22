

'use client';

import type { Product, ProductSubCategory, ProductCategory, ProfessionalService, NewsItem, Solution } from '@prisma/client';
import { ArrowRight, CheckCircle, Handshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { WebSettings, FeatureCard, TrustedByLogo } from '@/lib/settings';
import { DynamicIcon } from '@/components/dynamic-icon';
import { HomeSolutionsTabs } from '@/components/home-solutions-tabs';
import { HomeMapSection } from '@/components/home-map-section';
import BlogSection from '@/components/blog-section';
import * as React from 'react';

type EnrichedProduct = Product & {
  subCategory: ProductSubCategory & {
    category: ProductCategory;
  };
};

type DetailPoint = {
    title: string;
    image?: string;
    description: string;
}

type HomePageProps = {
  products: EnrichedProduct[];
  settings: WebSettings;
  professionalServices: ProfessionalService[];
  newsItems: NewsItem[];
  solutions: Solution[];
}

const Marquee = ({ logos, duration, reverse = false }: { logos: TrustedByLogo[], duration: string, reverse?: boolean }) => (
    <div className="flex w-max items-center animate-marquee" style={{ animationDuration: duration, animationDirection: reverse ? 'reverse' : 'normal' }}>
        {[...logos, ...logos].map((logo, index) => (
            <div key={`logo-${index}`} className="relative mx-8 h-12 w-36 flex-shrink-0" title={logo.alt}>
                 {logo.src ? (
                    <Image src={logo.src} alt={logo.alt} fill sizes="144px" className="object-contain" />
                ): (
                    <div className="w-full h-full bg-white/20 rounded flex items-center justify-center text-sm">{logo.alt}</div>
                )}
            </div>
        ))}
    </div>
);


export default function HomeClientPage({ products, settings, professionalServices, newsItems, solutions }: HomePageProps) {
  
  const trustedByLogos = settings.trustedByLogos as TrustedByLogo[];
  
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section 
        className="relative min-h-[700px] md:min-h-[800px] flex items-center bg-cover bg-center bg-no-repeat" 
        style={{backgroundImage: `url('${settings.heroImageUrl || 'https://placehold.co/1920x1080.png'}')`}}
        >
        <div className="container mx-auto px-4 relative z-10 text-center text-primary-foreground">
          <div className="max-w-4xl mx-auto">
            {settings.heroHeadline && (
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold uppercase leading-tight mb-6 fade-in-up" style={{ textShadow: '0 0 1px #000, 1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000' }}>
                {settings.heroHeadline}
              </h1>
            )}
            {settings.heroDescription && (
              <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s', textShadow: '0 0 1px #000, 1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000' }}>
                {settings.heroDescription}
              </p>
            )}
            <div className="flex justify-center items-center gap-4 fade-in-up" style={{animationDelay: '0.4s'}}>
              {settings.heroButton1Text && settings.heroButton1Link && (
                  <Button asChild size="lg">
                    <Link href={settings.heroButton1Link}>{settings.heroButton1Text}</Link>
                  </Button>
              )}
               {settings.heroButton2Text && settings.heroButton2Link && (
                  <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    <Link href={settings.heroButton2Link}>{settings.heroButton2Text}</Link>
                  </Button>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      {settings.featureCards && (settings.featureCards as FeatureCard[]).length > 0 && (
        <section className="bg-dark-slate">
            <div className="container mx-auto px-4 relative z-10 -mt-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(settings.featureCards as FeatureCard[]).map((card: FeatureCard, index: number) => (
                        <Card key={index} className="p-6 text-center bg-card shadow-lg rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                            <div className="flex justify-center mb-4">
                              <DynamicIcon 
                                name={card.icon} 
                                className="h-8 w-8 text-primary"
                              />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">{card.title}</h3>
                            <p className="text-sm text-muted-foreground">{card.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 md:py-28 bg-dark-slate">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
              {settings.aboutUsSubtitle && <p className="font-semibold text-primary uppercase tracking-widest mb-2">{settings.aboutUsSubtitle}</p>}
              {settings.aboutUsTitle && <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 text-primary">{settings.aboutUsTitle}</h2>}
              {settings.aboutUsDescription && <p className="text-muted-foreground mb-6">{settings.aboutUsDescription}</p>}
              {Array.isArray(settings.aboutUsChecklist) && settings.aboutUsChecklist.length > 0 && (
                <ul className="space-y-4 mb-8">
                  {(settings.aboutUsChecklist as string[]).map((item, index) => (
                     <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                        <span className="font-semibold text-lg">{item}</span>
                      </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <Image 
                src={settings.aboutUsImageUrl || 'https://placehold.co/600x600.png'}
                alt={settings.aboutUsTitle || "About Us Image"}
                width={570}
                height={570}
                sizes="(max-width: 1024px) 100vw, 570px"
                className="rounded-lg shadow-lg"
                data-ai-hint="team work office"
              />
            </div>
          </div>
        </div>
      </section>

       {/* Services Section */}
       {professionalServices && professionalServices.length > 0 && (
          <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                {settings.servicesSubtitle && <p className="font-semibold text-primary uppercase tracking-widest mb-2">{settings.servicesSubtitle}</p>}
                {settings.servicesTitle && <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary">{settings.servicesTitle}</h2>}
                {settings.servicesDescription && <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{settings.servicesDescription}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {professionalServices.map((service) => (
                  <Link key={service.id} href={`/layanan/${service.slug}`} className="group block">
                    <Card className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full">
                      <div className="flex flex-row items-center gap-4 p-6">
                        <div className="bg-primary/10 p-3 md:p-4 rounded-full">
                          <DynamicIcon name={service.icon} className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-headline text-xl md:text-2xl font-bold group-hover:text-sky-blue transition-colors">{service.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      <CardContent>
                        <ul className="space-y-3 pt-4 border-t">
                          {(service.details as DetailPoint[]).slice(0, 3).map((detail, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Handshake className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{detail.title}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Solutions Tabs Section */}
      <HomeSolutionsTabs solutions={solutions} />
      
      {/* Map Section */}
      <HomeMapSection />

       {/* CTA Section */}
       <section className="relative py-20 bg-cover bg-center bg-fixed" style={{backgroundImage: `url('${settings.ctaImageUrl || 'https://placehold.co/1920x1080.png'}')`}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative container mx-auto px-4 text-primary-foreground">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="lg:w-2/3">
              {settings.ctaHeadline && <h2 className="text-3xl md:text-4xl font-headline font-extrabold">{settings.ctaHeadline}</h2>}
              {settings.ctaDescription && <p className="mt-2 text-lg text-primary-foreground/80">{settings.ctaDescription}</p>}
            </div>
            {settings.ctaButtonText && settings.ctaButtonLink && (
                <div className="flex-shrink-0">
                  <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <Link href={settings.ctaButtonLink}>{settings.ctaButtonText}</Link>
                  </Button>
                </div>
            )}
          </div>
          {Array.isArray(trustedByLogos) && trustedByLogos.length > 0 && (
            <div className="mt-12 border-t border-primary-foreground/20 pt-8">
              {settings.trustedByText && <h3 className="text-center font-semibold uppercase tracking-widest mb-6">{settings.trustedByText}</h3>}
              <div
                  className="relative w-full overflow-hidden"
                  style={{
                      maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
                  }}
              >
                  <div className="flex flex-col gap-8 py-4">
                      <Marquee logos={trustedByLogos} duration="80s" />
                      <Marquee logos={trustedByLogos} duration="120s" reverse={true} />
                  </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
       {/* Products Section */}
      <section className="py-20 md:py-28 bg-dark-slate">
          <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <p className="font-semibold text-primary uppercase tracking-widest mb-2">OUR PRODUCTS</p>
                  <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary">Produk Unggulan Kami</h2>
                </div>
                <Link href="/produk" className="font-semibold text-foreground hover:text-primary flex items-center gap-2">
                    Semua Produk <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {products.map((product) => (
                     <Link key={product.id} href={`/produk/${product.slug}`} className="bg-background rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                          <div className="relative h-48 md:h-56">
                            <Image 
                                src={(product.images as string[])?.[0] ?? 'https://placehold.co/600x400.png'} 
                                alt={product.title} 
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw" 
                                className="object-cover" 
                                data-ai-hint="product technology"/>
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-bold font-headline mb-4 text-primary group-hover:text-primary-dark transition-colors">{product.title}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4 border-b pb-4">
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-semibold">KATEGORI</p>
                                    <p className="font-bold">{product.subCategory.category.name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-semibold">SUB-KATEGORI</p>
                                    <p className="font-bold">{product.subCategory.name}</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm h-16 overflow-hidden">{product.description}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* Knowledge Center/Blog Section */}
      <BlogSection newsItems={newsItems} />

    </div>
  );
}
