"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
/**
 * @description RODAR DO LADO DO CLIENT
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return(<SessionProvider>{children}</SessionProvider>);
}
