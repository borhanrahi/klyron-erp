"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet, apiDelete } from "@/lib/api";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Megaphone,
  ArrowLeft,
  Edit,
  BarChart3,
  Users,
  Mail,
  MousePointerClick,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Clock,
  Eye,
  Send,
  Pause,
  Play,
  Trash2,
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
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "draft":
      return "muted";
    case "completed":
      return "info";
    case "cancelled":
      return "danger";
    default:
      return "info";
  }
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiGet<{ data: Campaign }>(`/sales/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch((err) => setError(err.message || "Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    setDeleting(true);
    try {
      await apiDelete(`/sales/campaigns/${id}`);
      router.push("/sales/campaigns");
    } catch (err: any) {
      setError(err.message || "Failed to delete campaign");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Link
          href="/sales/campaigns"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-danger font-medium">{error || "Campaign not found"}</p>
        </div>
      </div>
    );
  }

  const isActive = campaign.status?.toLowerCase() === "active";
  const isPaused = campaign.status?.toLowerCase() === "paused";

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      <Link
        href="/sales/campaigns"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <StatusBadge
              status={campaign.status}
              variant={statusVariant(campaign.status)}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            #{campaign.id} • {campaign.type} Campaign • {campaign.start_date} —{" "}
            {campaign.end_date}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View Report
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          {isActive && (
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </button>
          )}
          {isPaused && (
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Resume
            </button>
          )}
          {isActive && (
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Next Email
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="border border-danger/30 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/10 flex items-center gap-2 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Type</span>
          </div>
          <p className="text-xl font-bold">{campaign.type}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Budget</span>
          </div>
          <p className="text-xl font-bold">
            ${campaign.budget.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-info" />
            <span className="text-xs text-muted-foreground">Audience</span>
          </div>
          <p className="text-xl font-bold">{campaign.target_audience}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground">Status</span>
          </div>
          <p className="text-xl font-bold capitalize">{campaign.status}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Campaign Name</p>
            <p className="text-sm font-medium mt-1">{campaign.name}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium mt-1">{campaign.type}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="text-sm font-medium mt-1">{campaign.start_date}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="text-sm font-medium mt-1">{campaign.end_date}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-sm font-medium mt-1">
              ${campaign.budget.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Target Audience</p>
            <p className="text-sm font-medium mt-1">
              {campaign.target_audience}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
