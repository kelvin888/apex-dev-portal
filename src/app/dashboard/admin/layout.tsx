"use client";

import { useRoleGuard } from "@/lib/auth-context";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useRoleGuard("admin");
  return <>{children}</>;
}
