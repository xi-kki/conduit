'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EventCard } from '@/components/event-card';
import { useConduit } from '@/lib/useConduit';
import {
  ConduitBackground,
  CircuitPattern,
  ConduitBorder,
  DataFlowLine,
} from '@/components/conduit-bg';
import {
  fetchAllExternalEvents,
  CHAIN_INFO,
  type ExternalEvent,
} from '@/lib/events-api';
import {
  Search,
  ArrowRight,
  Wifi,
  WifiOff,
  Globe,
  Shield,
  Ticket,
  ChevronRight,
  Zap,
  Lock,
  Eye,
  Ban,
} from 'lucide-react';

export default function HomePage() {
  const { events, loadAllEvents, isDeployed, loading } = useConduit();
  const [externalEvents, setExternalEvents] = useState<ExternalEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllEvents();
    fetchAllExternalEvents({ limit: 6 }).then(setExternalEvents);
  }, [loadAllEvents]);

  const allEvents = [...events, ...externalEvents];
  const filteredEvents = searchQuery
    ? allEvents.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allEvents;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <ConduitBackground />
        <CircuitPattern opacity={0.03} />
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-sm text-purple-300 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              Zero counterfeits. Zero scalpers. 100% yours.
            </div>

            {/* HEADLINE — Stop them cold. Promise a benefit. */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              <span className="text-white">Your Ticket</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400">
                Can&apos;t Be Faked
              </span>
            </h1>

            <DataFlowLine className="w-64 mx-auto mt-6 mb-8" />

            {/* SUBHEAD — Expand the promise, create curiosity */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Every ticket is an <span className="text-purple-400 font-semibold">NFT on Sui</span> — 
              provably unique, royalty-enforced, and instantly verifiable at the door. 
              No fakes. No double-sells. No scalpers draining your margins.
            </p>

            {/* CTAs — One clear action, remove risk */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/discover">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold text-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/25">
                  <span className="relative z-10 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Find Events Near You
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <Link href="/create">
                <button className="px-8 py-4 border border-white/20 rounded-xl text-white font-semibold text-lg hover:bg-white/5 transition-all backdrop-blur-sm">
                  Create Your First Event — Free
                </button>
              </Link>
            </div>

            {/* Chain logos — social proof of ecosystem */}
            <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
              {['solana', 'ethereum', 'bitcoin', 'avalanche', 'stellar', 'polkadot', 'cosmos', 'near'].map(chain => {
                const info = CHAIN_INFO[chain as keyof typeof CHAIN_INFO];
                return (
                  <div
                    key={chain}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 hover:border-white/20 hover:text-white transition-all cursor-default"
                  >
                    <span className="text-base">{info?.icon}</span>
                    <span>{info?.name}</span>
                  </div>
                );
              })}
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-500">
                +8 more chains
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a12] to-transparent" />
      </section>

      {/* ========== PROBLEM / SOLUTION BAR ========== */}
      <section className="relative border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* The Problem — show you understand their pain */}
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                The $10 Billion Ticket Fraud Problem
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Every year, fans lose money to fake tickets. Organizers lose revenue to scalpers. 
                Venues waste hours verifying authenticity. <span className="text-white font-medium">The system is broken.</span>
              </p>
            </div>

            {/* Pain points → Solution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Ban className="h-6 w-6 text-red-400" />,
                  pain: 'Counterfeit Tickets',
                  solution: 'NFT tickets are cryptographically unique — impossible to duplicate',
                  color: 'red',
                },
                {
                  icon: <Lock className="h-6 w-6 text-amber-400" />,
                  pain: 'Scalper Bots',
                  solution: 'On-chain royalties enforced automatically — scalpers can\'t profit',
                  color: 'amber',
                },
                {
                  icon: <Eye className="h-6 w-6 text-emerald-400" />,
                  pain: 'Slow Verification',
                  solution: 'QR scan → on-chain check → door opens in under 2 seconds',
                  color: 'emerald',
                },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="inline-flex h-12 w-12 rounded-xl bg-white/5 items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-red-400 text-sm font-medium mb-1 line-through opacity-60">
                    {item.pain}
                  </h3>
                  <p className="text-white font-medium">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SEARCH ========== */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Find Your Next Event</h2>
          <p className="text-gray-500 mb-6">Search across 12+ blockchain ecosystems</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hackathons, conferences, meetups..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder-gray-500 text-lg focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ========== MULTI-CHAIN EVENTS ========== */}
      {externalEvents.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Events Across Every Chain</h2>
                <p className="text-sm text-gray-500">Bitcoin. Solana. Ethereum. Avalanche. All in one place.</p>
              </div>
            </div>
            <Link href="/discover" className="text-purple-400 text-sm font-medium hover:text-purple-300 flex items-center gap-1">
              See all chains <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {externalEvents.slice(0, 6).map((event) => {
              const chainInfo = CHAIN_INFO[event.chain];
              return (
                <a
                  key={event.id}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/[0.06] transition-all"
                >
                  <div className="relative h-32 bg-gradient-to-br from-white/5 to-transparent">
                    {event.cover ? (
                      <img src={event.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                        {chainInfo?.icon}
                      </div>
                    )}
                    <div 
                      className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm"
                      style={{ backgroundColor: (chainInfo?.color || '#666') + 'cc', color: 'white' }}
                    >
                      {chainInfo?.icon} {chainInfo?.name}
                    </div>
                    {event.isFree && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-sm">
                        FREE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {event.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{event.source}</span>
                      <span className="text-cyan-400 text-xs group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* ========== ON-CHAIN EVENTS ========== */}
      {events.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Live On-Chain Events</h2>
                <p className="text-sm text-gray-500">NFT tickets you can verify right now</p>
              </div>
            </div>
            <Link href="/events" className="text-purple-400 text-sm font-medium hover:text-purple-300 flex items-center gap-1">
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* ========== HOW IT WORKS — Objection Demolition ========== */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Three Steps. Zero Complexity.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            You don&apos;t need to understand blockchain. You just need a ticket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: '01',
              title: 'Connect Your Wallet',
              desc: 'One click. Sui, MetaMask, or any wallet. No signup, no email, no password.',
              icon: <Zap className="h-6 w-6" />,
            },
            {
              step: '02',
              title: 'Grab Your Ticket',
              desc: 'Mint an NFT ticket in seconds. It\'s yours — verifiable on-chain forever.',
              icon: <Ticket className="h-6 w-6" />,
            },
            {
              step: '03',
              title: 'Walk Right In',
              desc: 'Show your QR code at the door. Scan. Verify. Enter. Under 2 seconds.',
              icon: <Shield className="h-6 w-6" />,
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 items-center justify-center text-purple-400 mb-4">
                {item.icon}
              </div>
              <div className="text-xs text-purple-400 font-mono mb-2">STEP {item.step}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SOCIAL PROOF ========== */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              Why Organizers Choose Conduit
            </h2>
            <p className="text-gray-500">
              The math is simple. The technology is invisible. The results are real.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '$0', label: 'Fraud losses', sub: 'ever' },
              { value: '15%', label: 'Royalty enforcement', sub: 'on every resale' },
              { value: '<2s', label: 'Door verification', sub: 'scan to enter' },
              { value: '12+', label: 'Chains supported', sub: 'and growing' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {stat.value}
                </div>
                <div className="text-sm text-white font-medium mt-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
          <CircuitPattern opacity={0.04} />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop Losing Money to Fake Tickets
          </h2>
          <p className="text-lg text-gray-400 mb-4 max-w-xl mx-auto">
            Join the organizers who&apos;ve eliminated fraud, enforced royalties, 
            and doubled their door speed — all with one switch.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            No credit card. No contract. Just better tickets.
          </p>
          <Link href="/create">
            <button className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all">
              Create Your First Event Free
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
