'use client';

import { Logo } from '@/components/logo';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import type { SocialMediaLinks } from '@/lib/settings';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type FooterClientProps = {
    companyName: string;
    footerText: string;
    socialLinksData: SocialMediaLinks;
    logoUrl?: string | null;
}

export function FooterClient({ companyName, footerText, socialLinksData, logoUrl }: FooterClientProps) {
  
  const socialIcons = {
    twitter: <Twitter className="h-5 w-5" />,
    facebook: <Facebook className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  const socialLinks = Object.entries(socialLinksData)
    .map(([key, href]) => {
        const platform = key as keyof typeof socialIcons;
        if (socialIcons[platform]) {
            return { icon: socialIcons[platform], href, platform };
        }
        return null;
    })
    .filter(Boolean);
  
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/tentang-kami' },
        { label: 'Our Services', href: '/layanan' },
        { label: 'Our Projects', href: '/proyek' },
        { label: 'Our Team', href: '/tim' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/resources' },
        { label: 'Contact', href: '/hubungi-kami' },
        { label: 'FAQ', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4">
        {/* Top Footer Section */}
        <div className="py-20 grid lg:grid-cols-12 gap-8 border-b">
          <div className="lg:col-span-4">
            <Logo companyName={companyName} logoUrl={logoUrl} />
            <p className="text-muted-foreground mt-6 text-base">
              {footerText}
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h3 className="font-headline font-bold text-foreground text-xl mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-4">
              <h3 className="font-headline font-bold text-foreground text-xl mb-6">Subscribe</h3>
              <p className="text-muted-foreground mb-4">Subscribe to our newsletter to get the latest updates.</p>
              <form className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="bg-background"/>
                <Button type="submit">Subscribe</Button>
              </form>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="py-6 flex flex-wrap justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link key={social!.platform} href={social!.href} className="text-muted-foreground hover:text-primary">
                {social!.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
