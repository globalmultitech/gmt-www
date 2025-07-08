'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../theme-toggle';

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/produk', label: 'Produk' },
  { href: '/solusi', label: 'Solusi' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/resources', label: 'Resources' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300", 
        isScrolled ? 'bg-secondary shadow-lg border-b border-border/40' : 'bg-transparent'
      )}>
      <div className="container flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary uppercase tracking-wider',
                pathname === item.href ? 'text-primary font-semibold' : 'text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild className="font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105">
            <Link href="/hubungi-kami">
              Hubungi Kami <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <div className="flex flex-col h-full">
                <div className="p-4 flex justify-between items-center border-b">
                  <Logo />
                  <ThemeToggle />
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
                  <Button asChild className="w-full font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent">
                    <Link href="/hubungi-kami" onClick={() => setIsMobileMenuOpen(false)}>Hubungi Kami</Link>
                  </Button>
                   <Button asChild variant="outline" className="w-full">
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Login</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
