import React from "react";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LayoutAuthenticatedBase from "./_components/layout-authenticated-base";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if(!session){
    return redirect("/unauthorized")
  }
  return (
    <main>
        <LayoutAuthenticatedBase>
          {children}
        </LayoutAuthenticatedBase>
    </main>
  );
}
