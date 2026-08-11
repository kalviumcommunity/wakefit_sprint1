'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ClipboardList, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function AdminOrdersReturnsPage() {
  const [activeSection, setActiveSection] = useState<'returns' | 'orders'>('returns');
  const [returns, setReturns] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'returns') {
        const res = await fetch('/api/admin/returns');
        if (res.ok) setReturns(await res.json());
      } else {
        const res = await fetch('/api/admin/orders');
        if (res.ok) setOrders(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReturnStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/returns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders & Returns Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review, approve, or reject customer requests</p>
        </div>

        {/* Section Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSection('returns')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'returns'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Return Requests
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'orders'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Customer Orders
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading records...</div>
        ) : activeSection === 'returns' ? (
          /* Return Requests Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Return ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Product / Reason</th>
                  <th className="py-3.5 px-6">Pickup Date & Slot</th>
                  <th className="py-3.5 px-6">Refund Method</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                      <div>{ret.id}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Order: {ret.orderId}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white">{ret.user?.name}</div>
                      <div className="text-[10px] text-slate-400">{ret.user?.email}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {ret.order?.orderItems[0]?.product?.name || 'Wakefit Product'}
                      </div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{ret.reason}</div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      <div>{ret.pickupDate ? new Date(ret.pickupDate).toISOString().split('T')[0] : 'N/A'}</div>
                      <div className="text-[10px] text-slate-400">{ret.timeSlot}</div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                      {ret.refundMethod}
                    </td>

                    <td className="py-4 px-6 font-bold">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          ret.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-600'
                            : ret.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-600'
                            : ret.status === 'REJECTED'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {ret.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ret.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateReturnStatus(ret.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateReturnStatus(ret.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {ret.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateReturnStatus(ret.id, 'COMPLETED')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* All Orders Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Order Date</th>
                  <th className="py-3.5 px-6 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">{ord.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white">{ord.user?.name}</div>
                      <div className="text-[10px] text-slate-400">{ord.user?.email}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      ₹{ord.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 font-semibold">{ord.status}</td>
                    <td className="py-4 px-6 text-slate-400">{new Date(ord.createdAt).toISOString().split('T')[0]}</td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
