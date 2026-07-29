"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutAuthenticatedBase from "./_components/layout-authenticated-base";
import { useAuth } from "@/lib/auth/auth-context";
import LoadingIco from "@/components/loading-ico";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/unauthorized");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8">
          <LoadingIco />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <LayoutAuthenticatedBase>{children}</LayoutAuthenticatedBase>;
}
