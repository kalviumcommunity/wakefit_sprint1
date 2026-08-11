'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function MyCartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQty: number) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="py-24 text-center text-slate-400">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        /* Empty Cart State (Exact match to Screenshot Page 5) */
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-6">
            <ShoppingBag className="w-9 h-9" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Your cart is empty
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8">
            Browse our collection and add items
          </p>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-600/25 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Cart with Items */
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 items-center shadow-sm"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-2xl bg-slate-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.product.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Category: {item.product.category}</p>
                    <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-2">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-fit space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Summary</h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{(subtotal * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{(subtotal * 1.18).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href="/orders"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all mt-4 block text-center"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
