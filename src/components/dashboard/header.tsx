'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Menu, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.name}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-20">
                <div className="p-3 border-b">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
                <div className="p-1">
                  <a
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                  <a
                    href="/dashboard/settings/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
