'use client';

import { useState, useEffect } from 'react';
import { useConduit } from '@/lib/useConduit';
import { EventCard } from '@/components/event-card';
import { Search, Sparkles, ArrowRight, Filter, Zap } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  const { events, loadAllEvents, loading } = useConduit();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadAllEvents();
  }, [loadAllEvents]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'hackathon', label: '🔥 Hackathons' },
    { value: 'conference', label: '🎤 Conferences' },
    { value: 'meetup', label: '👋 Meetups' },
    { value: 'workshop', label: '📚 Workshops' },
    { value: 'defi', label: '💰 DeFi' },
    { value: 'nft', label: '🖼 NFTs' },
    { value: 'ai', label: '🤖 AI' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Hero */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                On-Chain Events
              </h1>
              <p className="text-gray-400 text-lg">
                NFT tickets you can verify right now. Every ticket is unique, 
                transfer-resistant, and royalty-enforced.
              </p>
            </div>
            <Link href="/create">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium inline-flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="h-4 w-4" />
                Create Event
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
              !selectedCategory
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Events
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading events...' : `${filteredEvents.length} events on-chain`}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Zap className="h-3 w-3 text-emerald-400" />
            All tickets verified on Sui
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Scanning the chain...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-white/5 items-center justify-center mb-6">
              <Search className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {events.length === 0 
                ? "Be the first to create an on-chain event. It's free."
                : "Try a different search or filter."
              }
            </p>
            {events.length === 0 && (
              <Link href="/create">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium inline-flex items-center gap-2">
                  Create First Event
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
