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
    default: 'h-14 w-14 md:h-16 md:w-16',
    footer: 'h-14 w-14 md:h-20 md:w-20',
  };

  const textSizeClasses = {
    default: 'text-3xl md:text-4xl',
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
            width={variant === 'footer' ? 80 : 64}
            height={variant === 'footer' ? 80 : 64}
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
