'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Download,
  X,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

export default function MyReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, [activeTab, searchQuery]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/returns', window.location.origin);
      if (activeTab !== 'All') url.searchParams.append('status', activeTab);
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setReturns(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReturn = async (id: string) => {
    if (!confirm('Cancel this return request?')) return;
    try {
      const res = await fetch(`/api/returns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL' }),
      });
      if (res.ok) {
        fetchReturns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Rejected
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Completed
          </span>
        );
      default:
        return <span className="text-xs font-semibold text-slate-500">{status}</span>;
    }
  };

  return (
    <DashboardLayout onSearch={(q) => setSearchQuery(q)}>
      {/* Top Breadcrumb Link */}
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Returns</h1>
          <p className="text-xs text-slate-400 mt-1">{returns.length} total return requests</p>
        </div>

        <Link
          href="/schedule-return"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 inline-flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" /> Schedule Return
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or product..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select className="bg-transparent focus:outline-none cursor-pointer">
              <option>All</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select className="bg-transparent focus:outline-none cursor-pointer">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Returns Data Table (Exact match to Screenshot Page 7) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading return requests...</div>
        ) : returns.length === 0 ? (
          <div className="py-16 text-center">
            <RotateCcw className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">No return requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Return Date</th>
                  <th className="py-3.5 px-6">Delivery Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {returns.map((ret) => {
                  const firstItem = ret.order?.orderItems?.[0];
                  const product = firstItem?.product;
                  const returnDateStr = ret.pickupDate ? new Date(ret.pickupDate).toISOString().split('T')[0] : '2024-11-20';
                  const deliveryDateStr = ret.order?.estDeliveryDate ? new Date(ret.order.estDeliveryDate).toISOString().split('T')[0] : '2024-11-15';

                  return (
                    <tr key={ret.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                        <div>{ret.orderId}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{ret.id}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product?.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'}
                            alt={product?.name || 'Product'}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {product?.name || 'Ortho Comfort 3-Seater Sofa'}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{ret.reason}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                        {returnDateStr}
                      </td>

                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                        {deliveryDateStr}
                      </td>

                      <td className="py-4 px-6">{getStatusBadge(ret.status)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                          <button aria-label="View Details" title="View details" className="p-1.5 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button aria-label="Download Invoice" title="Download slip" className="p-1.5 hover:text-slate-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          {ret.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancelReturn(ret.id)}
                              aria-label="Cancel Return Request"
                              title="Cancel request"
                              className="p-1.5 hover:text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
