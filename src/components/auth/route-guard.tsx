"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

type RouteGuardProps = {
  children: ReactNode;
  mode: "protected" | "guest";
};

export function RouteGuard({ children, mode }: RouteGuardProps) {
  const router = useRouter();
  const { data, isPending } = useCurrentUser();

  const isAuthenticated = Boolean(data?.user);

  const shouldRedirect =
    !isPending &&
    ((mode === "protected" && !isAuthenticated) ||
      (mode === "guest" && isAuthenticated));

  useEffect(() => {
    if (!shouldRedirect) return;

    router.replace(mode === "protected" ? "/auth/login" : "/dashboard");
  }, [mode, router, shouldRedirect]);

  if (isPending || shouldRedirect) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
