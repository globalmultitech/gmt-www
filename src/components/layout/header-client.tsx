'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { MenuItem } from '@/lib/settings';

type HeaderClientProps = {
    navItems: MenuItem[];
    companyName: string;
    logoUrl?: string | null;
}

export function HeaderClient({ navItems, companyName, logoUrl }: HeaderClientProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call on mount to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? 'bg-background/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      )}>
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          <Logo companyName={companyName} logoUrl={logoUrl} isScrolled={isScrolled} />

          <nav className="hidden lg:flex items-center space-x-10 text-base font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : (isScrolled ? 'text-foreground' : 'text-white')
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Button asChild variant="outline" className={cn(
              'border-foreground/50 hover:bg-primary hover:text-primary-foreground hover:border-primary',
              !isScrolled && 'border-white/50 text-white hover:bg-white hover:text-primary'
            )}>
              <Link href="/hubungi-kami">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isScrolled ? 'text-foreground' : 'text-white', 'hover:bg-foreground/10')}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border">
                    <Logo companyName={companyName} logoUrl={logoUrl} isScrolled={true} />
                  </div>
                  <nav className="flex flex-col items-start space-y-4 p-4 text-lg">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'transition-colors hover:text-primary w-full p-2 rounded-md text-foreground',
                          pathname === item.href && 'text-primary font-bold bg-secondary'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto p-4 space-y-4 border-t border-border">
                    <Button asChild className="w-full font-bold" size="lg">
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
