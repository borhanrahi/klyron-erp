"use client";

import { useEffect, useState } from "react";
import { Bell, Search, Menu, User, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function TopNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [userName, setUserName] = useState("Admin");

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

        <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:flex">
          <Settings className="h-5 w-5" />
        </button>

        <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

        <Link
          href="/settings"
          className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium hidden lg:block">{userName}</span>
        </Link>
      </div>
    </header>
  );
}
