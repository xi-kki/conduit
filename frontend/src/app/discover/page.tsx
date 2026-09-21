'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  fetchAllExternalEvents,
  CHAIN_INFO,
  type ExternalEvent,
  type ChainTag,
  type EventCategory,
  type EventSource,
} from '@/lib/events-api';

const ALL_CHAINS: ChainTag[] = [
  'multi', 'solana', 'ethereum', 'sui', 'avalanche', 'stellar', 'bitcoin',
  'polkadot', 'cosmos', 'near', 'cardano', 'lisk', 'base', 'arbitrum', 'polygon', 'ton',
];

const CATEGORIES: { label: string; value: EventCategory }[] = [
  { label: 'All', value: 'all' },
  { label: '🔥 Hackathons', value: 'hackathon' },
  { label: '🎤 Conferences', value: 'conference' },
  { label: '👋 Meetups', value: 'meetup' },
  { label: '📚 Workshops', value: 'workshop' },
  { label: '💰 DeFi', value: 'defi' },
  { label: '🖼 NFTs', value: 'nft' },
  { label: '🤖 AI', value: 'ai' },
  { label: '🏛 DAOs', value: 'dao' },
  { label: '🌐 Web3', value: 'web3' },
  { label: '💻 Developer', value: 'developer' },
];

const SOURCE_FILTERS: { label: string; value: EventSource | 'all' }[] = [
  { label: 'All Sources', value: 'all' },
  { label: 'Luma', value: 'luma' },
  { label: 'Eventbrite', value: 'eventbrite' },
  { label: 'ETHGlobal', value: 'ethglobal' },
  { label: 'Solana', value: 'solana' },
  { label: 'Stellar', value: 'stellar' },
  { label: 'Avalanche', value: 'avalanche' },
  { label: 'Bitcoin', value: 'bitcoin' },
];

export default function DiscoverPage() {
  const [events, setEvents] = useState<ExternalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChain, setActiveChain] = useState<ChainTag | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');
  const [activeSource, setActiveSource] = useState<EventSource | 'all'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const filters: any = { limit: 100 };
      if (activeChain !== 'all') filters.chains = [activeChain];
      if (activeCategory !== 'all') filters.categories = [activeCategory];
      if (activeSource !== 'all') filters.source = activeSource;
      if (searchQuery.trim()) filters.search = searchQuery.trim();
      
      const data = await fetchAllExternalEvents(filters);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [activeChain, activeCategory, activeSource]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadEvents();
  };

  // Group by chain
  const eventsByChain = events.reduce((acc, event) => {
    const key = event.chain;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, ExternalEvent[]>);

  // Stats
  const chainStats = ALL_CHAINS.map(chain => ({
    chain,
    count: events.filter(e => e.chain === chain).length,
    info: CHAIN_INFO[chain],
  })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-cyan-500/10 to-blue-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🌐 Multi-Chain Event Discovery
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Find Web3 events across {Object.keys(CHAIN_INFO).length} blockchain ecosystems
          </p>

          {/* Chain Stats */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {chainStats.map(({ chain, count, info }) => (
              <button
                key={chain}
                onClick={() => setActiveChain(activeChain === chain ? 'all' : chain)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  activeChain === chain
                    ? 'text-white ring-2'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                style={activeChain === chain ? { 
                  backgroundColor: info.color + '33',
                  borderColor: info.color,
                  boxShadow: `0 0 12px ${info.color}44`,
                } : {}}
              >
                <span>{info.icon}</span>
                <span>{info.name}</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Search + Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, chains, hackathons..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <div className="flex gap-2">
            <select
              value={activeSource}
              onChange={(e) => setActiveSource(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50"
            >
              {SOURCE_FILTERS.map(f => (
                <option key={f.value} value={f.value} className="bg-gray-900">{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                activeCategory === cat.value
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">
            {loading ? 'Loading events...' : `${events.length} events found`}
            {activeChain !== 'all' && ` on ${CHAIN_INFO[activeChain].name}`}
            {activeCategory !== 'all' && ` in ${activeCategory}`}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/>
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Scanning {Object.keys(CHAIN_INFO).length} chains...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-gray-400 mb-6">
              Try a different chain, category, or search term
            </p>
            <button
              onClick={() => {
                setActiveChain('all');
                setActiveCategory('all');
                setActiveSource('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Events by Chain */}
        {!loading && events.length > 0 && (
          <div className="space-y-8">
            {activeChain === 'all' ? (
              // Group by chain
              Object.entries(eventsByChain).map(([chain, chainEvents]) => {
                const info = CHAIN_INFO[chain as ChainTag];
                return (
                  <div key={chain}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{info.icon}</span>
                      <h2 className="text-xl font-bold" style={{ color: info.color }}>
                        {info.name}
                      </h2>
                      <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-gray-400">
                        {chainEvents.length} events
                      </span>
                    </div>
                    
                    <div className={view === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-3'
                    }>
                      {chainEvents.map((event) => (
                        <EventCard key={event.id} event={event} view={view} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // Flat grid for filtered chain
              <div className={view === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
              }>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} view={view} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EVENT CARD COMPONENT
// ============================================================

function EventCard({ event, view }: { event: ExternalEvent; view: 'grid' | 'list' }) {
  const chainInfo = CHAIN_INFO[event.chain];
  
  if (view === 'list') {
    return (
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-all group"
      >
        {/* Cover */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
          {event.cover ? (
            <img src={event.cover} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {chainInfo.icon}
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
            {event.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            {event.date && <span>{formatDate(event.date)}</span>}
            {event.location && <span>• 📍 {event.location}</span>}
          </div>
        </div>
        
        {/* Chain Badge */}
        <div 
          className="px-2 py-1 rounded text-[10px] font-bold shrink-0"
          style={{ backgroundColor: chainInfo.color + '22', color: chainInfo.color }}
        >
          {chainInfo.icon} {chainInfo.name}
        </div>
        
        {/* Source */}
        <div className="text-[10px] text-gray-500 shrink-0">
          {event.source}
        </div>
      </a>
    );
  }

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/[0.07] transition-all group"
    >
      {/* Cover */}
      <div className="relative h-36 bg-gradient-to-br from-white/5 to-white/[0.02]">
        {event.cover ? (
          <img src={event.cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
            {chainInfo.icon}
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span 
            className="px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm"
            style={{ backgroundColor: chainInfo.color + 'cc', color: 'white' }}
          >
            {chainInfo.icon} {chainInfo.name}
          </span>
          {event.isFree && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-sm">
              FREE
            </span>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/50 text-gray-300 backdrop-blur-sm">
            {event.source}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
          {event.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{event.description}</p>
        
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          {event.date && (
            <span className="flex items-center gap-1">
              📅 {formatDate(event.date)}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1 truncate">
              📍 {event.location}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-[10px] text-gray-500 capitalize">
            {event.category}
          </span>
          {event.attending > 0 && (
            <span className="text-[10px] text-gray-500">
              {event.attending} attending
            </span>
          )}
          <span className="text-cyan-400 text-xs font-medium group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </a>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
