'use client';

import { useState, useEffect } from 'react';
import { useConduit } from '@/lib/useConduit';
import { TicketCard } from '@/components/ticket-card';
import { Ticket, Wallet, ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MyTicketsPage() {
  const { isConnected, address, connectWallet, myTickets: tickets, loadMyTickets, truncateAddress, events } = useConduit();
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    if (isConnected) loadMyTickets();
  }, [isConnected, loadMyTickets]);

  // Helper to get event time from ticket's event_id
  const getEventTime = (ticket: any) => {
    const event = events.find(e => e.id === ticket.event_id);
    return event?.start_time || 0;
  };

  const now = Math.floor(Date.now() / 1000);
  const upcoming = tickets.filter(t => {
    const eventTime = getEventTime(t);
    return eventTime > now && !t.is_used;
  });
  const past = tickets.filter(t => getEventTime(t) <= now || t.is_used);

  const displayTickets = tab === 'upcoming' ? upcoming : tab === 'past' ? past : tickets;

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-white/5 items-center justify-center mb-6">
            <Wallet className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Your Tickets Await
          </h1>
          <p className="text-gray-400 mb-8">
            Connect your wallet to see every ticket you own — 
            each one a unique NFT, provably yours on Sui.
          </p>
          <button
            onClick={connectWallet}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold text-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Header */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Your Collection
              </h1>
              <p className="text-gray-400">
                {tickets.length === 0 
                  ? "No tickets yet — your first NFT is one click away."
                  : `${tickets.length} ticket${tickets.length !== 1 ? 's' : ''} in your wallet`
                }
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{upcoming.length}</div>
                <div className="text-xs text-gray-500">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{past.length}</div>
                <div className="text-xs text-gray-500">Attended</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {(['upcoming', 'past', 'all'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span className="ml-1.5 text-xs opacity-60">
                  {t === 'upcoming' ? upcoming.length : t === 'past' ? past.length : tickets.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {displayTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-white/5 items-center justify-center mb-6">
              <Ticket className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {tab === 'upcoming' 
                ? "No upcoming events"
                : tab === 'past'
                ? "No past events yet"
                : "Your collection is empty"
              }
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {tab === 'upcoming'
                ? "Grab your first ticket and experience the future of event access."
                : "Once you attend an event, it'll show up here — proof you were there, on-chain forever."
              }
            </p>
            <Link href="/events">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium inline-flex items-center gap-2">
                Find Events
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
