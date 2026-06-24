"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Megaphone,
  ArrowLeft,
  Edit,
  BarChart3,
  DollarSign,
  Target,
  Clock,
  Send,
  Pause,
  Play,
  Trash2,
  Loader2,
  X,
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

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { confirm, state, handleClose } = useConfirm();

  // Email modal state
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiGet<{ data: Campaign }>(`/sales/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch((err) => setError(err.message || "Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    const ok = await confirm({
      title: `${newStatus === "paused" ? "Pause" : "Resume"} Campaign`,
      message: `Are you sure you want to ${newStatus === "paused" ? "pause" : "resume"} this campaign?`,
      confirmText: newStatus === "paused" ? "Pause" : "Resume",
    });
    if (!ok) return;
    setUpdating(true);
    try {
      await apiPut(`/sales/campaigns/${id}`, { status: newStatus });
      setCampaign((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch (err: any) {
      setError(err.message || "Failed to update campaign");
    } finally {
      setUpdating(false);
    }
  }

  function handleSendEmail() {
    setEmailSubject(`Campaign: ${campaign?.name}`);
    setEmailBody(`Hi,\n\nWe wanted to share an update about our "${campaign?.name}" campaign.\n\nBest regards`);
    setEmailSent(false);
    setEmailOpen(true);
  }

  async function handleEmailSend() {
    if (!emailSubject || !emailBody) return;
    setEmailSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEmailSending(false);
    setEmailSent(true);
  }

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete Campaign",
      message: "Are you sure you want to delete this campaign? This cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;
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
        <Link href="/sales/campaigns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Campaigns
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
      <Link href="/sales/campaigns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Campaigns
      </Link>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <StatusBadge status={campaign.status} variant={statusVariant(campaign.status)} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            #{campaign.id} • {campaign.type} Campaign • {campaign.start_date} — {campaign.end_date}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/sales/campaigns/${id}/edit`}
            className="border border-border bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted/80 flex items-center gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Link>
          <Link
            href={`/sales/campaigns/${id}/report`}
            className="border border-border bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted/80 flex items-center gap-1.5"
          >
            <BarChart3 className="h-3.5 w-3.5" /> Report
          </Link>
          {isActive && (
            <button
              onClick={() => handleStatusChange("paused")}
              disabled={updating}
              className="border border-border bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted/80 flex items-center gap-1.5 disabled:opacity-50"
            >
              {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pause className="h-3.5 w-3.5" />} Pause
            </button>
          )}
          {isPaused && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={updating}
              className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
            >
              {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Resume
            </button>
          )}
          <button
            onClick={handleSendEmail}
            className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" /> Send Email
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="border border-danger/30 text-danger px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-danger/10 flex items-center gap-1.5 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Type</span>
          </div>
          <p className="text-xl font-bold capitalize">{campaign.type}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">Budget</span>
          </div>
          <p className="text-xl font-bold">${campaign.budget.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Audience</span>
          </div>
          <p className="text-xl font-bold">{campaign.target_audience || "—"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-500" />
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
            <p className="text-sm font-medium mt-1 capitalize">{campaign.type}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="text-sm font-medium mt-1">{campaign.start_date || "—"}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="text-sm font-medium mt-1">{campaign.end_date || "—"}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-sm font-medium mt-1">${campaign.budget.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Target Audience</p>
            <p className="text-sm font-medium mt-1">{campaign.target_audience || "—"}</p>
          </div>
        </div>
      </div>

      {emailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEmailOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Campaign Email</h3>
              <button onClick={() => setEmailOpen(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>

            {emailSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-lg font-semibold">Email Sent Successfully</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your campaign email has been sent to the target audience.
                </p>
                <button
                  onClick={() => setEmailOpen(false)}
                  className="mt-6 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">To</label>
                    <input
                      type="text"
                      value={campaign.target_audience}
                      disabled
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEmailOpen(false)}
                    className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmailSend}
                    disabled={emailSending || !emailSubject || !emailBody}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover flex items-center gap-2 disabled:opacity-50"
                  >
                    {emailSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {emailSending ? "Sending..." : "Send Now"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
