"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, Menu, X, Wallet, LogOut } from "lucide-react";
import { useState } from "react";
import { useConduit } from "@/lib/useConduit";
import { ZkLoginButton } from "@/app/providers";

export function Navbar() {
  const { isConnected, address, connectWallet, disconnectWallet, truncateAddress } = useConduit();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a12]/95 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Conduit</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/discover" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              🌐 Discover
            </Link>
            <Link href="/events" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              Events
            </Link>
            <Link href="/my-tickets" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              My Tickets
            </Link>
            {isConnected && (
              <>
                <Link href="/create" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                  Create Event
                </Link>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Wallet */}
          <div className="flex items-center space-x-3">
            {isConnected && address ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium font-mono text-white">
                    {truncateAddress(address)}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={disconnectWallet}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  onClick={() => setShowAuthModal(true)} 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col space-y-1">
              <Link href="/discover" className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                🌐 Discover Events
              </Link>
              <Link href="/events" className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                Browse Events
              </Link>
              <Link href="/my-tickets" className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                My Tickets
              </Link>
              {isConnected && (
                <>
                  <Link href="/create" className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                    Create Event
                  </Link>
                  <Link href="/dashboard" className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </>
              )}
              {isConnected && address ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/5 mt-2">
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium font-mono text-white">{truncateAddress(address)}</span>
                  </div>
                  <Button variant="ghost" className="justify-start text-gray-400 hover:text-white" onClick={() => { disconnectWallet(); setMobileMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="px-4 pt-2">
                  <Button 
                    onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} 
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal — Connect Wallet or Sign in with Google */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Connect to Conduit</h2>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Auth Options */}
            <div className="space-y-4">
              {/* Google Sign-In (zkLogin) */}
              <ZkLoginButton onSuccess={() => setShowAuthModal(false)} />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-gray-500 bg-[#12121a]">or</span>
                </div>
              </div>

              {/* Traditional Wallet Connect */}
              <button
                onClick={() => {
                  connectWallet();
                  setShowAuthModal(false);
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
              >
                <Wallet className="h-5 w-5 text-purple-400" />
                Connect Wallet
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Use Google for passwordless sign-in, or connect a Sui wallet like Sui Wallet or Ethos.
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
