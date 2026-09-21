"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduit } from "@/lib/useConduit";
import { User, MapPin, Calendar, Ticket, Wallet } from "lucide-react";
import { useParams } from "next/navigation";

export default function OrganizerProfilePage() {
  const { truncateAddress, isConnected, connectWallet } = useConduit();
  const params = useParams();
  const orgAddress = params.address as string;

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">Connect to view organizer profiles.</p>
          <Button onClick={connectWallet} size="lg">Connect Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-conduit-500 to-sui-500 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold">Organizer</h1>
                <Badge variant="secondary">Verified</Badge>
              </div>
              <p className="text-muted-foreground font-mono mb-4">
                {truncateAddress(orgAddress)}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Sui Testnet
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
