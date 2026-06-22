"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Megaphone,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Mail,
  BarChart3,
  Loader2,
} from "lucide-react";
import { apiGet } from "@/lib/api";

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
  budget: number;
  spent: number;
  target_audience: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
}

interface CampaignListResponse {
  items: any[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

function mapStatusVariant(status: string): Campaign["statusVariant"] {
  const s = (status || "").toLowerCase();
  if (s === "active" || s === "completed") return "success";
  if (s === "draft" || s === "paused") return "warning";
  if (s === "cancelled") return "danger";
  if (s === "scheduled") return "info";
  return "muted";
}

function mapCampaign(raw: any): Campaign {
  return {
    id: raw.id,
    name: raw.name ?? "",
    type: raw.type ?? "Email",
    status: raw.status ?? "Draft",
    statusVariant: mapStatusVariant(raw.status),
    budget: Number(raw.budget) || 0,
    spent: Number(raw.spent) || 0,
    target_audience: raw.target_audience ?? "",
    start_date: raw.start_date ?? "",
    end_date: raw.end_date ?? "",
    description: raw.description ?? "",
    created_at: raw.created_at ?? "",
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await apiGet<CampaignListResponse>("/sales/campaigns");
        const items = (res.items ?? []).map(mapCampaign);
        setCampaigns(items);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" ||
      campaign.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const activeCount = campaigns.filter((c) => c.status.toLowerCase() === "active").length;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const completedCount = campaigns.filter((c) => c.status.toLowerCase() === "completed").length;

  const campaignStats = [
    { label: "Active Campaigns", value: String(activeCount), change: "Running now", icon: TrendingUp },
    { label: "Total Budget", value: formatCurrency(totalBudget), change: "Across all campaigns", icon: BarChart3 },
    { label: "Total Spent", value: formatCurrency(totalSpent), change: `${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget`, icon: Mail },
    { label: "Completed", value: String(completedCount), change: `${campaigns.length} total`, icon: Users },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Marketing Campaigns"
        description="Create, manage, and track your marketing campaigns."
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Campaigns" },
        ]}
        actions={
          <a
            href="/crm/campaigns/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaignStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
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
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Completed">Completed</option>
          <option value="Paused">Paused</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading campaigns...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        Campaign
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Type
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Budget
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Spent
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                      Audience
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <StatusBadge status={campaign.type} variant="muted" />
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">{formatCurrency(campaign.budget)}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm font-medium">{formatCurrency(campaign.spent)}</span>
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <span className="text-sm text-muted-foreground">{campaign.target_audience || "-"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={campaign.status} variant={campaign.statusVariant} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/crm/campaigns/${campaign.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && filteredCampaigns.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No campaigns found.
              </div>
            )}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCampaigns.length} of {campaigns.length} campaigns
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
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
