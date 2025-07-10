import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
    icon: ReactNode;
    title: string;
    description: string;
    href: string;
}

export function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
    return (
        <Link href={href} className="group block relative p-8 rounded-lg overflow-hidden bg-secondary border border-border hover:border-primary transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-2">
            <div 
                className="absolute -inset-px rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{
                    background: 'linear-gradient(to right, transparent, hsl(var(--primary)), transparent)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                }}
            ></div>
            <div className="relative z-10">
                <div className="absolute top-6 right-6 text-primary/30 group-hover:text-primary transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="font-headline font-bold text-2xl mb-4 mt-12">{title}</h3>
                <p className="text-muted-foreground mb-6 h-24">{description}</p>
                <div className="font-semibold flex items-center gap-2 text-primary">
                    Read More <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}
