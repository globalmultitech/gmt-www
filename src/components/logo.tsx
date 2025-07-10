import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className, companyName = "Global Multi Technology", logoUrl }: { className?: string, companyName?: string, logoUrl?: string | null }) {
  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      {logoUrl ? (
        <Image src={logoUrl} alt={`Logo ${companyName}`} width={140} height={40} className="h-full w-auto object-contain" priority/>
      ) : (
        <>
          <svg className="h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"></path></svg>
          <span className="font-headline font-extrabold text-3xl text-inherit tracking-wide">
            Execoore
          </span>
        </>
      )}
    </Link>
  );
}
