"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect } from "react";

export default function SignOutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div>
      ...
    </div>
  );
}
