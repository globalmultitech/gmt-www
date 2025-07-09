
'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type AppShellProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export function AppShell({ header, footer, children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  const showHeaderFooter = !isAdminRoute && !isLoginRoute;

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      {showHeaderFooter && header}
      <main className="flex-1">{children}</main>
      {showHeaderFooter && footer}
    </div>
  );
}
