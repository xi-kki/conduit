'use client';

import { useConduit } from '@/lib/useConduit';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Shield, 
  Wifi, 
  WifiOff,
  Check,
  Globe,
  Lock,
  Eye,
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { isConnected, address, connectWallet, disconnectWallet, truncateAddress, isDeployed } = useConduit();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-white/5 items-center justify-center mb-6">
            <Wallet className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Wallet Settings
          </h1>
          <p className="text-gray-400 mb-8">
            Connect your wallet to manage settings and view your on-chain identity.
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
      {/* Header */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-400">
            Manage your wallet, network, and preferences.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Wallet Info */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-purple-400" />
            Wallet
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
              <div>
                <p className="text-sm text-gray-500">Connected Address</p>
                <p className="text-white font-mono text-sm mt-1">{address}</p>
              </div>
              <button
                onClick={copyAddress}
                className="px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
              <div>
                <p className="text-sm text-gray-500">View on SuiScan</p>
                <p className="text-xs text-gray-600 mt-1">See your full transaction history</p>
              </div>
              <a
                href={`https://suiscan.xyz/testnet/account/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                SuiScan
              </a>
            </div>

            <button
              onClick={disconnectWallet}
              className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium hover:bg-red-500/20 transition-all"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            Network
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
              <div className="flex items-center gap-3">
                {isDeployed ? (
                  <Wifi className="h-5 w-5 text-emerald-400" />
                ) : (
                  <WifiOff className="h-5 w-5 text-gray-500" />
                )}
                <div>
                  <p className="text-white font-medium">Sui Testnet</p>
                  <p className="text-xs text-gray-500">
                    {isDeployed ? 'Contract deployed and connected' : 'Demo mode — contract not deployed'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDeployed 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {isDeployed ? 'Live' : 'Demo'}
              </span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            Security
          </h2>
          
          <div className="space-y-3">
            {[
              { icon: <Lock className="h-4 w-4 text-purple-400" />, title: 'Non-Custodial', desc: 'Your keys, your crypto. Conduit never holds your assets.' },
              { icon: <Eye className="h-4 w-4 text-cyan-400" />, title: 'On-Chain Verified', desc: 'All transactions are publicly verifiable on Sui.' },
              { icon: <Shield className="h-4 w-4 text-emerald-400" />, title: 'Smart Contract Audited', desc: 'Move contracts follow Sui security best practices.' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl">
                {item.icon}
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
