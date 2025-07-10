'use client';

import { Logo } from '@/components/logo';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
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
  
  const footerLinks1 = [
      { label: 'About Us', href: '/tentang-kami' },
      { label: 'Our Services', href: '/layanan' },
      { label: 'Our Projects', href: '/proyek' },
      { label: 'Our Team', href: '/tim' },
  ];
   const footerLinks2 = [
      { label: 'Blog', href: '/resources' },
      { label: 'Contact', href: '/hubungi-kami' },
      { label: 'FAQ', href: '#' },
      { label: 'Careers', href: '#' },
    ];


  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4">
        {/* Top Footer Section */}
        <div className="py-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Logo companyName={companyName} logoUrl={logoUrl} />
            <p className="text-muted-foreground mt-6 text-base">
              {footerText}
            </p>
             <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => (
                <Link key={social!.platform} href={social!.href} className="text-muted-foreground hover:text-primary">
                    {social!.icon}
                </Link>
                ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-muted-foreground text-xl mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks1.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
           <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-muted-foreground text-xl mb-6">Resources</h3>
            <ul className="space-y-4">
              {footerLinks2.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
              <h3 className="font-headline font-bold text-muted-foreground text-xl mb-6">Subscribe</h3>
              <p className="text-muted-foreground mb-4">Subscribe to our newsletter to get the latest updates.</p>
              <form className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="bg-secondary focus:bg-background h-12"/>
                <Button type="submit" size="lg">
                    <ArrowRight className="h-5 w-5"/>
                </Button>
              </form>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="py-6 flex flex-wrap justify-between items-center gap-4 border-t">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
             <Link href="#" className="hover:text-primary">Terms & Conditions</Link>
             <Link href="#" className="hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
