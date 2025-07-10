import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className, companyName = "Global Multi Technology", logoUrl, isScrolled = true }: { className?: string, companyName?: string, logoUrl?: string | null, isScrolled?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      {logoUrl ? (
        <Image src={logoUrl} alt={`Logo ${companyName}`} width={140} height={40} className="h-full w-auto object-contain" priority/>
      ) : (
        <span className={cn(
          "font-headline font-extrabold text-3xl tracking-wide transition-colors",
          isScrolled ? 'text-foreground' : 'text-white'
        )}>
          Execoore
        </span>
      )}
    </Link>
  );
}
