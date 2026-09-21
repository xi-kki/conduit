'use client';

import { useState } from 'react';
import { useConduit } from '@/lib/useConduit';
import { 
  Gift, 
  Star, 
  Zap, 
  Trophy, 
  ArrowRight,
  Ticket,
  Sparkles,
  Check,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

export default function LoyaltyPage() {
  const { isConnected, connectWallet } = useConduit();

  const points = 0; // Will be fetched from chain
  const tier = 'Bronze';

  const rewards = [
    { 
      name: 'Free GA Ticket', 
      cost: 1000, 
      icon: <Ticket className="h-6 w-6 text-purple-400" />,
      desc: 'Redeem for any General Admission ticket',
    },
    { 
      name: 'VIP Upgrade', 
      cost: 2500, 
      icon: <Star className="h-6 w-6 text-amber-400" />,
      desc: 'Upgrade any ticket to VIP status',
    },
    { 
      name: 'Exclusive Merch NFT', 
      cost: 500, 
      icon: <Gift className="h-6 w-6 text-cyan-400" />,
      desc: 'Limited edition digital collectible',
    },
    { 
      name: 'Platform Fee Waiver', 
      cost: 5000, 
      icon: <Zap className="h-6 w-6 text-emerald-400" />,
      desc: '0% fees on your next event',
    },
  ];

  const earnWays = [
    { action: 'Attend an event', points: '+100', icon: <Ticket className="h-4 w-4" /> },
    { action: 'Create an event', points: '+250', icon: <Sparkles className="h-4 w-4" /> },
    { action: 'Refer a friend', points: '+500', icon: <Star className="h-4 w-4" /> },
    { action: 'Leave a review', points: '+50', icon: <Gift className="h-4 w-4" /> },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-white/5 items-center justify-center mb-6">
            <Wallet className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Loyalty Rewards
          </h1>
          <p className="text-gray-400 mb-8">
            Connect your wallet to see your points balance and redeem rewards.
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

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Hero */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Points. Your Perks.
          </h1>
          <p className="text-gray-400 text-lg">
            Every action earns points. Points unlock rewards. Rewards make Web3 better.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Points Balance */}
        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-8 text-center mb-12">
          <p className="text-gray-400 mb-2">Your Balance</p>
          <div className="text-6xl font-bold text-white mb-2">{points}</div>
          <p className="text-purple-400 font-medium">{tier} Member</p>
          <p className="text-sm text-gray-500 mt-4">
            {1000 - points} points until Silver — that&apos;s just 10 event check-ins away.
          </p>
        </div>

        {/* Ways to Earn */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Earn More Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnWays.map((way, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                <div className="flex items-center gap-3 text-white">
                  {way.icon}
                  {way.action}
                </div>
                <span className="text-purple-400 font-bold font-mono">{way.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Redeem Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward, i) => (
              <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {reward.icon}
                    <div>
                      <h3 className="text-white font-medium">{reward.name}</h3>
                      <p className="text-xs text-gray-500">{reward.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-bold font-mono">{reward.cost} pts</span>
                  <button
                    disabled={points < reward.cost}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {points >= reward.cost ? 'Redeem' : 'Not enough'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/events">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2">
              Earn Your First Points
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
