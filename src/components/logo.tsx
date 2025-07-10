import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

type LogoProps = {
  className?: string;
  companyName?: string;
  logoUrl?: string | null;
};

export function Logo({ className, companyName = "Global Multi Technology", logoUrl }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      {logoUrl ? (
        <Image src={logoUrl} alt={`Logo ${companyName}`} width={140} height={40} className="h-8 md:h-10 w-auto object-contain" priority/>
      ) : (
        <span className={cn(
          "font-headline font-extrabold text-3xl tracking-wide transition-colors text-foreground"
        )}>
          {companyName}
        </span>
      )}
    </Link>
  );
}
