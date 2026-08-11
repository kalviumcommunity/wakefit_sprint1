'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, ShoppingBag, RotateCcw, DollarSign, Package, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-md">
            Admin Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Admin Overview & Analytics
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading admin analytics...</div>
      ) : (
        <div className="space-y-8">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Total Users</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats?.totalUsers || 0}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Total Orders</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats?.totalOrders || 0}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Total Returns</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats?.totalReturns || 0}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950 text-pink-600 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Total Revenue</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Returns Status Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Returns Breakdown</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">Pending</span>
                  <div className="text-2xl font-black text-amber-800 dark:text-amber-200 mt-1">{stats?.returnsByStatus?.PENDING || 0}</div>
                </div>
                <Clock className="w-6 h-6 text-amber-500" />
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Approved</span>
                  <div className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-1">{stats?.returnsByStatus?.APPROVED || 0}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>

              <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase">Rejected</span>
                  <div className="text-2xl font-black text-red-800 dark:text-red-200 mt-1">{stats?.returnsByStatus?.REJECTED || 0}</div>
                </div>
                <XCircle className="w-6 h-6 text-red-500" />
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Completed</span>
                  <div className="text-2xl font-black text-blue-800 dark:text-blue-200 mt-1">{stats?.returnsByStatus?.COMPLETED || 0}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/admin/users"
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all block"
            >
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Manage Users →</h4>
              <p className="text-xs text-slate-400 mt-1">View user list, change roles, inspect activity</p>
            </Link>

            <Link
              href="/admin/orders-returns"
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all block"
            >
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Orders & Returns →</h4>
              <p className="text-xs text-slate-400 mt-1">Approve/reject return requests & update order status</p>
            </Link>

            <Link
              href="/admin/products"
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all block"
            >
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Manage Products →</h4>
              <p className="text-xs text-slate-400 mt-1">Add new furniture items, toggle stock, edit prices</p>
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
