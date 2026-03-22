"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfileHeaderArea() {
  const { data } = useSession();
  if (!data) {
    return undefined;
  }

  const handledEmail = data.user?.email.split("@")[0] || "[Usuário]";

  return (
    <Popover>
      <PopoverTrigger>
        <div
          title={handledEmail}
          className="p-2 hover:text-text-secondary hover:bg-background rounded-lg transition-colors"
        >
          <User className="w-5 h-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 border border-border">
        <div className="flex gap-2 text-foreground">
          <User />
          <p>{handledEmail}</p>
        </div>
        <span className="text-xs text-text-muted">{data.user?.email}</span>
        <div className="flex flex-col mt-3 text-xs gap-1">
          <Link href="settings" className="border border-border px-1 py-2  rounded hover:bg-background/50">
            <p className="text-center">
              Configurações
            </p>
          </Link>
          <div onClick={() => signOut()} className="border border-destructive/25 px-1 py-2  rounded hover:bg-background/50">
            <p className="text-center">Sair</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
