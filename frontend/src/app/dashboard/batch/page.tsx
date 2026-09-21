"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConduit } from "@/lib/useConduit";
import {
  Upload,
  ArrowLeft,
  Loader2,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  Wallet,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export default function BatchMintPage() {
  const { isConnected, connectWallet, organizerEvents, loadOrganizerEvents, isDeployed } = useConduit();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [tier, setTier] = useState("GA");
  const [count, setCount] = useState(10);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  useEffect(() => {
    if (isConnected && isDeployed) loadOrganizerEvents();
  }, [isConnected, isDeployed, loadOrganizerEvents]);

  const handleBatchMint = async () => {
    setIsMinting(true);
    // TODO: Wire to batch_mint_free contract call
    await new Promise((r) => setTimeout(r, 2000));
    setIsMinting(false);
    setMintSuccess(true);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">Connect your organizer wallet to batch mint tickets.</p>
          <Button onClick={connectWallet} size="lg">Connect Wallet</Button>
        </div>
      </div>
    );
  }

  if (mintSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-sui-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-sui-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Batch Mint Complete!</h1>
          <p className="text-muted-foreground mb-6">{count} tickets minted successfully.</p>
          <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Batch Mint Tickets</h1>
        <p className="text-muted-foreground mt-2">Mint multiple free tickets in a single transaction</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Event</label>
              <select
                className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="">Select an event...</option>
                {organizerEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.total_supply - event.tickets_sold} spots left)
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tier</label>
                <select className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm" value={tier} onChange={(e) => setTier(e.target.value)}>
                  <option value="GA">General Admission</option>
                  <option value="VIP">VIP</option>
                  <option value="EARLY">Early Bird</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <Input type="number" min="1" max="100" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event</span>
              <span className="font-medium">
                {selectedEvent ? organizerEvents.find((e) => e.id === selectedEvent)?.name : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tier</span>
              <span className="font-medium">{tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">{count} tickets</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleBatchMint} disabled={!selectedEvent || isMinting || !isDeployed}>
            {isMinting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Minting {count} tickets...
              </>
            ) : (
              <>
                <Ticket className="h-4 w-4 mr-2" />
                Batch Mint {count} Tickets
              </>
            )}
          </Button>
          {!isDeployed && (
            <p className="text-sm text-muted-foreground text-center mt-3">Deploy contract first</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
