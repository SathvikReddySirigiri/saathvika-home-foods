"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteShell } from "./SiteShell";

export function ConditionalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return <SiteShell>{children}</SiteShell>;
}
