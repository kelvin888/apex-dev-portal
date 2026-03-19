"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard } from "lucide-react";

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isLoading } = useAuth();

  return (
    <>
      {!isLoading && user && (
        <div className="bg-primary-50 border-b border-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-sm">
            <span className="text-primary-700">
              Signed in as <strong>{user.name}</strong>
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-medium"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
