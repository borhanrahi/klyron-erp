"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Bell, Search, Menu, User, Settings, ChevronRight, LogOut,
  CheckCircle, AlertTriangle, Info, MessageSquare, Clock,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { apiGet, apiPut } from "@/lib/api";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: number | null;
  is_read: boolean;
  created_at: string;
}

const settingsLinks = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Billing", href: "/settings/billing", icon: Settings },
  { label: "Theme", href: "/settings/theme", icon: Settings },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Currencies", href: "/settings/currencies", icon: Settings },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function notifIcon(type: string) {
  switch (type) {
    case "success": return <CheckCircle className="h-4 w-4 text-success" />;
    case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "error": return <AlertTriangle className="h-4 w-4 text-danger" />;
    case "message": return <MessageSquare className="h-4 w-4 text-info" />;
    default: return <Info className="h-4 w-4 text-primary" />;
  }
}

export function TopNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [userName, setUserName] = useState("Admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.full_name) setUserName(d.full_name);
      })
      .catch(() => {});
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await apiGet<{ items: Notification[]; total: number }>("/admin/notifications", {
        per_page: "20",
      });
      const items = res.items || [];
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.is_read).length);
    } catch {
      /* not logged in or no perms */
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSettingsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAsRead(id: number) {
    try {
      await apiPut(`/admin/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Left: Mobile Menu Toggle + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-64 lg:w-96 pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); setSettingsOpen(false); }}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-danger text-white text-[10px] font-bold px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-150 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      for (const n of notifications.filter((n) => !n.is_read)) {
                        await markAsRead(n.id);
                      }
                    }}
                    className="text-xs text-primary hover:text-primary-hover transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (!n.is_read) markAsRead(n.id);
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                        !n.is_read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notifIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.is_read ? "font-semibold" : "font-medium"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="border-t border-border px-4 py-2.5 text-center">
                  <Link
                    href="/settings/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs text-primary hover:text-primary-hover transition-colors"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <ThemeToggle />

        <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setSettingsOpen(false); }}
            className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
            <span className="text-sm font-medium hidden lg:block">{userName}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
              </div>

              {/* Settings submenu */}
              <div
                className="relative"
                onMouseEnter={() => setSettingsOpen(true)}
                onMouseLeave={() => setSettingsOpen(false)}
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                  onClick={() => setSettingsOpen(!settingsOpen)}
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Settings
                  </span>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${settingsOpen ? "rotate-90" : ""}`} />
                </button>

                {settingsOpen && (
                  <div className="absolute right-full top-0 mr-1 w-48 rounded-xl border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    {settingsLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                        onClick={() => { setDropdownOpen(false); setSettingsOpen(false); }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-muted/50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
