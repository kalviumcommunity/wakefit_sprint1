'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchWishlist();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveToCart = async (productId: string, wishlistId: string) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      await removeFromWishlist(wishlistId);
      alert('Moved item to cart!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="py-24 text-center text-slate-400">Loading wishlist...</div>
      ) : wishlistItems.length === 0 ? (
        /* Empty Wishlist State (Exact match to Screenshot Page 6) */
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 rounded-3xl bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-400 mb-6">
            <Heart className="w-9 h-9 fill-pink-400/20" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Your wishlist is empty
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8">
            Save items you love by tapping the heart icon
          </p>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-600/25 transition-all"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        /* Wishlist Items Grid */
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Wishlist</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.product.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">₹{item.product.price.toLocaleString('en-IN')}</p>
                  </div>

                  <button
                    onClick={() => moveToCart(item.product.id, item.id)}
                    className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
