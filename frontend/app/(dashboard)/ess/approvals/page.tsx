"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import {
  ClipboardCheck,
  Check,
  X,
  AlertCircle,
  Clock,
  Loader2,
  MessageSquare,
  UserCheck,
  Banknote,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface ApprovalItem {
  id: number;
  instance_id: number;
  step_name: string;
  entity_type: string;
  entity_id: number;
  entity_summary: string;
  requester_name: string;
  requester_avatar: string;
  status: string;
  created_at: string;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchApprovals = () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { per_page: "50" };
    if (activeTab !== "all") params.status = activeTab;
    apiGet<{ items: ApprovalItem[] }>("/workflows/approvals/list", params)
      .then((res) => setApprovals(res.items || []))
      .catch(() => setError("Failed to load approvals"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApprovals();
  }, [activeTab]);

  const handleAction = async (approvalId: number, action: "approved" | "rejected", comment: string = "") => {
    setProcessing(approvalId);
    setError(null);
    try {
      await apiPost(`/workflows/approvals/${approvalId}/action`, {
        status: action,
        comment: comment || null,
      });
      fetchApprovals();
    } catch {
      setError("Failed to process approval");
    } finally {
      setProcessing(null);
    }
  };

  const pendingCount = approvals.filter((a) => a.status === "pending").length;
  const stats: Stats = {
    pending: pendingCount,
    approved: approvals.filter((a) => a.status === "approved").length,
    rejected: approvals.filter((a) => a.status === "rejected").length,
    total: approvals.length,
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "loan": return <Banknote className="h-4 w-4" />;
      case "leave": return <Calendar className="h-4 w-4" />;
      default: return <ClipboardCheck className="h-4 w-4" />;
    }
  };

  const getEntityLink = (type: string, id: number) => {
    if (type === "loan") return `/hr/payroll/loans/${id}`;
    if (type === "leave") return `/hr/leaves/${id}`;
    return "#";
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Approvals"
        description="Review and process pending approval requests."
        icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "ESS", href: "/ess" },
          { label: "Approvals" },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-warning/10 rounded-xl"><Clock className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{loading ? "..." : stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-500/10 rounded-xl"><Check className="h-5 w-5 text-green-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-xl font-bold">{loading ? "..." : stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 rounded-xl"><X className="h-5 w-5 text-red-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-xl font-bold">{loading ? "..." : stats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl"><ClipboardCheck className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{loading ? "..." : stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "pending", label: "Pending", count: stats.pending },
          { id: "approved", label: "Approved", count: stats.approved },
          { id: "rejected", label: "Rejected", count: stats.rejected },
          { id: "all", label: "All", count: stats.total },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{tab.count}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="py-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading approvals...
          </div>
        ) : approvals.length === 0 ? (
          <div className="py-12 text-center">
            <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {activeTab === "pending" ? "No pending approvals." : "No approvals found."}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {activeTab === "pending" ? "You're all caught up!" : ""}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {approvals.map((approval) => (
              <div key={approval.id} className="p-4 hover:bg-muted/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {(approval.requester_name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{approval.entity_summary || `${approval.entity_type}#${approval.entity_id}`}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                          {getEntityIcon(approval.entity_type)}
                          {approval.entity_type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Requested by {approval.requester_name || "Unknown"} · Step: {approval.step_name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        {approval.created_at ? new Date(approval.created_at).toLocaleString() : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {approval.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleAction(approval.id, "approved")}
                          disabled={processing === approval.id}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {processing === approval.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(approval.id, "rejected")}
                          disabled={processing === approval.id}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        approval.status === "approved" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {approval.status === "approved" ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {approval.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
