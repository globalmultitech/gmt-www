
'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
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
  const [hasMounted, setHasMounted] = useState(false);
  
  const isProductPage = pathname.startsWith('/produk/') && pathname.length > '/produk/'.length;

  useEffect(() => {
    setHasMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call handler right away to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerClasses = {
    'bg-secondary shadow-sm': isProductPage,
    'bg-primary/90 backdrop-blur-sm shadow-md': hasMounted && isScrolled && !isProductPage,
    'bg-transparent': !isProductPage && (!hasMounted || !isScrolled),
  };
  
  const logoScrolled = hasMounted && isScrolled && !isProductPage;

  return (
    <header className={cn("fixed top-0 z-50 w-full transition-all duration-300", headerClasses)}>
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
            
            <div className="flex-shrink-0">
                 <Logo companyName={companyName} logoUrl={logoUrl} scrolled={logoScrolled} isProductPage={isProductPage} />
            </div>

            <div className="hidden lg:flex justify-center flex-1">
              <nav className="flex items-center space-x-8 text-base font-bold">
                  {navItems.map((item) => (
                  <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative transition-colors duration-300',
                        isProductPage ? 'text-primary' : (logoScrolled ? 'text-primary-foreground' : 'text-primary'),
                        'after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100',
                        pathname === item.href ? 'after:scale-x-100' : ''
                      )}
                  >
                      {item.label}
                  </Link>
                  ))}
              </nav>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
                <Button asChild variant={isScrolled || isProductPage ? 'default' : 'default'} className={cn(
                  (logoScrolled) && 'border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary',
                )}>
                    <Link href="/hubungi-kami">Get a Quote</Link>
                </Button>
            </div>

            <div className="lg:hidden flex items-center">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn('hover:bg-muted/20', (isScrolled || isProductPage) ? 'text-primary' : 'text-primary')}>
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
                            'transition-colors hover:text-primary w-full p-2 rounded-md text-foreground',
                            pathname === item.href && 'text-primary font-bold bg-primary/10'
                            )}
                        >
                            {item.label}
                        </Link>
                        ))}
                    </nav>
                     <div className="mt-auto p-4 border-t">
                        <Button asChild className="w-full">
                           <Link href="/hubungi-kami">Get a Quote</Link>
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
