'use client';

import { useState, useEffect } from 'react';
import { useConduit } from '@/lib/useConduit';
import Link from 'next/link';
import { 
  Plus, 
  QrCode, 
  BarChart3, 
  Users, 
  Ticket, 
  DollarSign,
  ArrowRight,
  TrendingUp,
  Wallet,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    isConnected, 
    connectWallet, 
    organizerEvents, 
    loadOrganizerEvents,
    truncateAddress,
    address,
  } = useConduit();

  useEffect(() => {
    if (isConnected) loadOrganizerEvents();
  }, [isConnected, loadOrganizerEvents]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-white/5 items-center justify-center mb-6">
            <Wallet className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Organizer Dashboard
          </h1>
          <p className="text-gray-400 mb-8">
            Manage your events, track ticket sales, and scan attendees — 
            all from one place.
          </p>
          <button
            onClick={connectWallet}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold text-lg"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const totalTickets = organizerEvents.reduce((sum, e) => sum + e.tickets_sold, 0);
  const totalRevenue = organizerEvents.reduce((sum, e) => sum + (e.ticket_price * e.tickets_sold), 0);
  const totalCapacity = organizerEvents.reduce((sum, e) => sum + e.total_supply, 0);

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Header */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back
              </h1>
              <p className="text-gray-400 font-mono">{truncateAddress(address || '')}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/scan">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-medium inline-flex items-center gap-2 hover:bg-white/10 transition-all">
                  <QrCode className="h-4 w-4" />
                  Scan Tickets
                </button>
              </Link>
              <Link href="/create">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Event
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Ticket className="h-5 w-5 text-purple-400" />, label: 'Events Created', value: organizerEvents.length },
            { icon: <Users className="h-5 w-5 text-cyan-400" />, label: 'Tickets Sold', value: totalTickets },
            { icon: <DollarSign className="h-5 w-5 text-emerald-400" />, label: 'Total Revenue', value: `${(totalRevenue / 1_000_000_000).toFixed(1)} SUI` },
            { icon: <TrendingUp className="h-5 w-5 text-amber-400" />, label: 'Fill Rate', value: totalCapacity > 0 ? `${Math.round((totalTickets / totalCapacity) * 100)}%` : '0%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { 
              href: '/create', 
              icon: <Sparkles className="h-6 w-6" />, 
              title: 'Create Event', 
              desc: 'Launch a new event in under 5 minutes',
              color: 'from-purple-500 to-cyan-500',
            },
            { 
              href: '/dashboard/scan', 
              icon: <QrCode className="h-6 w-6" />, 
              title: 'Scan Tickets', 
              desc: 'Verify attendees at the door',
              color: 'from-cyan-500 to-blue-500',
            },
            { 
              href: '/dashboard/analytics', 
              icon: <BarChart3 className="h-6 w-6" />, 
              title: 'View Analytics', 
              desc: 'Track sales, attendance, and revenue',
              color: 'from-blue-500 to-purple-500',
            },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <div className="group p-6 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer">
                <div className={`inline-flex h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} items-center justify-center text-white mb-4`}>
                  {action.icon}
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Events List */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Your Events</h2>
        </div>

        {organizerEvents.length > 0 ? (
          <div className="space-y-4">
            {organizerEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="group flex items-center gap-6 p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                    <Ticket className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors truncate">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{event.venue}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-medium">{event.tickets_sold} / {event.total_supply}</p>
                    <p className="text-xs text-gray-500">tickets sold</p>
                  </div>
                  <div className="text-right shrink-0 w-20">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                        style={{ width: `${event.total_supply > 0 ? (event.tickets_sold / event.total_supply) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-purple-400 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-white/5 items-center justify-center mb-6">
              <Ticket className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No events yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Create your first on-chain event and start selling 
              fraud-proof NFT tickets in minutes.
            </p>
            <Link href="/create">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Create Your First Event
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
