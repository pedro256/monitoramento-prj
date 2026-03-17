import React from "react";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LayoutAuthenticatedBase from "./_components/layout-authenticated-base";
import AuthProvider from "./_providers/auth-provider";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log(session)
  if(!session){
    return redirect("/unauthorized")
  }
  if (session?.error === "TokenExpired") {
    return redirect("/signout?reasion=TokenExpired");
  }
  return (
    <main>
      <AuthProvider>
        <LayoutAuthenticatedBase>
          {children}
        </LayoutAuthenticatedBase>
      </AuthProvider>
    </main>
  );
}
