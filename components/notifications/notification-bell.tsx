"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, Trash2, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getNotifications, markAsRead, markAllAsRead } from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchNotifications = useCallback(async () => {
        try {
            const result = await getNotifications();
            if (result.success && result.data) {
                setNotifications(result.data.notifications);
                setUnreadCount(result.data.unreadCount);
            }
        } catch (err) {
            console.error("Error fetching notifications client-side:", err);
        }
    }, []);

    // Initial fetch + Polling every 15 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        const result = await markAsRead(id);
        if (!result.success) {
            toast.error("Failed to update notification");
            fetchNotifications(); // Revert on error
        } else {
            router.refresh();
        }
    };

    const handleMarkAllRead = async () => {
        setIsLoading(true);
        const result = await markAllAsRead();
        setIsLoading(false);

        if (result.success) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
            router.refresh();
        } else {
            toast.error("Failed to mark all as read");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case "error": return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10 hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-2xl border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden mt-2">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-muted/20">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            disabled={isLoading}
                            className="h-7 text-xs text-muted-foreground hover:text-primary px-2"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground gap-2 p-8 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                                <Bell className="h-6 w-6 opacity-20" />
                            </div>
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col p-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "relative group flex gap-3 p-4 transition-all hover:bg-muted/40 rounded-xl mb-1 mx-1 border border-transparent",
                                        !notification.read && "bg-primary/5 border-primary/10 hover:bg-primary/10"
                                    )}
                                >
                                    <div className="mt-1 shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={cn("text-sm font-medium leading-none", !notification.read ? "text-foreground" : "text-muted-foreground")}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 rounded-full hover:bg-background shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification.id);
                                            }}
                                        >
                                            <Check className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
