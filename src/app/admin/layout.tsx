

'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Settings,
  Package,
  Shapes,
  FileText,
  Handshake,
  Building2,
  Newspaper,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/login/actions';
import { Logo } from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLoadingStore } from '@/hooks/use-loading-store';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const startLoading = useLoadingStore(state => state.startLoading);

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/admin/chat', label: 'Live Chat', icon: <MessageSquare /> },
    { href: '/admin/produk', label: 'Produk', icon: <Package /> },
    { href: '/admin/kategori', label: 'Kategori', icon: <Shapes /> },
  ];

  const pageNavItems = [
    { href: '/admin/pages/layanan', label: 'Layanan', icon: <FileText /> },
    { href: '/admin/pages/solusi', label: 'Solusi', icon: <Handshake /> },
    { href: '/admin/pages/tentang-kami', label: 'Tentang Kami', icon: <Building2 /> },
    { href: '/admin/pages/resources', label: 'Knowledge Center', icon: <Newspaper /> },
  ];

  const settingsNavItems = [
    { href: '/admin/settings', label: 'Pengaturan Umum', icon: <Settings /> },
    { href: '/admin/users', label: 'Manajemen User', icon: <Users /> },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <Logo companyName="Admin" />
           <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                  <Link href={item.href} onClick={() => pathname !== item.href && startLoading()}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    isActive={pageNavItems.some(item => pathname.startsWith(item.href))}
                    tooltip="Halaman"
                  >
                    <FileText />
                    <span>Halaman</span>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="right" sideOffset={10}>
                  {pageNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} onClick={() => pathname !== item.href && startLoading()}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <SidebarMenuSub>
                 {pageNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuSubButton asChild isActive={pathname.startsWith(item.href)}>
                            <Link href={item.href} onClick={() => pathname !== item.href && startLoading()}>
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                 ))}
              </SidebarMenuSub>
            </SidebarMenuItem>


            {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                        <Link href={item.href} onClick={() => pathname !== item.href && startLoading()}>
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}

          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <form action={logout} className="w-full">
                    <SidebarMenuButton tooltip="Logout" onClick={startLoading}>
                        <LogOut/>
                        <span>Logout</span>
                    </SidebarMenuButton>
                </form>
            </SidebarMenuItem>
            <div className="text-center text-xs text-muted-foreground p-2 group-data-[collapsible=icon]:hidden">
                Crafted by <a href="https://c-ss.co.id" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-foreground underline">Creative Software Solution</a>
            </div>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
