"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduit } from "@/lib/useConduit";
import { Bell, Ticket, Wallet, CheckCircle } from "lucide-react";

export default function NotificationsPage() {
  const { isConnected, connectWallet } = useConduit();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">Connect to view notifications.</p>
          <Button onClick={connectWallet} size="lg">Connect Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Notifications
        </h1>
      </div>

      <div className="text-center py-16 text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>No new notifications.</p>
        <p className="text-sm mt-2">You&apos;ll be notified when tickets are purchased, events start, and more.</p>
      </div>
    </div>
  );
}
