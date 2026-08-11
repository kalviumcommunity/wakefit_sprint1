'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Camera, User, Shield, MapPin, CreditCard, Check } from 'lucide-react';

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [formData, setFormData] = useState({
    firstName: 'Rahul',
    lastName: 'Kumar',
    email: 'rahul.kumar@email.com',
    mobile: '9876543210',
    dob: '1992-05-14',
    gender: 'Male',
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        const names = (data.name || 'Rahul Kumar').split(' ');
        setFormData({
          firstName: names[0] || 'Rahul',
          lastName: names.slice(1).join(' ') || 'Kumar',
          email: data.email || 'rahul.kumar@email.com',
          mobile: data.mobile || '9876543210',
          dob: data.dob || '1992-05-14',
          gender: data.gender || 'Male',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          mobile: formData.mobile,
          dob: formData.dob,
          gender: formData.gender,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subTabs = [
    { id: 'Personal Info', label: 'Personal Info', icon: User },
    { id: 'Security', label: 'Security', icon: Shield },
    { id: 'Saved Addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'Payment Methods', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left User Card & Sub-nav (Exact match to Screenshot Page 10) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
          {/* Avatar with Camera Overlay */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              RK
            </div>
            <button
              aria-label="Upload Avatar"
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white border-2 border-white dark:border-slate-900 shadow-md hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {formData.firstName} {formData.lastName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-6">{formData.email}</p>

          {/* Vertical Navigation Tabs */}
          <div className="space-y-1.5 text-left">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          {activeTab === 'Personal Info' ? (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Personal Information
              </h2>

              {saved && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={formData.email}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              {activeTab} content configured.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
