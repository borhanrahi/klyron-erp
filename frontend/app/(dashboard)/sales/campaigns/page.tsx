"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Megaphone,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  BarChart3,
  Users,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const campaigns = [
  {
    id: "CMP-001",
    name: "Q1 Product Launch",
    type: "Email",
    status: "Active",
    statusVariant: "success" as const,
    startDate: "Jan 15, 2024",
    endDate: "Mar 31, 2024",
    sent: 12500,
    opened: 4375,
    clicked: 1062,
    conversions: 85,
    budget: "$15,000",
    spent: "$12,400",
  },
  {
    id: "CMP-002",
    name: "Webinar Series 2024",
    type: "Event",
    status: "Active",
    statusVariant: "success" as const,
    startDate: "Feb 1, 2024",
    endDate: "Apr 30, 2024",
    sent: 8500,
    opened: 3400,
    clicked: 850,
    conversions: 42,
    budget: "$25,000",
    spent: "$18,500",
  },
  {
    id: "CMP-003",
    name: "LinkedIn Outreach",
    type: "Social",
    status: "Paused",
    statusVariant: "warning" as const,
    startDate: "Mar 1, 2024",
    endDate: "Jun 30, 2024",
    sent: 5000,
    opened: 1750,
    clicked: 425,
    conversions: 28,
    budget: "$10,000",
    spent: "$6,200",
  },
  {
    id: "CMP-004",
    name: "Customer Referral Program",
    type: "Referral",
    status: "Active",
    statusVariant: "success" as const,
    startDate: "Jan 1, 2024",
    endDate: "Dec 31, 2024",
    sent: 3200,
    opened: 1920,
    clicked: 640,
    conversions: 56,
    budget: "$20,000",
    spent: "$8,800",
  },
  {
    id: "CMP-005",
    name: "Summer Promo Blast",
    type: "Email",
    status: "Completed",
    statusVariant: "muted" as const,
    startDate: "Jun 1, 2023",
    endDate: "Aug 31, 2023",
    sent: 18000,
    opened: 6300,
    clicked: 1440,
    conversions: 120,
    budget: "$12,000",
    spent: "$11,800",
  },
  {
    id: "CMP-006",
    name: "Trade Show Follow-up",
    type: "Email",
    status: "Draft",
    statusVariant: "info" as const,
    startDate: "Apr 15, 2024",
    endDate: "May 15, 2024",
    sent: 0,
    opened: 0,
    clicked: 0,
    conversions: 0,
    budget: "$5,000",
    spent: "$0",
  },
];

const campaignStats = [
  { label: "Active Campaigns", value: "8", change: "+2 this month" },
  { label: "Total Sent", value: "47.2K", change: "+8.5K this quarter" },
  { label: "Avg. Open Rate", value: "34.2%", change: "+2.1% vs industry" },
  { label: "Total Conversions", value: "331", change: "+68 this month" },
];

export default function CampaignsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Campaigns
        </span>
      </div>

      <PageHeader
        title="Campaigns"
        description="Track and manage your marketing campaigns."
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </button>
            <Link
              href="/sales/campaigns/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaignStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
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
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>
        </div>

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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Sent
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Open Rate
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Conversions
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Budget
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.id} • {campaign.startDate} — {campaign.endDate}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {campaign.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={campaign.status}
                      variant={campaign.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {campaign.sent.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {campaign.sent > 0
                        ? `${((campaign.opened / campaign.sent) * 100).toFixed(1)}%`
                        : "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm font-semibold text-success">
                      {campaign.conversions}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {campaign.spent} / {campaign.budget}
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
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger">
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
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              2
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
