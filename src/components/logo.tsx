import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className, companyName = "Global Multi Technology", logoUrl }: { className?: string, companyName?: string, logoUrl?: string | null }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 h-8', className)}>
      {logoUrl ? (
        <Image src={logoUrl} alt={`Logo ${companyName}`} width={140} height={32} className="h-full w-auto object-contain" priority/>
      ) : (
        <>
          <svg
            className="h-8 w-auto text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
            <path d="M22 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
          </svg>
          <span className="hidden sm:inline-block font-headline font-bold text-xl text-primary">
            {companyName}
          </span>
        </>
      )}
    </Link>
  );
}
