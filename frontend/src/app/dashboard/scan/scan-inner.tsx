'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConduit } from '@/lib/useConduit';
import { 
  QrCode, 
  Check, 
  X, 
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Wallet,
  Search,
} from 'lucide-react';
import Link from 'next/link';

export default function ScanInner() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event') || '';
  const { verifyTicket, isConnected, connectWallet } = useConduit();
  
  const [ticketId, setTicketId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; valid: boolean; time: Date }>>([]);

  const handleVerify = async () => {
    if (!ticketId.trim()) return;
    
    setVerifying(true);
    setResult(null);
    
    try {
      const response = await verifyTicket(ticketId, eventId);
      setResult(response);
      setHistory(prev => [{ id: ticketId, valid: response.valid, time: new Date() }, ...prev]);
    } catch (err) {
      setResult({ valid: false, message: 'Verification failed — try again' });
    }
    
    setVerifying(false);
    setTicketId('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex h-20 w-20 rounded-2xl bg-white/5 items-center justify-center mb-6">
            <Wallet className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Ticket Scanner
          </h1>
          <p className="text-gray-400 mb-8">
            Verify tickets at the door in under 2 seconds. 
            Connect your organizer wallet to start scanning.
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Ticket Scanner
              </h1>
              <p className="text-gray-400">
                Scan QR or enter ticket ID. Verification takes &lt;2 seconds.
              </p>
            </div>
            {eventId && (
              <Link href={`/events/${eventId}`}>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm inline-flex items-center gap-2 hover:bg-white/10 transition-all">
                  View Event
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Scanner Area */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 mb-8">
          {/* Camera Placeholder */}
          <div className="relative h-64 bg-black/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <QrCode className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Camera access required for QR scanning</p>
              <button className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-all">
                Enable Camera
              </button>
            </div>
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 border-2 border-purple-500/30 rounded-xl pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500 rounded-br-lg" />
            </div>
          </div>

          {/* Manual Entry */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="Or enter ticket ID manually..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={verifying || !ticketId.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-cyan-600 transition-all inline-flex items-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Verify
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`p-6 rounded-2xl mb-8 ${
            result.valid 
              ? 'bg-emerald-500/10 border border-emerald-500/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                result.valid ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                {result.valid ? (
                  <Check className="h-8 w-8 text-white" />
                ) : (
                  <X className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${result.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                </h3>
                <p className="text-gray-400">{result.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scan History */}
        {history.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Recent Scans
            </h2>
            <div className="space-y-2">
              {history.map((scan, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {scan.valid ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <X className="h-4 w-4 text-red-400" />
                    )}
                    <span className="font-mono text-sm text-white">{scan.id.slice(0, 16)}...</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {scan.time.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust Signals */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: <Shield className="h-5 w-5 text-purple-400" />, title: 'On-Chain Verified', desc: 'Checks the Sui blockchain' },
            { icon: <Zap className="h-5 w-5 text-cyan-400" />, title: '<2 Seconds', desc: 'Fastest verification in Web3' },
            { icon: <Check className="h-5 w-5 text-emerald-400" />, title: 'Tamper-Proof', desc: 'Can\'t be faked or reused' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-white/[0.03] border border-white/5 rounded-xl">
              <div className="inline-flex h-10 w-10 rounded-xl bg-white/5 items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="text-white text-sm font-medium">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
