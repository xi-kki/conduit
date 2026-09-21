"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduit } from "@/lib/useConduit";
import { Shield, Wallet, Settings, Users, Ticket, BarChart3 } from "lucide-react";

export default function AdminPage() {
  const { isConnected, connectWallet, isDeployed, address } = useConduit();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-conduit-600" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-2">Platform administration and contract management</p>
      </div>

      {!isConnected ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-conduit-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">Connect the admin wallet to access this panel.</p>
          <Button onClick={connectWallet} size="lg">Connect Wallet</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contract Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Deployment</span>
                <Badge variant={isDeployed ? "success" : "secondary"}>
                  {isDeployed ? "Deployed" : "Not Deployed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">Sui Testnet</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Admin</span>
                <span className="font-mono text-xs">{address?.slice(0, 10)}...</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Users className="h-4 w-4 mr-2" />
                Manage Organizers
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <BarChart3 className="h-4 w-4 mr-2" />
                Platform Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
