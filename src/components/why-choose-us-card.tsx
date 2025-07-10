import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type WhyChooseUsCardProps = {
    icon: ReactNode;
    title: string;
    description: string;
}

export function WhyChooseUsCard({ icon, title, description }: WhyChooseUsCardProps) {
    return (
        <Card className="text-center p-8 bg-background shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="inline-block p-5 bg-primary/10 text-primary rounded-full mb-6">
                {icon}
            </div>
            <CardTitle className="font-headline text-2xl mb-2">{title}</CardTitle>
            <p className="text-muted-foreground">{description}</p>
        </Card>
    )
}
