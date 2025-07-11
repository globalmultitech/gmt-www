import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from './ui/sidebar';

type LogoProps = {
  className?: string;
  companyName?: string;
  logoUrl?: string | null;
  scrolled?: boolean;
  variant?: 'default' | 'footer';
};

export function Logo({
  className,
  companyName = 'Global Multi Technology',
  logoUrl,
  scrolled,
  variant = 'default',
}: LogoProps) {
  
  const sidebar = useSidebar();
  
  const imageSizeClasses = {
    default: 'h-16 w-auto',
    footer: 'h-14 w-auto',
  };

  const textSizeClasses = {
    default: 'text-3xl md:text-4xl',
    footer: 'text-3xl md:text-4xl',
  };
  
  const textColorClasses = {
    default: scrolled ? 'text-primary-foreground' : 'text-primary',
    footer: 'text-primary-foreground',
  };

  if (sidebar) {
     const isCollapsed = sidebar.state === 'collapsed';
     return (
        <Link href="/" className={cn('flex items-center gap-2', className)}>
            {logoUrl ? (
                <Image
                    src={logoUrl}
                    alt={`Logo ${companyName}`}
                    width={80}
                    height={80}
                    className={cn('object-contain h-8 w-8', isCollapsed && 'h-10 w-10')}
                    priority
                />
            ) : null}
             <span
                className={cn(
                'font-headline font-extrabold tracking-wide transition-all',
                'text-lg text-foreground',
                isCollapsed && 'opacity-0 w-0'
                )}
            >
                {companyName}
            </span>
        </Link>
     )
  }

  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      {logoUrl ? (
        <>
          <Image
            src={logoUrl}
            alt={`Logo ${companyName}`}
            width={80}
            height={80}
            className={cn('object-contain', imageSizeClasses[variant])}
            priority
          />
          <span
            className={cn(
              'font-headline font-extrabold tracking-wide transition-colors',
              textSizeClasses[variant],
              textColorClasses[variant]
            )}
          >
            {companyName}
          </span>
        </>
      ) : (
        <span
          className={cn(
            'font-headline font-extrabold tracking-wide transition-colors',
            textSizeClasses[variant],
            textColorClasses[variant]
          )}
        >
          {companyName}
        </span>
      )}
    </Link>
  );
}
