
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

import { useState } from "react";
import {
    Activity,
    Cpu,
    Chrome as Home,
    X
} from "lucide-react";


export default function SidebarOrganization() {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const navigation = [
        { name: "Visão Geral", href: `dashboard`, icon: Home },
        { name: "Dispositivos", href: `devices`, icon: Cpu },
        { name: "Monitoramento", href: `monitoring`, icon: Activity },
        // { name: "Configurações", href: "/settings", icon: Settings },
    ];


    return (
        <div>
            <div
                className="fixed inset-y-0 left-0 z-50 h-screen border-l w-72 flex-none bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
                style={{
                    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                }}
            >
                <div className="flex h-full flex-col">
                    <div className="lg:hidden flex h-16 items-center justify-between px-6 border-b border-border">

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className=" text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-6">
                        {navigation.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/dashboard" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/50",
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <div className="hover:bg-destructive border border-destructive rounded-lg p-2" onClick={() => signOut()}>
                            <p className="text-xs text-muded hover:text-destructive-foreground mb-1 text-center">SAIR</p>
                        </div>
                    </div>
                </div>
            </div>


            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

        </div>
    )
}