'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, Settings, Package, Shapes, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/login/actions';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { // if scroll down
        setIsHidden(true);
      } else { // if scroll up
        setIsHidden(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/admin/produk', label: 'Produk', icon: <Package className="h-5 w-5" /> },
    { href: '/admin/kategori', label: 'Kategori', icon: <Shapes className="h-5 w-5" /> },
  ];

  const pageNavItems = [
     { href: '/admin/pages/layanan', label: 'Layanan' },
     { href: '/admin/pages/solusi', label: 'Solusi' },
     { href: '/admin/pages/tentang-kami', label: 'Tentang Kami' },
     { href: '/admin/pages/resources', label: 'Resources' },
  ];

  const settingsNavItems = [
     { href: '/admin/settings', label: 'Pengaturan Web', icon: <Settings className="h-5 w-5" /> },
     { href: '/admin/users', label: 'Manajemen User', icon: <Users className="h-5 w-5" /> },
  ]

  const isPagesActive = pageNavItems.some(item => pathname.startsWith(item.href));

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-foreground">
      <main className="flex-grow w-full p-4 md:p-8 pb-24">
        {children}
      </main>
      
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t md:border md:rounded-full md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:w-max",
        "transition-transform duration-300 ease-in-out",
        isHidden ? 'translate-y-full md:translate-y-[calc(100%+2rem)]' : 'translate-y-0'
      )}>
        <div className="flex h-16 md:h-auto items-center justify-around md:justify-center md:gap-1 p-1">
          {navItems.map((item) => (
            <Button 
              key={item.href}
              asChild 
              variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'} 
              className={cn(
                  "flex-1 md:flex-initial flex flex-col md:flex-row h-full md:h-10 items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-none md:rounded-full",
                  pathname.startsWith(item.href) && "font-semibold"
              )}
            >
              <Link href={item.href} title={item.label}>
                {item.icon}
                <span className="text-xs md:text-sm">{item.label}</span>
              </Link>
            </Button>
          ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={isPagesActive ? 'secondary' : 'ghost'} 
                  className={cn(
                      "flex-1 md:flex-initial flex flex-col md:flex-row h-full md:h-10 items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-none md:rounded-full",
                      isPagesActive && "font-semibold"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs md:text-sm">Halaman</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 mb-2">
                <div className="grid gap-1">
                  {pageNavItems.map((item) => (
                     <Button key={item.href} asChild variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'} size="sm" className="justify-start">
                        <Link href={item.href}>
                          {item.label}
                        </Link>
                     </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>


          {settingsNavItems.map((item) => (
             <Button 
              key={item.href}
              asChild 
              variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'} 
              className={cn(
                  "flex-1 md:flex-initial flex flex-col md:flex-row h-full md:h-10 items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-none md:rounded-full",
                  pathname.startsWith(item.href) && "font-semibold"
              )}
            >
              <Link href={item.href} title={item.label}>
                {item.icon}
                <span className="text-xs md:text-sm">{item.label}</span>
              </Link>
            </Button>
          ))}
          <div className="w-px h-8 bg-border/50 mx-1 hidden md:block" />
          <form action={logout}>
              <Button type="submit" variant="ghost" className="flex-1 md:flex-initial flex flex-col md:flex-row h-full md:h-10 items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-none md:rounded-full" title="Logout">
                <LogOut className="h-5 w-5" />
                <span className="text-xs md:text-sm">Logout</span>
              </Button>
          </form>
        </div>
      </nav>
    </div>
  );
}
