'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '../Providers';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Heart,
  RotateCcw,
  Calendar,
  User,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  Users,
  Box,
  ClipboardList
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = session?.user?.role === 'ADMIN';

  const customerNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', href: '/orders', icon: Package },
    { name: 'My Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'My Returns', href: '/returns', icon: RotateCcw },
    { name: 'Schedule Return', href: '/schedule-return', icon: Calendar },
    { name: 'Profile Settings', href: '/profile', icon: User },
    { name: 'Help & Support', href: '/support', icon: HelpCircle },
  ];

  const adminNav = [
    { name: 'Admin Overview', href: '/admin/dashboard', icon: ShieldCheck },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Orders & Returns', href: '/admin/orders-returns', icon: ClipboardList },
    { name: 'Manage Products', href: '/admin/products', icon: Box },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-40 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
            w
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Wakefit
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1 mt-2">
          {customerNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}

          {/* Admin Navigation Section */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Admin Menu
              </div>
              {adminNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-500" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
