"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatSui, formatDate, formatTime } from "@/lib/utils";
import { useConduitWallet } from "@/lib/hooks";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Share2,
  Heart,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/types";

// Mock event data
const MOCK_EVENT: Event = {
  id: "1",
  name: "Sui Builder House SF",
  description:
    "Join the Sui community for a day of building, learning, and connecting with fellow developers. Features workshops, talks, and networking opportunities with core contributors and ecosystem projects.",
  image_url: "",
  start_time: Date.now() + 86400000 * 3,
  end_time: Date.now() + 86400000 * 4,
  venue: "San Francisco, CA",
  organizer: "0x1234567890abcdef",
  ticket_price: 0,
  resale_price_cap: 0,
  royalty_bps: 500,
  total_supply: 200,
  tickets_sold: 156,
  category: "meetup",
  is_active: true,
};

export default function EventDetailPage() {
  const params = useParams();
  const { isConnected, connectWallet } = useConduitWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // In production, fetch event by params.id
  const event = MOCK_EVENT;
  const spotsLeft = event.total_supply - event.tickets_sold;
  const isSoldOut = spotsLeft === 0;
  const isFree = event.ticket_price === 0;
  const soldPercentage = (event.tickets_sold / event.total_supply) * 100;

  const handlePurchase = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setIsPurchasing(true);
    // Simulate purchase
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPurchasing(false);
    setPurchaseSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/events"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-conduit-500 to-conduit-700">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Ticket className="h-24 w-24 text-white/30" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              {isFree ? (
                <Badge variant="free" className="text-lg px-4 py-1">
                  Free
                </Badge>
              ) : (
                <Badge className="text-lg px-4 py-1">
                  {formatSui(event.ticket_price)} SUI
                </Badge>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {event.category}
                </Badge>
                <h1 className="text-3xl font-bold">{event.name}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Event Details</h3>
              
              <div className="grid gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formatDate(event.start_time)}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{event.venue}</div>
                    <div className="text-sm text-muted-foreground">
                      View on map
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {event.tickets_sold} / {event.total_supply} tickets claimed
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {spotsLeft} spots remaining
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizer */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Organizer</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-conduit-100 flex items-center justify-center">
                    <span className="text-conduit-600 font-medium">S</span>
                  </div>
                  <div>
                    <div className="font-medium">Sui Foundation</div>
                    <div className="text-sm text-muted-foreground">
                      {event.organizer.slice(0, 10)}...{event.organizer.slice(-4)}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Ticket Purchase */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Get Tickets</h3>

              {/* Price */}
              <div className="mb-6">
                {isFree ? (
                  <div className="text-3xl font-bold text-sui-600">Free</div>
                ) : (
                  <div className="text-3xl font-bold">
                    {formatSui(event.ticket_price)}{" "}
                    <span className="text-lg text-muted-foreground">SUI</span>
                  </div>
                )}
              </div>

              {/* Availability Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">
                    {Math.round(soldPercentage)}% claimed
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-conduit-600 transition-all"
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {spotsLeft} spots left
                </div>
              </div>

              {/* Purchase Button */}
              {purchaseSuccess ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sui-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Ticket Claimed!</span>
                  </div>
                  <Link href="/my-tickets">
                    <Button className="w-full" variant="outline">
                      View My Tickets
                    </Button>
                  </Link>
                </div>
              ) : isSoldOut ? (
                <Button className="w-full" disabled>
                  Sold Out
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isConnected ? "Processing..." : "Connecting..."}
                    </>
                  ) : isConnected ? (
                    isFree ? (
                      "Claim Free Ticket"
                    ) : (
                      `Buy for ${formatSui(event.ticket_price)} SUI`
                    )
                  ) : (
                    "Connect Wallet to Buy"
                  )}
                </Button>
              )}

              {/* Resale Info */}
              {!isFree && event.resale_price_cap > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">Resale Protected</div>
                      <div className="text-muted-foreground">
                        Max resale price: {formatSui(event.resale_price_cap)} SUI
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Royalty Info */}
              {event.royalty_bps > 0 && (
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  {(event.royalty_bps / 100).toFixed(1)}% royalty on resale
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
