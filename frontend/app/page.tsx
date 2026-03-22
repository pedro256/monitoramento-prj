"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
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
            <Link href="/organization">Organizações</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
