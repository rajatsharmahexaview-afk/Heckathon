import React from "react";
import { useApp } from "@/contexts/AppContext";
import { X, CheckCircle, AlertCircle, Bell as BellIcon, Gift, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const eventIcons: Record<string, React.ReactNode> = {
  proof_submitted: <AlertCircle className="text-warning" size={22} />,
  milestone_approved: <CheckCircle className="text-success" size={22} />,
  gift_unlocked: <Gift className="text-primary" size={22} />,
  emergency_requested: <AlertCircle className="text-destructive" size={22} />,
  gift_created: <Gift className="text-success" size={22} />,
  memo_added: <MessageSquare className="text-info" size={22} />,
};

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const { notifications, markNotificationRead } = useApp();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-background/60 backdrop-blur-sm absolute inset-0" />
      <div
        className="relative w-full max-w-md bg-card shadow-2xl h-full animate-slide-in-right overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BellIcon size={22} className="text-primary" />
            Notifications
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close notifications">
            <X size={22} />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BellIcon size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg">No notifications yet</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${notif.is_read
                    ? "bg-background border-border"
                    : "bg-primary/5 border-primary/20 shadow-soft"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {eventIcons[notif.event_type] || <BellIcon size={22} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-base ${notif.is_read ? "text-muted-foreground" : "font-semibold text-foreground"}`}>
                      {notif.message}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatTimeAgo(notif.created_at)}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default NotificationDrawer;
