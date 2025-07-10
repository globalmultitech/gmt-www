import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ServiceCardProps = {
    icon: ReactNode;
    title: string;
    description: string;
    href: string;
}

export function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
    return (
        <div className="group bg-background text-card-foreground p-8 rounded-lg text-left shadow-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:-translate-y-2">
            <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                {icon}
            </div>
            <h3 className="font-headline font-bold text-2xl mb-4">{title}</h3>
            <p className="text-muted-foreground mb-6 group-hover:text-primary-foreground/80">{description}</p>
            <Link href={href} className="font-semibold flex items-center gap-2 text-primary group-hover:text-white">
                Read More <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
        </div>
    )
}
