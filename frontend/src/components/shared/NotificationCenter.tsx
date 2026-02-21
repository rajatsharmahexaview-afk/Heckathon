import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useApp } from '@/contexts/AppContext';
import {
    Bell,
    CheckCircle2,
    Clock,
    Gift,
    AlertCircle,
    X,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const eventTypeIcons: Record<string, React.ReactNode> = {
    gift_created: <Gift className="text-primary" size={18} />,
    milestone_approved: <CheckCircle2 className="text-success" size={18} />,
    payment_disbursed: <CreditCard className="text-blue-500" size={18} />,
    emergency_requested: <AlertCircle className="text-destructive" size={18} />,
    reminder: <Clock className="text-warm-500" size={18} />,
};

const NotificationCenter: React.FC = () => {
    const { currentUser } = useApp();
    const { notifications, unreadCount, markRead } = useNotifications(currentUser?.id);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-2xl hover:bg-secondary transition-colors">
                    <Bell size={24} className="text-muted-foreground" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full border-2 border-background p-0 text-[10px] font-bold animate-in bounce-in"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 rounded-3xl border-2 shadow-2xl overflow-hidden" align="end">
                <div className="bg-secondary/30 p-4 border-b flex items-center justify-between">
                    <h3 className="font-black text-lg">Notifications</h3>
                    <Badge variant="outline" className="rounded-lg">{unreadCount} New</Badge>
                </div>
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                            <Bell size={48} className="mb-2" />
                            <p className="font-medium">All caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 hover:bg-secondary/10 transition-colors flex gap-4 items-start group ${!notif.is_read ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="mt-1 shrink-0 p-2 bg-background rounded-xl border shadow-sm group-hover:scale-110 transition-transform">
                                        {eventTypeIcons[notif.event_type] || <Bell size={18} />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-bold leading-tight">{notif.message}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                            <span>{new Date(notif.created_at).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    {!notif.is_read && (
                                        <button
                                            onClick={() => markRead(notif.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded-lg transition-all"
                                            title="Mark as read"
                                        >
                                            <X size={14} className="text-muted-foreground" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-3 bg-secondary/10 border-t text-center">
                        <Button variant="link" className="text-xs font-bold text-primary hover:no-underline">
                            View All Notifications
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default NotificationCenter;
