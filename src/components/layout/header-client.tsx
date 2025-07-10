
'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, Search, Phone, MapPin, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { MenuItem } from '@/lib/settings';

type HeaderClientProps = {
    navItems: MenuItem[];
    companyName: string;
    logoUrl?: string | null;
    whatsappNumber: string;
}

export function HeaderClient({ navItems, companyName, logoUrl, whatsappNumber }: HeaderClientProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const phoneNumber = whatsappNumber.replace(/^\+62/, '0');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 bg-primary",
        isScrolled && 'shadow-lg'
      )}>

        {/* Top Bar - Hidden on scroll */}
        <div className={cn(
            "container mx-auto px-4 justify-between items-center h-16",
            "lg:flex",
            isScrolled ? "hidden" : "flex"
        )}>
            <div className="flex items-center gap-4">
                 <Logo companyName={companyName} logoUrl={logoUrl} />
            </div>
             <div className="hidden lg:flex items-center gap-6 text-sm text-primary-foreground">
                <div className="flex items-center gap-3">
                    <MapPin className="h-7 w-7" />
                    <div>
                        <p>Jl. Teknologi Raya No. 123</p>
                        <p className="font-bold">Jakarta Selatan, Indonesia</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-12 w-12 rounded-full border border-primary-foreground/20">
                    <Search className="h-6 w-6" />
                </Button>
            </div>
        </div>

      {/* Main Navigation - This part sticks and shrinks */}
      <div className={cn(
        "transition-all duration-300", 
        !isScrolled && 'border-t border-primary-foreground/20'
        )}>
        <div className="container mx-auto px-4">
            <div className={cn(
                "flex items-center justify-between transition-all duration-300", 
                isScrolled ? 'h-16' : 'h-20'
            )}>
            
            <div className="hidden lg:flex items-center gap-4">
              <div className={cn(isScrolled ? 'flex' : 'hidden')}>
                 <Logo companyName={companyName} logoUrl={logoUrl} />
              </div>
              <nav className="flex items-center space-x-8 text-base font-semibold">
                  {navItems.map((item) => (
                  <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                      'transition-colors hover:text-white/80 flex items-center gap-1 uppercase tracking-wider',
                      pathname === item.href ? 'text-white font-bold' : 'text-primary-foreground/80'
                      )}
                  >
                      {item.label}
                      {/* {item.label !== 'Beranda' && <ChevronDown className="h-4 w-4" />} */}
                  </Link>
                  ))}
              </nav>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center gap-3">
                    <Phone className="h-8 w-8 text-white/80"/>
                    <div>
                        <p className="text-xs text-white/70 uppercase">Call Us:</p>
                        <a href={`tel:${phoneNumber}`} className="font-bold text-white text-lg hover:underline">{phoneNumber}</a>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Trigger & Logo for mobile view */}
            <div className="lg:hidden flex items-center justify-between w-full">
                <Logo companyName={companyName} logoUrl={logoUrl} />
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className='text-primary-foreground hover:bg-primary-foreground/10'>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Buka menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background text-foreground p-0">
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
                            pathname === item.href && 'text-primary font-bold bg-primary/10'
                            )}
                        >
                            {item.label}
                        </Link>
                        ))}
                    </nav>
                    <div className="mt-auto p-4 space-y-4 border-t">
                        <div className="flex items-center gap-3">
                            <Phone className="h-8 w-8 text-primary"/>
                            <div>
                                <p className="text-xs text-muted-foreground">CALL US:</p>
                                <a href={`tel:${phoneNumber}`} className="font-bold text-primary text-lg hover:underline">{phoneNumber}</a>
                            </div>
                        </div>
                    </div>
                    </div>
                </SheetContent>
                </Sheet>
            </div>
            </div>
        </div>
      </div>
    </header>
  );
}
