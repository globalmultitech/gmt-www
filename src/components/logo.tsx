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
        <>
          <Image src={logoUrl} alt={`Logo ${companyName}`} width={50} height={50} className="h-10 w-10 md:h-12 md:w-12 object-contain" priority/>
           <span className={cn(
            "font-headline font-extrabold text-2xl md:text-3xl tracking-wide transition-colors"
           )}>
            {companyName}
          </span>
        </>
      ) : (
        <span className={cn(
          "font-headline font-extrabold text-3xl tracking-wide transition-colors"
        )}>
          {companyName}
        </span>
      )}
    </Link>
  );
}
