import Link from "next/link";
import { Ticket, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a12]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Conduit</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The ticketing platform that makes fraud impossible. 
              Built on Sui for instant verification and permanent royalties.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/discover" className="hover:text-purple-400 transition-colors">
                  Discover Events
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-purple-400 transition-colors">
                  Create Event — Free
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" className="hover:text-purple-400 transition-colors">
                  My Tickets
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Smart Contracts
                </a>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="hover:text-purple-400 transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="hover:text-purple-400 transition-colors">
                  Loyalty Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Community</h4>
            <p className="text-sm text-gray-400">
              Join builders choosing better ticketing.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/conduit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-purple-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/conduit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-purple-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Conduit. Built on Sui. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Zero counterfeits. Zero scalpers. 100% yours.
          </p>
        </div>
      </div>
    </footer>
  );
}
