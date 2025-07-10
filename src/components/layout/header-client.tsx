'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, ArrowRight, MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../theme-toggle';
import type { MenuItem, SocialMediaLinks } from '@/lib/settings';

type HeaderClientProps = {
    navItems: MenuItem[];
    companyName: string;
    logoUrl?: string | null;
    socialLinksData: SocialMediaLinks;
}

export function HeaderClient({ navItems, companyName, logoUrl, socialLinksData }: HeaderClientProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // check on initial render
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const socialIcons = {
    twitter: <Twitter className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />,
    instagram: <Instagram className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
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

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      )}>
      {/* Top Bar */}
      <div className={cn(
        "bg-secondary/50 dark:bg-secondary/20 transition-all duration-300",
        isScrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden' : 'max-h-20 py-2 opacity-100'
      )}>
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary"/>
              <span>Jl. Teknologi Raya, Jakarta</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary"/>
              <span>contact@gmt.co.id</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            {socialLinks.map((social) => (
              <Link key={social!.platform} href={social!.href} className="hover:text-primary">
                {social!.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Logo companyName={companyName} logoUrl={logoUrl} />

          <nav className="hidden lg:flex items-center space-x-8 text-base font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Call Us</p>
                    <p className="font-bold">+62 812 3456 7890</p>
                </div>
            </div>
            <Button asChild>
              <Link href="/hubungi-kami">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Logo companyName={companyName} logoUrl={logoUrl} />
                  </div>
                  <nav className="flex flex-col items-start space-y-4 p-4 text-lg">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'transition-colors hover:text-primary w-full p-2 rounded-md',
                          pathname === item.href ? 'text-primary font-bold bg-secondary' : 'text-muted-foreground'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto p-4 space-y-4 border-t">
                    <Button asChild className="w-full font-bold">
                      <Link href="/hubungi-kami" onClick={() => setIsMobileMenuOpen(false)}>Get a Quote</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
