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
    <div className="h-screen min-w-screen bg-[#0a0a0a] text-gray-100 flex">


      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 flex h-16  w-full items-center justify-between border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur-sm px-6">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              Sistema
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <ProfileHeaderArea />
          </div>
        </header>
        <main>
          <div>{children}</div>
        </main>
      </div>


    </div>
  );
}
