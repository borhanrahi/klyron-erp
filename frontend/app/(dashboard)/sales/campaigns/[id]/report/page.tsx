"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PageHeader } from "@/components/common/PageHeader";
import {
  ArrowLeft,
  Megaphone,
  DollarSign,
  Target,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  target_audience: string;
}

function statusVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  switch (status?.toLowerCase()) {
    case "active": return "success";
    case "paused": return "warning";
    case "completed": return "info";
    case "cancelled": return "danger";
    case "draft": return "muted";
    default: return "info";
  }
}

export default function CampaignReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: Campaign }>(`/sales/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Link href="/sales/campaigns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Campaigns
        </Link>
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-danger font-medium">Campaign not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span>/</span>
        <Link href="/sales/campaigns" className="hover:text-foreground transition-colors">Campaigns</Link>
        <span>/</span>
        <Link href={`/sales/campaigns/${id}`} className="hover:text-foreground transition-colors">#{id}</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Report</span>
      </div>

      <PageHeader
        title={`${campaign.name} — Report`}
        description="Campaign performance overview."
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href={`/sales/campaigns/${id}`}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaign
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="text-xl font-bold capitalize">{campaign.type}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="text-xl font-bold">${campaign.budget.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Audience</p>
            <p className="text-lg font-bold">{campaign.target_audience || "—"}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge status={campaign.status} variant={statusVariant(campaign.status)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Campaign Timeline</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="text-sm font-medium mt-1">
              {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : "—"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="text-sm font-medium mt-1">
              {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Email and conversion tracking will appear here once the campaign is live.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-3xl font-bold text-primary">—</p>
            <p className="text-sm text-muted-foreground mt-1">Emails Sent</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-3xl font-bold text-emerald-500">—</p>
            <p className="text-sm text-muted-foreground mt-1">Open Rate</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-3xl font-bold text-blue-500">—</p>
            <p className="text-sm text-muted-foreground mt-1">Click Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
