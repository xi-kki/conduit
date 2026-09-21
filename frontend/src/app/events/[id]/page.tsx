'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useConduit } from '@/lib/useConduit';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight,
  Ticket,
  ExternalLink,
  Check,
  Clock,
  Wallet,
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { 
    fetchEvent, 
    purchaseTicket, 
    claimFreeTicket,
    isConnected, 
    connectWallet,
    truncateAddress 
  } = useConduit();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'GA' | 'VIP' | 'EARLY'>('GA');

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId).then(setEvent).finally(() => setLoading(false));
    }
  }, [eventId, fetchEvent]);

  const handlePurchase = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    
    setPurchasing(true);
    try {
      const price = selectedTier === 'VIP' 
        ? (event.ticket_price * 3) 
        : selectedTier === 'EARLY' 
        ? (event.ticket_price * 0.8) 
        : event.ticket_price;
      
      if (price === 0) {
        await claimFreeTicket(eventId, selectedTier);
      } else {
        await purchaseTicket(eventId, price, selectedTier);
      }
    } catch (err) {
      console.error(err);
    }
    setPurchasing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-6">This event may have been removed or doesn&apos;t exist.</p>
          <Link href="/events">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium">
              Browse Events
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const soldPercentage = event.total_supply > 0 
    ? Math.round((event.tickets_sold / event.total_supply) * 100) 
    : 0;
  const remaining = event.total_supply - event.tickets_sold;

  const tiers = [
    { 
      id: 'GA', 
      name: 'General Admission', 
      price: event.ticket_price,
      perks: ['Event access', 'NFT ticket proof', 'On-chain receipt'],
    },
    { 
      id: 'VIP', 
      name: 'VIP Access', 
      price: event.ticket_price * 3,
      perks: ['Priority entry', 'Exclusive merch NFT', 'Backstage meet & greet', 'All GA perks'],
    },
    { 
      id: 'EARLY', 
      name: 'Early Bird', 
      price: event.ticket_price * 0.8,
      perks: ['20% discount', 'Limited edition NFT', 'Event access'],
    },
  ];

  const selectedTierData = tiers.find(t => t.id === selectedTier)!;

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Event Header */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Event Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                  On-Chain Event
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                  Verified
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {event.name}
              </h1>
              
              <p className="text-gray-400 text-lg mb-6 max-w-2xl">
                {event.description}
              </p>

              {/* Event Meta */}
              <div className="flex flex-wrap gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <span>{formatDate(event.start_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <span>{event.venue || 'TBA'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span>{event.tickets_sold} / {event.total_supply} tickets sold</span>
                </div>
              </div>

              {/* Organizer */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs text-gray-400">ORG</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organized by</p>
                  <Link href={`/organizer/${event.organizer}`}>
                    <p className="text-sm text-white font-mono hover:text-purple-400 transition-colors">
                      {truncateAddress(event.organizer)}
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="w-full md:w-96">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sticky top-24">
                {/* Fill Rate */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{soldPercentage}% sold</span>
                    <span className="text-white font-medium">{remaining} left</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                      style={{ width: `${soldPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Tier Selection */}
                <div className="space-y-3 mb-6">
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id as any)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        selectedTier === tier.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{tier.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {tier.perks.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {tier.price === 0 ? 'FREE' : `${(tier.price / 1_000_000_000).toFixed(1)} SUI`}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || remaining <= 0}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  {purchasing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Minting Ticket...
                    </>
                  ) : remaining <= 0 ? (
                    'Sold Out'
                  ) : !isConnected ? (
                    <>
                      <Wallet className="h-5 w-5" />
                      Connect Wallet
                    </>
                  ) : selectedTierData.price === 0 ? (
                    <>
                      <Ticket className="h-5 w-5" />
                      Claim Free Ticket
                    </>
                  ) : (
                    <>
                      <Ticket className="h-5 w-5" />
                      Get Ticket — {(selectedTierData.price / 1_000_000_000).toFixed(1)} SUI
                    </>
                  )}
                </button>

                {/* Trust Signals */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Verified on Sui</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>Instant mint</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="h-6 w-6 text-emerald-400" />,
              title: 'Impossible to Fake',
              desc: 'Your ticket is a unique NFT on the Sui blockchain. No one can duplicate it.',
            },
            {
              icon: <Zap className="h-6 w-6 text-amber-400" />,
              title: 'Instant Verification',
              desc: 'Scan your QR at the door. On-chain check takes less than 2 seconds.',
            },
            {
              icon: <Ticket className="h-6 w-6 text-purple-400" />,
              title: 'Yours Forever',
              desc: 'Even after the event, your ticket proves you were there. Collectible proof-of-attendance.',
            },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-xl text-center">
              <div className="inline-flex h-12 w-12 rounded-xl bg-white/5 items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(timestamp: number): string {
  if (!timestamp) return 'TBA';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
