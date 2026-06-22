"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Search, Menu, User, Settings, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const settingsLinks = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Billing", href: "/settings/billing", icon: Settings },
  { label: "Theme", href: "/settings/theme", icon: Settings },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Currencies", href: "/settings/currencies", icon: Settings },
];

export function TopNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [userName, setUserName] = useState("Admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }

  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

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
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

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
                  <div className="absolute left-full top-0 ml-1 w-48 rounded-xl border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
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
