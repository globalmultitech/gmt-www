import { Logo } from '@/components/logo';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Facebook className="h-5 w-5" />, href: '#' },
    { icon: <Instagram className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];
  
  const footerLinks = [
    {
      title: 'Perusahaan',
      links: [
        { label: 'Tentang Kami', href: '/tentang-kami' },
        { label: 'Blog', href: '/resources' },
        { label: 'Karir', href: '#' },
      ],
    },
    {
      title: 'Produk',
      links: [
        { label: 'Digital Kiosk', href: '/produk' },
        { label: 'Sistem Antrian', href: '/produk' },
        { label: 'Software', href: '/produk' },
      ],
    },
    {
      title: 'Solusi',
      links: [
        { label: 'Transformasi Cabang', href: '/solusi' },
        { label: 'Customer Experience', href: '/solusi' },
        { label: 'Sistem Kurs', href: '/solusi' },
      ],
    },
     {
      title: 'Resources',
      links: [
        { label: 'Hubungi Kami', href: '/hubungi-kami' },
        { label: 'Dukungan', href: '#' },
        { label: 'FAQ', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm max-w-xs">
              Menyediakan solusi dan layanan teknologi terdepan untuk transformasi digital.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} className="text-muted-foreground hover:text-primary">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-headline font-semibold text-primary mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/80 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Global Multi Technology. Semua Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
