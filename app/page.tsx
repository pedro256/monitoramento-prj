"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div>
        <p>APP</p>
        <ul>
          <li>
            <Link href="/register">Cadastrar</Link>
          </li>
          <li>
            <Link href="/auth">Login</Link>
          </li>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
