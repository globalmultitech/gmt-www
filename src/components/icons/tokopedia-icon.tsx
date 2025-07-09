import { cn } from "@/lib/utils";

export const TokopediaIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        fill="currentColor"
        className={cn("text-green-600", className)}
        {...props}
    >
        <path d="M211,48H45A13,13,0,0,0,32,61V204a13,13,0,0,0,13,13H211a13,13,0,0,0,13-13V61A13,13,0,0,0,211,48ZM174.6,184H81.4a4,4,0,0,1-3.9-4.8l17.4-65.7a4,4,0,0,1,3.9-3.2h61.4a4,4,0,0,1,3.9,3.2l17.4,65.7A4,4,0,0,1,174.6,184Z"></path>
        <path d="M141,128.5a12.8,12.8,0,0,1-25.6,0V88a4,4,0,0,1,8,0v40.5a4.8,4.8,0,1,0,9.6,0V88a4,4,0,0,1,8,0Z"></path>
    </svg>
);