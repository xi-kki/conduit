'use client';

import { useState } from 'react';
import { useConduit } from '@/lib/useConduit';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Percent, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Check,
} from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent, isConnected, connectWallet } = useConduit();
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    ticketPrice: 0,
    totalSupply: 100,
    royaltyBps: 1000,
    maxResalePrice: 0,
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      connectWallet();
      return;
    }
    
    setSubmitting(true);
    try {
      const txBytes = await createEvent({
        name: form.name,
        description: form.description,
        imageUrl: "",
        startTime: Math.floor(new Date(form.date).getTime() / 1000),
        endTime: form.endDate ? Math.floor(new Date(form.endDate).getTime() / 1000) : Math.floor(new Date(form.date).getTime() / 1000) + 86400,
        venue: form.location,
        ticketPrice: form.ticketPrice * 1_000_000_000,
        resalePriceCap: form.maxResalePrice * 1_000_000_000,
        totalSupply: form.totalSupply,
        royaltyBps: form.royaltyBps,
        category: "",
      });
      setCreated(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (created) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 items-center justify-center mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Created!</h1>
          <p className="text-gray-400">Your event is now live on Sui testnet.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Hero */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Your Event
          </h1>
          <p className="text-gray-400 text-lg">
            Fraud-proof tickets in under 5 minutes. No coding required.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Sui Builder House NYC"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Tell attendees what to expect..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              />
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="e.g. NYC, Online, ETH Denver"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Pricing & Supply */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Ticket Price (SUI)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.ticketPrice}
                  onChange={(e) => update('ticketPrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 for free events</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Total Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.totalSupply}
                  onChange={(e) => update('totalSupply', parseInt(e.target.value) || 100)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Percent className="inline h-4 w-4 mr-1" />
                  Royalty (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={form.royaltyBps / 100}
                  onChange={(e) => update('royaltyBps', Math.round(parseFloat(e.target.value) * 100) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">You earn on every resale</p>
              </div>
            </div>

            {/* Max Resale Price */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Max Resale Price (SUI) — Optional
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.maxResalePrice}
                onChange={(e) => update('maxResalePrice', parseFloat(e.target.value) || 0)}
                placeholder="Leave 0 for no cap"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Set a ceiling to prevent scalper pricing</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !form.name || !form.date}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deploying to Sui...
                </>
              ) : !isConnected ? (
                'Connect Wallet to Continue'
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Create Event
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Sidebar — Benefits */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">What You Get</h3>
              <ul className="space-y-3">
                {[
                  { icon: <Shield className="h-4 w-4 text-emerald-400" />, text: 'Impossible to counterfeit' },
                  { icon: <Zap className="h-4 w-4 text-amber-400" />, text: '<2 second door verification' },
                  { icon: <Percent className="h-4 w-4 text-purple-400" />, text: 'Automatic royalty on every resale' },
                  { icon: <Users className="h-4 w-4 text-cyan-400" />, text: 'Real-time attendance tracking' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    {item.icon}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Free Forever</h3>
              <p className="text-sm text-gray-400">
                No platform fees. No hidden costs. You only pay the Sui network gas — usually less than $0.01.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
