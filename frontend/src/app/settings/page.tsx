"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
import {
  Bell,
  Mail,
  Shield,
  User,
  Wallet,
  CheckCircle,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { isConnected, address, connectWallet } = useConduitWallet();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email_purchases: true,
    email_reminders: true,
    email_promotions: false,
    push_purchases: true,
    push_reminders: true,
    push_promotions: false,
  });

  const handleSave = async () => {
    setSaved(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaved(false);
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
            Connect your wallet to access settings.
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Display Name</label>
            <Input placeholder="Enter your name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Bio</label>
            <textarea
              className="w-full min-h-[80px] rounded-lg border bg-background px-3 py-2 text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Website</label>
            <Input type="url" placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </h4>
            {[
              { key: "email_purchases", label: "Purchase confirmations" },
              { key: "email_reminders", label: "Event reminders" },
              { key: "email_promotions", label: "Promotions & news" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm">{item.label}</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={
                    notifications[item.key as keyof typeof notifications]
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                />
              </label>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Push Notifications
            </h4>
            {[
              { key: "push_purchases", label: "Purchase confirmations" },
              { key: "push_reminders", label: "Event reminders" },
              { key: "push_promotions", label: "Promotions & news" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm">{item.label}</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={
                    notifications[item.key as keyof typeof notifications]
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wallet */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet
          </CardTitle>
          <CardDescription>
            Your connected wallet information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {address && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sui-100 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-sui-600" />
                </div>
                <div>
                  <div className="font-medium">Connected Wallet</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {address.slice(0, 10)}...{address.slice(-6)}
                  </div>
                </div>
              </div>
              <Badge variant="success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security
              </div>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Session History</div>
              <div className="text-sm text-muted-foreground">
                View and manage active sessions
              </div>
            </div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saved}>
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
