import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Users, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary">
        <Sidebar>
            <SidebarContent className="flex flex-col p-2">
                <SidebarHeader>
                    <Logo />
                </SidebarHeader>
                <SidebarMenu className="flex-grow">
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Dashboard" data-active={true}>
                            <Link href="/admin/dashboard">
                                <LayoutDashboard />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="User Management">
                             <Link href="/admin/users">
                                <Users />
                                <span>Manajemen User</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                 <div className="p-2 mt-auto">
                     <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Link>
                    </Button>
                </div>
            </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="bg-background border-b sticky top-0 z-10 p-2 flex items-center md:hidden">
            <SidebarTrigger />
            <span className="font-bold ml-4">Admin Dashboard</span>
          </header>
          <div className="flex-grow p-4 md:p-8 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
