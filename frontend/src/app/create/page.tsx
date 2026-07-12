"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
import { EVENT_CATEGORIES } from "@/lib/types";
import type { EventCategory } from "@/lib/types";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  DollarSign,
  Percent,
  Users,
  Image,
  FileText,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Info,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();
  const { isConnected, connectWallet } = useConduitWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    venue: "",
    category: "meetup" as EventCategory,
    ticket_price: "",
    total_supply: "",
    resale_price_cap: "",
    royalty_bps: "500",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      connectWallet();
      return;
    }

    setIsSubmitting(true);
    // Simulate contract interaction
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Redirect after success
    setTimeout(() => {
      router.push("/events");
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            You need to connect your wallet to create an event on Conduit.
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-sui-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-sui-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Event Created!</h1>
          <p className="text-muted-foreground mb-6">
            Your event has been submitted for review. You&apos;ll be redirected shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Link
        href="/events"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details to create your event on Conduit
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Event Name *
              </label>
              <Input
                placeholder="e.g., Sui Builder House SF"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description *
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Tell people about your event..."
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Event Image URL
              </label>
              <Input
                type="url"
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => updateForm("image_url", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Category *
              </label>
              <div className="flex flex-wrap gap-2">
                {EVENT_CATEGORIES.map((cat) => (
                  <Button
                    key={cat.value}
                    type="button"
                    variant={
                      form.category === cat.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => updateForm("category", cat.value)}
                  >
                    {cat.emoji} {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => updateForm("start_date", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Start Time *
                </label>
                <Input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => updateForm("start_time", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  End Date *
                </label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => updateForm("end_date", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  End Time *
                </label>
                <Input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => updateForm("end_time", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Venue / Location *
              </label>
              <Input
                placeholder="e.g., San Francisco, CA or Virtual"
                value={form.venue}
                onChange={(e) => updateForm("venue", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Ticketing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Ticketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Ticket Price (SUI)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0 for free"
                  value={form.ticket_price}
                  onChange={(e) => updateForm("ticket_price", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty or 0 for free events
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Total Supply *
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="100"
                  value={form.total_supply}
                  onChange={(e) => updateForm("total_supply", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Gas-Free for Attendees</div>
                  <div className="text-muted-foreground">
                    You&apos;ll pay the gas fees for all ticket mints. Your attendees never see blockchain complexity.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Market */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Secondary Market Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Resale Price (SUI)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0 for no cap"
                  value={form.resale_price_cap}
                  onChange={(e) =>
                    updateForm("resale_price_cap", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enforced by smart contract
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Royalty (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  placeholder="5"
                  value={form.royalty_bps}
                  onChange={(e) => {
                    const percent = parseFloat(e.target.value) || 0;
                    updateForm("royalty_bps", String(percent * 100));
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  0-15% royalty on every resale
                </p>
              </div>
            </div>

            <div className="p-3 bg-sui-50 rounded-lg border border-sui-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-sui-600" />
                <div className="text-sm">
                  <div className="font-medium text-sui-900">
                    Royalties Enforced On-Chain
                  </div>
                  <div className="text-sui-700">
                    Every resale automatically routes{" "}
                    {((parseInt(form.royalty_bps) || 500) / 100).toFixed(1)}% to
                    the creator wallet. No exceptions.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/events" className="flex-1">
            <Button variant="outline" className="w-full" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Event...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
