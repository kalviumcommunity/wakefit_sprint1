'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Phone, Mail, MessageSquare, ChevronDown, Send, CheckCircle2 } from 'lucide-react';

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticket, setTicket] = useState({
    category: 'Order Issue',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const faqs = [
    {
      q: 'How do I track my order?',
      a: 'You can track your order status in real-time under the "My Orders" tab on your dashboard.',
    },
    {
      q: 'What is the return policy?',
      a: 'Wakefit offers a 7-day hassle-free return policy from the date of product delivery for eligible items.',
    },
    {
      q: 'How long does refund take?',
      a: 'Original payment refunds take 3-5 business days, Bank transfers take 5-7 business days, while Wakefit Wallet credit is instant.',
    },
    {
      q: 'Can I cancel my order?',
      a: 'Orders can be cancelled directly from the "My Orders" page before they enter the processing or shipping stage.',
    },
    {
      q: 'How do I schedule a pickup for return?',
      a: 'Go to "Schedule Return" in the sidebar, select your delivered order, choose your preferred pickup date, time slot, reason, and refund method.',
    },
    {
      q: 'Is COD available for all products?',
      a: 'Cash on Delivery (COD) is available for select pincodes and product categories up to ₹50,000.',
    },
    {
      q: 'What if my product arrives damaged?',
      a: 'Please report damaged deliveries within 48 hours by scheduling a return or submitting a ticket below with photos.',
    },
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedId(data.ticketId);
        setTicket({ category: 'Order Issue', subject: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
        <p className="text-xs text-slate-400 mt-1">
          We are here to help. Reach out or browse our FAQs.
        </p>
      </div>

      {/* Top 3 Contact Cards (Exact match to Screenshot Pages 11 & 12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Call Us */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Call Us</h3>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">1800-XXX-XXXX</p>
            <p className="text-[11px] text-slate-400 mt-1">Mon–Sat, 9am–8pm</p>
          </div>
        </div>

        {/* Email Us */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Us</h3>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">support@wakefit.com</p>
            <p className="text-[11px] text-slate-400 mt-1">Response within 24 hours</p>
          </div>
        </div>

        {/* Live Chat */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Chat</h3>
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">Chat with an agent</p>
            <p className="text-[11px] text-slate-400 mt-1">Usually replies in minutes</p>
          </div>
        </div>
      </div>

      {/* Main Grid: FAQs + Submit Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Frequently Asked Questions */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Submit a Ticket Form Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Submit a Ticket
          </h2>

          {submittedId && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Ticket {submittedId} submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Category
              </label>
              <select
                value={ticket.category}
                onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              >
                <option value="Order Issue">Order Issue</option>
                <option value="Return / Refund Request">Return / Refund Request</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Payment Problem">Payment Problem</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                required
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Message *
              </label>
              <textarea
                required
                rows={4}
                value={ticket.message}
                onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                placeholder="Describe your issue in detail. Include order IDs if applicable..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Average response time: under 24 hours
            </p>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
