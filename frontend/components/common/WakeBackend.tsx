"use client";

import { useEffect } from "react";

// Wakes the Render free-tier instance (cold start ~50s) the moment any page
// loads, so the boot overlaps with the user reading the page. Re-pings every
// 10 min (< Render's 15 min idle sleep) while the tab stays open.
export default function WakeBackend() {
  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/v1$/, "");
    if (!base) return;
    const ping = () => {
      fetch(`${base}/health`, { keepalive: true }).catch(() => {});
    };
    ping();
    const t = setInterval(ping, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, []);
  return null;
}
