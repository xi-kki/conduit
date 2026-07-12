"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
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

// Mock events for dropdown
const MOCK_EVENTS = [
  { id: "1", name: "Sui Builder House SF", tickets_available: 44 },
  { id: "2", name: "Web3 Conference 2024", tickets_available: 158 },
];

export default function BatchMintPage() {
  const { isConnected, connectWallet } = useConduitWallet();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [tier, setTier] = useState("GA");
  const [count, setCount] = useState(10);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleBatchMint = async () => {
    setIsMinting(true);
    // Simulate minting
    await new Promise((resolve) => setTimeout(resolve, 3000));
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
          <p className="text-muted-foreground mb-6">
            Connect your organizer wallet to batch mint tickets.
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
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
          <p className="text-muted-foreground mb-6">
            {count} tickets have been minted successfully.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Batch Mint Tickets</h1>
        <p className="text-muted-foreground mt-2">
          Mint multiple tickets in a single transaction
        </p>
      </div>

      {/* Select Event */}
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
                {MOCK_EVENTS.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.tickets_available} spots left)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tier</label>
                <select
                  className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm"
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                >
                  <option value="GA">General Admission</option>
                  <option value="VIP">VIP</option>
                  <option value="EARLY">Early Bird</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Or Upload CSV */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Or Upload CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Upload a CSV file with ticket holder addresses
            </p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csv-upload"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose CSV File
                </span>
              </Button>
            </label>
            {csvFile && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sui-600">
                <CheckCircle className="h-4 w-4" />
                <span>{csvFile.name}</span>
              </div>
            )}
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">CSV Format:</p>
                <p>address,tier (one per line)</p>
                <p className="mt-1">Example: 0x1234...5678,GA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary & Submit */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event</span>
              <span className="font-medium">
                {selectedEvent
                  ? MOCK_EVENTS.find((e) => e.id === selectedEvent)?.name
                  : "—"}
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas Fee</span>
              <span className="font-medium text-sui-600">Paid by you</span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleBatchMint}
            disabled={!selectedEvent || isMinting}
          >
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
        </CardContent>
      </Card>
    </div>
  );
}
