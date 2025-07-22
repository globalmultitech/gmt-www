

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings } from '@/lib/settings';
import { Building, Mail, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from './contact-form';
import prisma from '@/lib/db';

async function getPageData() {
    const settings = await getSettings();
    const products = await prisma.product.findMany({
        select: {
            title: true,
            slug: true, // Also fetch the slug
        },
        orderBy: {
            title: 'asc',
        },
    });
    return { settings, products };
}

export default async function HubungiKamiPage() {
  const { settings, products } = await getPageData();
  const whatsappNumber = settings.whatsappSales;
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo,%20saya%20tertarik%20dengan%20produk/layanan%20Anda.`;

  return (
    <>
      <section className="bg-dark-slate pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{settings.contactPageTitle}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {settings.contactPageSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Contact Form */}
            <div className="md:col-span-7 lg:col-span-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">Minta Penawaran Cepat</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm 
                    whatsappNumber={settings.whatsappSales}
                    companyName={settings.companyName}
                    products={products}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-5 lg:col-span-4 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-2xl text-primary">Kantor Pusat</h3>
                </div>
                <p className="text-muted-foreground pl-16">
                  {settings.address}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                   <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-2xl text-primary">Email</h3>
                </div>
                <p className="text-muted-foreground pl-16">
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-accent">{settings.contactEmail}</a>
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-2xl text-primary">WhatsApp</h3>
                </div>
                <p className="text-muted-foreground pl-16">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent">{whatsappNumber}</a>
                </p>
              </div>
              <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-md mt-6">
                <Image
                  src={settings.logoUrl || 'https://placehold.co/600x400.png'}
                  alt="Lokasi Kantor"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-8"
                  data-ai-hint="map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
