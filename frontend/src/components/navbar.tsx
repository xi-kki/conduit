"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, Menu, X, Plus, Wallet, Bell } from "lucide-react";
import { useState } from "react";
import { useConduitWallet } from "@/lib/hooks";

export function Navbar() {
  const { isConnected, address, connectWallet, disconnectWallet, truncateAddress } = useConduitWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-conduit-600">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Conduit</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/events"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Events
            </Link>
            <Link
              href="/my-tickets"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Tickets
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
            {isConnected && (
              <>
                <Link
                  href="/create"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Event
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected && address ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      2
                    </span>
                  </Button>
                </Link>
                <Link href="/create">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 rounded-lg border px-3 py-2">
                  <div className="h-2 w-2 rounded-full bg-sui-500 animate-pulse" />
                  <span className="text-sm font-medium">
                    {truncateAddress(address)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} className="hidden md:flex">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                href="/events"
                className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/my-tickets"
                className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Tickets
              </Link>
              {isConnected && (
                <>
                  <Link
                    href="/create"
                    className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Event
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              {isConnected && address ? (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <div className="h-2 w-2 rounded-full bg-sui-500 animate-pulse" />
                    <span className="text-sm font-medium">
                      {truncateAddress(address)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      disconnectWallet();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    connectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-3"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
