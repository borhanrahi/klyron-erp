"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Megaphone, Info, AlertTriangle, Star } from "lucide-react";

export default function ESSAnnouncementsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Announcements"
        description="Company-wide announcements and updates."
        icon={<Megaphone className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center">
        <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No announcements at this time.</p>
        <p className="text-xs text-muted-foreground mt-1">Company announcements will appear here.</p>
      </div>
    </div>
  );
}
