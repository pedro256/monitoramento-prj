"use client";
import {
  Menu,
  Bell,
  Cpu
} from "lucide-react";

import ProfileHeaderArea from "./profile-header-area";



export default function LayoutAuthenticatedBase({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="h-screen min-w-screen text-foreground overflow-hidden">
      <header className="bg-card sticky z-40 flex h-16  w-full items-center justify-between border-b border-border backdrop-blur-sm px-6">

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-gray-900" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Sistema
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-primary/25 hover:text-text-primary rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 animate-spin bg-red-500 rounded-full" />
          </button>
          <ProfileHeaderArea />
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
