"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Menu,
    ChevronLeft,
    ChevronRight,
    Search,
    Images,
    TicketPercent
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AdminSidebar({ className }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            active: pathname === "/admin",
        },
        {
            label: "Orders",
            icon: ShoppingCart,
            href: "/admin/orders",
            active: pathname.startsWith("/admin/orders"),
        },
        {
            label: "Products",
            icon: Package,
            href: "/admin/products",
            active: pathname.startsWith("/admin/products"),
        },
        {
            label: "Hero Slides",
            icon: Images,
            href: "/admin/hero",
            active: pathname.startsWith("/admin/hero"),
        },
        {
            label: "Coupons",
            icon: TicketPercent,
            href: "/admin/coupons",
            active: pathname.startsWith("/admin/coupons"),
        },

    ];

    const SidebarContent = () => (
        <div className="space-y-4 py-4">
            <div className={cn("px-3 py-2", collapsed ? "text-center" : "")}>
                <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight transition-all", collapsed && "hidden")}>
                    Admin
                </h2>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Button
                            key={route.href}
                            variant={route.active ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                collapsed ? "justify-center px-2" : "px-4"
                            )}
                            asChild
                        >
                            <Link href={route.href}>
                                <route.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                                {!collapsed && route.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "hidden border-r bg-muted/40 md:block transition-all duration-300",
                    collapsed ? "w-[80px]" : "w-64",
                    className
                )}
            >
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
                        {!collapsed && <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package className="h-6 w-6" />
                            <span className="">Uphaar</span>
                        </Link>}
                        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
                            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    </div>
                    <ScrollArea className="flex-1">
                        <SidebarContent />
                    </ScrollArea>
                </div>
            </div>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden fixed left-4 top-4 z-40"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package className="h-6 w-6" />
                            <span className="sr-only">Uphaar Inc</span>
                        </Link>
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                                    route.active ? "bg-muted text-foreground" : "text-muted-foreground"
                                )}
                            >
                                <route.icon className="h-5 w-5" />
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    );
}
