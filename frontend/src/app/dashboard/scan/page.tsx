"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useConduitWallet } from "@/lib/hooks";
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Ticket,
  User,
  Clock,
  Zap,
  Wallet,
} from "lucide-react";
import Link from "next/link";

type ScanResult = {
  success: boolean;
  ticket_id?: string;
  ticket_number?: number;
  tier?: string;
  event_name?: string;
  owner?: string;
  error?: string;
};

export default function VenueScannerPage() {
  const { isConnected, connectWallet } = useConduitWallet();
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<
    (ScanResult & { timestamp: number })[]
  >([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      // Fall back to manual input
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Simulate ticket verification
  const verifyTicket = async (ticketId: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate verification result
    const isValid = Math.random() > 0.2; // 80% success rate for demo

    const result: ScanResult = isValid
      ? {
          success: true,
          ticket_id: ticketId,
          ticket_number: Math.floor(Math.random() * 100) + 1,
          tier: Math.random() > 0.7 ? "VIP" : "GA",
          event_name: "Sui Builder House SF",
          owner: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        }
      : {
          success: false,
          error: "Invalid ticket or already used",
        };

    setScanResult(result);
    setScanHistory((prev) => [{ ...result, timestamp: Date.now() }, ...prev]);

    // Clear result after 5 seconds
    setTimeout(() => setScanResult(null), 5000);
  };

  // Handle manual submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      verifyTicket(manualInput.trim());
      setManualInput("");
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Connect your organizer wallet to scan tickets.
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
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
        <h1 className="text-3xl font-bold">Venue Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Scan QR codes or enter ticket IDs to check in attendees
        </p>
      </div>

      {/* Scanner Area */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Camera View */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-conduit-500 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-conduit-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-conduit-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-conduit-500 rounded-br-lg" />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <QrCode className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-muted-foreground">Camera preview</p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-4">
            {isScanning ? (
              <Button
                variant="outline"
                className="flex-1"
                onClick={stopCamera}
              >
                Stop Scanner
              </Button>
            ) : (
              <Button className="flex-1" onClick={startCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Start Scanner
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Manual Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="flex gap-4">
            <Input
              placeholder="Enter ticket ID..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!manualInput.trim()}>
              Verify
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Scan Result */}
      {scanResult && (
        <Card
          className={`mb-6 ${
            scanResult.success
              ? "border-sui-500 bg-sui-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {scanResult.success ? (
                <div className="h-12 w-12 rounded-full bg-sui-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              )}

              <div className="flex-1">
                {scanResult.success ? (
                  <>
                    <h3 className="text-lg font-semibold text-sui-900">
                      Valid Ticket ✓
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-sui-700">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        <span>
                          Ticket #{scanResult.ticket_number} — {scanResult.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{scanResult.owner}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-red-900">
                      Invalid Ticket ✗
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {scanResult.error}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Recent Scans</span>
              <Badge variant="secondary">{scanHistory.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanHistory.slice(0, 10).map((scan, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {scan.success ? (
                      <CheckCircle className="h-5 w-5 text-sui-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <div className="text-sm font-medium">
                        {scan.success
                          ? `Ticket #${scan.ticket_number}`
                          : "Invalid"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {scan.success ? scan.tier : scan.error}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-sui-600">
            {scanHistory.filter((s) => s.success).length}
          </div>
          <div className="text-sm text-muted-foreground">Checked In</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-red-500">
            {scanHistory.filter((s) => !s.success).length}
          </div>
          <div className="text-sm text-muted-foreground">Rejected</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">{scanHistory.length}</div>
          <div className="text-sm text-muted-foreground">Total Scans</div>
        </div>
      </div>
    </div>
  );
}
