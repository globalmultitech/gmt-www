import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className, companyName = "Global Multi Technology" }: { className?: string, companyName?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
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
    </Link>
  );
}
