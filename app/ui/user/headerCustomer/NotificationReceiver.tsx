"use client";

import { getNotiAction } from "@/app/actions/notificationsAction";
import { Notification } from "@/app/interface/notification";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils/formatDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface props {
  userId: string;
}
export default function NotificationReceiver({ userId }: props) {
  const esRef = useRef<EventSource | null>(null);
  useEffect(() => {
    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sse?userId=${userId}`
    );
    esRef.current = es;
    es.addEventListener("new_chapter", (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      console.log("payload", payload);
      setNotifications(payload);
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);
  useEffect(() => {
    const getDb = async () => {
      const res = await getNotiAction(userId, 1);
      setNotifications(res!);
    };
    getDb();
  }, []);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[] | []>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const notiContainerRef = useRef<HTMLDivElement | null>(null);

  const loadMoreNotifications = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newNotifications = await getNotiAction(userId, page + 1);

      if (newNotifications && newNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifications]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!notiContainerRef.current || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && hasMore) {
          setIsLoading(true);
          loadMoreNotifications();
        }
      },
      {
        root: notiContainerRef.current,
        rootMargin: "0px 50px 0px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [notiContainerRef.current, sentinelRef.current, isLoading, hasMore]);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {notifications.length ?? ""}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <span className="text-xs text-muted-foreground">
            {notifications.length > 1
              ? `You have ${notifications.length ?? ""} unread notifications`
              : `You have ${notifications.length ?? ""} unread notification`}
          </span>
        </div>
        <div className="max-h-96 overflow-y-auto" ref={notiContainerRef}>
          {!notifications || notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-border h-96">
              {notifications.map((notification) => (
                <Link
                  href={`/book/${notification.book_id}/chapter/${notification.chapter_id}`}
                  key={notification.id}
                  className="flex flex-row gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer h-26"
                >
                  <div className="relative group rounded-md w-16 h-full overflow-auto">
                    <Image
                      fill
                      className="object-cover"
                      src={notification.book_image}
                      alt={notification.book_name ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0 text-foreground text-sm">
                    <p>
                      Don't miss it! {notification.book_name} Chapter
                      {notification.chapter_number} is out now!
                    </p>
                    {/* {notification.title && (
                      <p className="text-sm text-muted-foreground leading-tight">
                        {notification.title}
                      </p>
                    )} */}
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
              <div
                ref={sentinelRef}
                className="h-10 flex items-center justify-center"
              >
                {isLoading && (
                  <span className="text-sm text-muted-foreground">
                    Loading ...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
