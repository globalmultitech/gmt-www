
'use client';

import { Logo } from '@/components/logo';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import type { SocialMediaLinks, WebSettings } from '@/lib/settings';

type FooterClientProps = {
    settings: WebSettings;
}

export function FooterClient({ settings }: FooterClientProps) {
  
  const socialIcons = {
    twitter: <Twitter className="h-5 w-5" />,
    facebook: <Facebook className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  const socialLinksData = (settings.socialMedia as SocialMediaLinks) || {};
  const socialLinks = Object.entries(socialLinksData)
    .map(([key, href]) => {
        const platform = key as keyof typeof socialIcons;
        if (socialIcons[platform] && typeof href === 'string' && href) {
            return { icon: socialIcons[platform], href, platform };
        }
        return null;
    })
    .filter(Boolean);
  
  const footerLinks1 = [
      { label: 'Tentang Kami', href: '/tentang-kami' },
      { label: 'Layanan Kami', href: '/layanan' },
      { label: 'Solusi', href: '/solusi' },
  ];
   const footerLinks2 = [
      { label: 'Knowledge Center', href: '/resources' },
      { label: 'Hubungi Kami', href: '/hubungi-kami' },
      { label: 'FAQ', href: '#' },
      { label: 'Karir', href: '#' },
    ];

    const contactInfo = [
      { label: 'Alamat', value: settings.address },
      { label: 'Email', value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
      { label: 'Telepon', value: settings.contactPhone, href: `tel:${settings.contactPhone}` },
      { label: 'Jam Buka', value: settings.openingHours },
    ].filter(info => info.value);


  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Top Footer Section */}
        <div className="py-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Logo companyName={settings.companyName} logoUrl={settings.logoUrl} variant="footer" />
            <p className="text-primary-foreground/80 mt-6 text-base">
              {settings.footerText}
            </p>
             <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => (
                <Link key={social!.platform} href={social!.href} className="text-primary-foreground/80 hover:text-primary-foreground">
                    {social!.icon}
                </Link>
                ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-primary-foreground text-xl mb-6">Perusahaan</h3>
            <ul className="space-y-4">
              {footerLinks1.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
           <div className="lg:col-span-2">
            <h3 className="font-headline font-bold text-primary-foreground text-xl mb-6">Sumber Daya</h3>
            <ul className="space-y-4">
              {footerLinks2.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
              <h3 className="font-headline font-bold text-primary-foreground text-xl mb-6">Hubungi Kami</h3>
              <ul className="space-y-3">
                {contactInfo.map((info) => (
                  <li key={info.label} className="flex items-start">
                    <span className="font-semibold w-32 shrink-0">{info.label}</span>
                    {info.href ? (
                      <Link href={info.href} className="text-primary-foreground/80 hover:text-white">
                        {info.value}
                      </Link>
                    ) : (
                      <span className="text-primary-foreground/80">{info.value}</span>
                    )}
                  </li>
                ))}
              </ul>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="py-6 border-t border-primary-foreground/20 text-sm text-primary-foreground/80">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; {new Date().getFullYear()} {settings.companyName}. Hak Cipta Dilindungi.</p>
                <div className="flex space-x-6">
                    <Link href="/syarat-ketentuan" className="hover:text-primary-foreground">Syarat & Ketentuan</Link>
                    <Link href="/kebijakan-privasi" className="hover:text-primary-foreground">Kebijakan Privasi</Link>
                </div>
            </div>
            <div className="text-center mt-4">
                Crafted by <a href="https://c-ss.co.id" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary-foreground underline">Creative Software Solution</a>
            </div>
        </div>
      </div>
    </footer>
  );
}
