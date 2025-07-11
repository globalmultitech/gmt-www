
'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Eye, Rocket, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/settings';
import type { WebSettings } from '@/lib/settings';

export default function TentangKamiPage() {
  const [settings, setSettings] = useState<WebSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
    }
    fetchSettings();
  }, []);

  if (!settings) {
    // Optional: add a loading skeleton here
    return <div>Loading...</div>;
  }

  const timeline = settings.timeline ?? [];
  const teamMembers = settings.teamMembers ?? [];

  return (
    <>
      <section className="bg-dark-slate">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{settings.aboutPageTitle}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {settings.aboutPageSubtitle}
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Rocket className="h-8 w-8 text-primary"/>
                </div>
                <h2 className="text-3xl font-headline font-bold text-primary">{settings.missionTitle}</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                {settings.missionText}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Eye className="h-8 w-8 text-primary"/>
                </div>
                <h2 className="text-3xl font-headline font-bold text-primary">{settings.visionTitle}</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                {settings.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Perjalanan Kami</h2>
            <p className="mt-2 text-lg text-muted-foreground">Sejak 2010, kami terus berkembang dan berinovasi.</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 h-full w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>
            {timeline.map((item, index) => (
              <div key={index} className="relative mb-8 md:mb-0">
                <div className="md:flex items-center" style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}>
                  <div className="md:w-5/12"></div>
                  <div className="hidden md:flex justify-center w-2/12">
                     <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-secondary"></div>
                  </div>
                  <div className="md:w-5/12">
                     <Card className="shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
                        <CardHeader>
                            <h3 className="font-headline text-sky-blue text-2xl">{item.year}</h3>
                            <p className="text-muted-foreground">{item.event}</p>
                        </CardHeader>
                     </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Tim Kepemimpinan Kami</h2>
                <p className="mt-2 text-lg text-muted-foreground">Orang-orang di balik kesuksesan Global Multi Technology.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                    <div key={index} className="text-center group">
                        <div className="relative h-40 w-40 md:h-48 md:w-48 mx-auto rounded-full overflow-hidden shadow-lg mb-4 transform transition-transform duration-300 group-hover:scale-105">
                           <Image src={member.image || 'https://placehold.co/400x400.png'} alt={member.name} layout="fill" objectFit="cover" data-ai-hint={member.aiHint}/>
                        </div>
                        <h3 className="font-headline font-bold text-primary text-xl">{member.name}</h3>
                        <p className="text-sky-blue">{member.role}</p>
                        {member.linkedin && (
                            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary"/>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );
}
