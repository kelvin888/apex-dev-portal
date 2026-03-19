"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Key,
  Settings,
  FileText,
  HelpCircle,
  X,
  Users,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const developerNav = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Apps", href: "/dashboard/apps", icon: Package },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "API Keys", href: "/dashboard/keys", icon: Key },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminNav = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Apps", href: "/dashboard/admin/apps", icon: ClipboardList },
  { name: "Developers", href: "/dashboard/admin/developers", icon: Users },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const resources = [
  { name: "Documentation", href: "/docs", icon: FileText },
  { name: "Support", href: "/support", icon: HelpCircle },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigation = isAdmin ? adminNav : developerNav;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              {isAdmin ? (
                <ShieldCheck className="h-4 w-4 text-white" />
              ) : (
                <span className="text-white font-bold text-sm">A</span>
              )}
            </div>
            <span className="font-semibold text-lg">
              {isAdmin ? "Admin" : "APEX"}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-6 pb-2">
            <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Resources
            </div>
          </div>

          {resources.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom card — upgrade for developers, admin badge for admins */}
        <div className="p-4 border-t">
          {isAdmin ? (
            <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <div className="text-sm font-medium">Admin Console</div>
              </div>
              <div className="text-xs opacity-90 mt-1">
                Full platform access
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
              <div className="text-sm font-medium">Free Plan</div>
              <div className="text-xs opacity-90 mt-1">3 of 5 apps used</div>
              <Link
                href="/dashboard/settings/billing"
                className="mt-3 block text-center text-sm font-medium bg-white text-primary-600 rounded-lg px-3 py-1.5 hover:bg-primary-50 transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
