"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Megaphone,
  Search,
  Plus,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm } from "@/components/common/ConfirmModal";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
  start_date: string;
  end_date: string;
  target_audience: string;
  budget: number;
}

function mapStatusVariant(status: string): Campaign["statusVariant"] {
  const s = (status || "").toLowerCase();
  if (s === "active" || s === "running" || s === "completed") return "success";
  if (s === "paused" || s === "pending" || s === "planning") return "warning";
  if (s === "cancelled" || s === "failed") return "danger";
  if (s === "draft" || s === "new") return "info";
  return "primary";
}

function mapCampaign(raw: any): Campaign {
  return {
    id: String(raw.id ?? ""),
    name: raw.name ?? "",
    type: raw.type ?? "",
    status: raw.status ?? "draft",
    statusVariant: mapStatusVariant(raw.status),
    start_date: raw.start_date ?? "",
    end_date: raw.end_date ?? "",
    target_audience: raw.target_audience ?? "",
    budget: Number(raw.budget) || 0,
  };
}

const PER_PAGE = 10;

export default function CampaignsListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, activeCount: 0, draftCount: 0, completedCount: 0 });
  const confirm = useConfirm();

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        per_page: String(PER_PAGE),
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== "All") params.status = selectedStatus.toLowerCase();
      const res = await apiGet<any>("/sales/campaigns", params);
      const items = (res.items ?? res.data ?? []).map(mapCampaign);
      setCampaigns(items);
      setTotal(res.total ?? items.length);
      setTotalPages(res.pages ?? 1);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedStatus]);

  const fetchStats = useCallback(async () => {
    try {
      const [totalRes, activeRes, draftRes, completedRes] = await Promise.all([
        apiGet<any>("/sales/campaigns", { page: "1", per_page: "1" }),
        apiGet<any>("/sales/campaigns", { page: "1", per_page: "1", status: "active" }),
        apiGet<any>("/sales/campaigns", { page: "1", per_page: "1", status: "draft" }),
        apiGet<any>("/sales/campaigns", { page: "1", per_page: "1", status: "completed" }),
      ]);
      setStats({
        total: totalRes.total ?? 0,
        activeCount: activeRes.total ?? 0,
        draftCount: draftRes.total ?? 0,
        completedCount: completedRes.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);
  useEffect(() => { setPage(1); }, [searchTerm, selectedStatus]);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Campaign",
      message: "Are you sure you want to delete this campaign?",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await apiDelete(`/sales/campaigns/${id}`);
      fetchCampaigns();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const statCards = [
    { label: "Total Campaigns", value: stats.total, icon: <Megaphone className="h-5 w-5 text-primary" /> },
    { label: "Active", value: stats.activeCount, icon: <Megaphone className="h-5 w-5 text-emerald-500" /> },
    { label: "Draft", value: stats.draftCount, icon: <Megaphone className="h-5 w-5 text-blue-500" /> },
    { label: "Completed", value: stats.completedCount, icon: <Megaphone className="h-5 w-5 text-amber-500" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Campaigns</span>
      </div>

      <PageHeader
        title="Campaigns"
        description="Track and manage your marketing campaigns."
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/campaigns/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="planning">Planning</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading campaigns...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground text-sm">No campaigns found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Campaign</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Audience</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Budget</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Duration</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">{campaign.type}</p>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground capitalize">{campaign.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={campaign.status} variant={campaign.statusVariant} />
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">{campaign.target_audience}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          {campaign.budget.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : "—"}
                          {" — "}
                          {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/sales/campaigns/${campaign.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(campaign.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {total > 0 ? `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, total)} of ${total}` : "No results"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === page ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
