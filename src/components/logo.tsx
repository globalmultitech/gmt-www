import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className, companyName = "Global Multi Technology", logoUrl }: { className?: string, companyName?: string, logoUrl?: string | null }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 h-10', className)}>
      {logoUrl ? (
        <Image src={logoUrl} alt={`Logo ${companyName}`} width={140} height={40} className="h-full w-auto object-contain" priority/>
      ) : (
        <>
          <svg className="h-10 w-10 text-primary" width="51" height="48" viewBox="0 0 51 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38.8159 0.403809L49.5226 23.9535L38.8159 47.5032H12.3168L1.61011 23.9535L12.3168 0.403809H38.8159Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M25.5664 1.60938V47.5033" stroke="currentColor" strokeWidth="2"/>
            <path d="M1.61011 23.9536H49.5226" stroke="currentColor" strokeWidth="2"/>
            <path d="M12.3168 47.5033L38.8159 0.403814" stroke="currentColor" strokeWidth="2"/>
            <path d="M12.3168 0.403809L38.8159 47.5033" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="font-headline font-black text-3xl tracking-tighter">
            {companyName}
          </span>
        </>
      )}
    </Link>
  );
}
