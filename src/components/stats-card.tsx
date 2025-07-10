import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
    icon: ReactNode;
    value: string;
    label: string;
}

export function StatsCard({ icon, value, label }: StatsCardProps) {
    return (
        <Card className="p-6 flex items-center gap-4 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
                {icon}
            </div>
            <div>
                <p className="text-3xl font-headline font-extrabold">{value}</p>
                <p className="text-muted-foreground font-medium">{label}</p>
            </div>
        </Card>
    )
}
