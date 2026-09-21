'use client';

import { useState } from 'react';
import { useConduit } from '@/lib/useConduit';
import { 
  Trophy, 
  Medal, 
  Star, 
  Zap, 
  Crown,
  ArrowRight,
  Wallet,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { isConnected, connectWallet } = useConduit();
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

  const tiers = [
    { 
      name: 'Platinum', 
      icon: <Crown className="h-8 w-8" />,
      points: '10,000+',
      color: 'from-purple-400 to-cyan-400',
      borderColor: 'border-purple-500/30',
      benefits: ['Free VIP tickets', '0% platform fees', 'Priority support', 'Exclusive events'],
    },
    { 
      name: 'Gold', 
      icon: <Star className="h-8 w-8" />,
      points: '5,000+',
      color: 'from-amber-400 to-yellow-400',
      borderColor: 'border-amber-500/30',
      benefits: ['10% off tickets', '0.5% lower fees', 'Early access', 'Gold badge'],
    },
    { 
      name: 'Silver', 
      icon: <Medal className="h-8 w-8" />,
      points: '1,000+',
      color: 'from-gray-300 to-gray-400',
      borderColor: 'border-gray-500/30',
      benefits: ['5% off tickets', 'Standard fees', 'Silver badge'],
    },
    { 
      name: 'Bronze', 
      icon: <Trophy className="h-8 w-8" />,
      points: '0+',
      color: 'from-orange-400 to-amber-600',
      borderColor: 'border-orange-500/30',
      benefits: ['Welcome bonus', 'Bronze badge'],
    },
  ];

  const earnPoints = [
    { action: 'Attend an event', points: '+100', icon: <Zap className="h-4 w-4 text-purple-400" /> },
    { action: 'Create an event', points: '+250', icon: <Sparkles className="h-4 w-4 text-cyan-400" /> },
    { action: 'Refer a friend', points: '+500', icon: <Star className="h-4 w-4 text-amber-400" /> },
    { action: 'Leave a review', points: '+50', icon: <Medal className="h-4 w-4 text-emerald-400" /> },
    { action: 'Verify attendance (QR scan)', points: '+25', icon: <Trophy className="h-4 w-4 text-blue-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Hero */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 items-center justify-center mb-6">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Earn Rewards. Climb the Ranks.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every ticket you grab, every event you host, every friend you bring — 
            it all adds up. Unlock perks that make Web3 better.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tier Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={`p-6 bg-white/[0.03] border ${tier.borderColor} rounded-xl`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-sm text-gray-500">{tier.points} points</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How to Earn Points</h2>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
            {earnPoints.map((item, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-4 ${i !== earnPoints.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-white">{item.action}</span>
                </div>
                <span className="text-purple-400 font-bold font-mono">{item.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Earning Today
          </h2>
          <p className="text-gray-400 mb-6">
            Your first event is 100 points away. Your first referral is 500.
          </p>
          <Link href="/events">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2">
              Find Your First Event
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
