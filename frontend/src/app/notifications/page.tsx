"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BellOff,
  CheckCircle,
  Ticket,
  DollarSign,
  Calendar,
  Star,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";

// Mock notifications
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "ticket_purchased",
    title: "Ticket Purchased",
    message: "Your ticket for Web3 Conference 2024 has been confirmed.",
    timestamp: Date.now() - 3600000,
    read: false,
    action_url: "/my-tickets",
  },
  {
    id: "2",
    type: "event_reminder",
    title: "Event Tomorrow",
    message: "Sui Builder House SF starts in 24 hours. Don't forget to attend!",
    timestamp: Date.now() - 7200000,
    read: false,
    action_url: "/events/1",
  },
  {
    id: "3",
    type: "royalty_received",
    title: "Royalty Received",
    message: "You received 0.5 SUI from a ticket resale on NFT Art Gallery.",
    timestamp: Date.now() - 86400000,
    read: true,
    action_url: "/dashboard",
  },
  {
    id: "4",
    type: "points_earned",
    title: "Points Earned",
    message: "You earned 50 points for attending DeFi Night Tokyo!",
    timestamp: Date.now() - 172800000,
    read: true,
    action_url: "/loyalty",
  },
  {
    id: "5",
    type: "event_approved",
    title: "Event Approved",
    message: "Your event 'Move Workshop' has been approved and is now live.",
    timestamp: Date.now() - 259200000,
    read: true,
    action_url: "/dashboard",
  },
];

const NOTIFICATION_ICONS: Record<string, any> = {
  ticket_purchased: Ticket,
  event_reminder: Calendar,
  royalty_received: DollarSign,
  points_earned: Star,
  event_approved: CheckCircle,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-muted-foreground mt-1">
              You&apos;re all caught up! Check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
            const timeAgo = getTimeAgo(notification.timestamp);

            return (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-conduit-200 bg-conduit-50/50" : ""
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                }}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notification.read
                        ? "bg-conduit-100 text-conduit-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-medium ${
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-conduit-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
