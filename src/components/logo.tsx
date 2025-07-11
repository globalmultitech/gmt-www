import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

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
  const imageSizeClasses = {
    default: 'h-10 w-10 md:h-12 md:w-12',
    footer: 'h-12 w-12 md:h-16 md:w-16',
  };

  const textSizeClasses = {
    default: 'text-2xl md:text-3xl',
    footer: 'text-3xl md:text-4xl',
  };
  
  const textColorClasses = {
    default: scrolled ? 'text-primary-foreground' : 'text-primary',
    footer: 'text-primary-foreground',
  };

  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      {logoUrl ? (
        <>
          <Image
            src={logoUrl}
            alt={`Logo ${companyName}`}
            width={variant === 'footer' ? 64 : 50}
            height={variant === 'footer' ? 64 : 50}
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
