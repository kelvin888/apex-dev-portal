"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard } from "lucide-react";

/**
 * Auth-aware CTA for public page navbars.
 * Logged-in users get a "Continue as {name}" → /dashboard button.
 * Logged-out users get the standard Sign In + Get Started pair.
 */
export function PublicNavActions() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-44 animate-pulse rounded-lg bg-gray-100" />;
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="btn-primary inline-flex items-center gap-2"
      >
        <LayoutDashboard className="h-4 w-4" />
        Continue as {user.name.split(" ")[0]}
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className="text-gray-600 hover:text-gray-900">
        Sign In
      </Link>
      <Link href="/register" className="btn-primary">
        Get Started
      </Link>
    </>
  );
}
