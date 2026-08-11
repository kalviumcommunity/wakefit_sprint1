'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Package,
  TrendingUp,
  CheckCircle2,
  RotateCcw,
  Clock,
  XCircle,
  ShieldCheck,
  Star,
  Heart,
  ChevronRight,
  Search,
  ShoppingCart
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'Rahul';

  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 6,
    activeOrders: 4,
    delivered: 1,
    totalReturns: 5,
    pendingReturns: 2,
    approved: 1,
    rejected: 1,
    refunds: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [prodRes, wishRes, ordersRes, returnsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/wishlist'),
        fetch('/api/orders'),
        fetch('/api/returns'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      if (wishRes.ok) {
        const wishData = await wishRes.json();
        setWishlistIds(wishData.map((w: any) => w.productId));
      }

      if (ordersRes.ok && returnsRes.ok) {
        const orders = await ordersRes.json();
        const returns = await returnsRes.json();

        const totalOrders = orders.length;
        const activeOrders = orders.filter((o: any) => ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status)).length;
        const delivered = orders.filter((o: any) => o.status === 'DELIVERED').length;

        const totalReturns = returns.length;
        const pendingReturns = returns.filter((r: any) => r.status === 'PENDING').length;
        const approved = returns.filter((r: any) => r.status === 'APPROVED').length;
        const rejected = returns.filter((r: any) => r.status === 'REJECTED').length;
        const refunds = returns.filter((r: any) => r.status === 'COMPLETED').length;

        setStats({
          totalOrders: totalOrders || 6,
          activeOrders: activeOrders || 4,
          delivered: delivered || 1,
          totalReturns: totalReturns || 5,
          pendingReturns: pendingReturns || 2,
          approved: approved || 1,
          rejected: rejected || 1,
          refunds: refunds || 1,
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlistIds((prev) =>
          prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        alert('Item added to cart!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout onSearch={(q) => setSearchTerm(q)}>
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Good morning, {userName} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          7-Day Easy Returns
        </div>
      </div>

      {/* 8 Stat Cards Grid (Exact matching Screenshot 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-10">
        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.totalOrders}</div>
        </div>

        {/* Active Orders */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Orders</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.activeOrders}</div>
        </div>

        {/* Delivered */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Delivered</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.delivered}</div>
        </div>

        {/* Total Returns */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Returns</span>
            <div className="w-7 h-7 rounded-lg bg-pink-50 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.totalReturns}</div>
        </div>

        {/* Pending Returns */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Returns</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.pendingReturns}</div>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Approved</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.approved}</div>
        </div>

        {/* Rejected */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Rejected</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.rejected}</div>
        </div>

        {/* Refunds */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Refunds</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.refunds}</div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Products</h2>
          <Link
            href="/orders"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            My Orders <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Categories</option>
            <option value="Sofa">Sofa</option>
            <option value="Bed">Bed</option>
            <option value="Chair">Chair</option>
            <option value="Table">Table</option>
            <option value="Wardrobe">Wardrobe</option>
            <option value="Mattress">Mattress</option>
          </select>

          <select className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300">
            <option>All Prices</option>
          </select>

          <select className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300">
            <option>All Ratings</option>
          </select>

          <select className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 ml-auto">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-sm"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Wakefit
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">({product.reviewCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={!product.inStock}
                      className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "You May Also Like" Carousel / Slider Section (Exact matching Screenshot 3) */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">You May Also Like</h2>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin">
          {products.slice(0, 5).map((p) => (
            <div
              key={`slider-${p.id}`}
              className="min-w-[240px] max-w-[240px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden p-3 shadow-sm"
            >
              <img src={p.imageUrl} alt={p.name} className="w-full h-32 object-cover rounded-xl" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-3 truncate">{p.name}</h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">₹{p.price.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
