import Link from "next/link";
import { Ticket, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-conduit-600">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">Conduit</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The curated Web3 events hub on Sui. Discover, attend, and own the
              best on-chain experiences.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-foreground transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-foreground transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" className="hover:text-foreground transition-colors">
                  My Tickets
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="hover:text-foreground transition-colors">
                  Loyalty Program
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-foreground transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="/api/events" className="hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="hover:text-foreground transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold">Community</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/conduit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/conduit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Built on Sui • © 2024 Conduit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}