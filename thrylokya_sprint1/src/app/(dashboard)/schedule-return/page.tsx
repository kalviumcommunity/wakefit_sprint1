'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { Sun, Sunset, Moon, Clock, Check } from 'lucide-react';

export default function ScheduleReturnPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedRefundMethod, setSelectedRefundMethod] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSchedulePickup = async () => {
    setError('');
    if (!selectedOrderId) {
      setError('Please select an order');
      return;
    }
    if (!pickupDate) {
      setError('Please select a pickup date');
      return;
    }
    if (!selectedSlot) {
      setError('Please select a pickup time slot');
      return;
    }
    if (!selectedReason) {
      setError('Please select a return reason');
      return;
    }
    if (!selectedRefundMethod) {
      setError('Please select a refund method');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderId,
          pickupDate,
          timeSlot: selectedSlot,
          reason: selectedReason,
          refundMethod: selectedRefundMethod,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to schedule return');
        setLoading(false);
        return;
      }

      router.push('/returns');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const reasons = [
    'Product damaged on arrival',
    'Wrong product delivered',
    'Color / size mismatch',
    'Quality not as expected',
    'Changed my mind',
    'Product not working',
    'Missing parts / accessories',
    'Other',
  ];

  const timeSlots = [
    {
      id: 'Morning',
      label: 'Morning',
      time: '9:00 AM - 12:00 PM',
      icon: Sun,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 'Afternoon',
      label: 'Afternoon',
      time: '12:00 PM - 4:00 PM',
      icon: Sunset,
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40',
    },
    {
      id: 'Evening',
      label: 'Evening',
      time: '4:00 PM - 8:00 PM',
      icon: Moon,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
  ];

  const refundMethods = [
    {
      id: 'Original Payment Method',
      title: 'Original Payment Method',
      subtitle: 'Refund to the original payment source (3-5 business days)',
    },
    {
      id: 'Wakefit Wallet Credit',
      title: 'Wakefit Wallet Credit',
      subtitle: 'Instant credit to your Wakefit wallet for future purchases',
    },
    {
      id: 'Bank Transfer / NEFT',
      title: 'Bank Transfer / NEFT',
      subtitle: 'Transfer to your registered bank account (5-7 business days)',
    },
  ];

  // Helper date limits (next 7 days)
  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Schedule a Return
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Returns must be scheduled within 7 days of delivery. Select a pickup date and time that works for you.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Select Order */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Select Order</h3>
            </div>

            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">-- Select a delivered order --</option>
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  {ord.id} - {ord.orderItems[0]?.product?.name || 'Order'} (₹{ord.totalPrice})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Choose Pickup Date */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose Pickup Date</h3>
            </div>

            <input
              type="date"
              min={today}
              max={maxDate}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-[11px] text-slate-400">Pickup can be scheduled within the next 7 days.</p>
          </div>

          {/* Step 3: Select Pickup Time Slot */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Select Pickup Time Slot</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {timeSlots.map((slot) => {
                const Icon = slot.icon;
                const isSelected = selectedSlot === `${slot.label} (${slot.time})`;
                return (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setSelectedSlot(`${slot.label} (${slot.time})`)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${slot.color} flex items-center justify-center mb-2`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{slot.label}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{slot.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Return Reason */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Return Reason</h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {reasons.map((r) => {
                const isSelected = selectedReason === r;
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setSelectedReason(r)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Choose Refund Method */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                5
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose Refund Method</h3>
            </div>

            <div className="space-y-3">
              {refundMethods.map((m) => {
                const isSelected = selectedRefundMethod === m.id;
                return (
                  <label
                    key={m.id}
                    onClick={() => setSelectedRefundMethod(m.id)}
                    className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="refundMethod"
                      checked={isSelected}
                      onChange={() => setSelectedRefundMethod(m.id)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.subtitle}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Return Summary Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Return Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Order</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedOrderId || '—'}</div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="text-slate-400 font-medium">Pickup Date</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{pickupDate || '—'}</div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="text-slate-400 font-medium">Time Slot</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedSlot || '—'}</div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="text-slate-400 font-medium">Refund Method</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRefundMethod || '—'}</div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="text-slate-400 font-medium">Reason</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedReason || '—'}</div>
            </div>
          </div>

          <button
            onClick={handleSchedulePickup}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <Clock className="w-4 h-4" /> {loading ? 'Scheduling...' : 'Schedule Pickup'}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            You will receive a confirmation SMS & email.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
