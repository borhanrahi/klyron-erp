"use client";

import { useState } from "react";
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
} from "lucide-react";

const campaigns = [
  {
    id: "CMP-001",
    name: "Spring Product Launch",
    type: "Email",
    status: "Active",
    statusVariant: "success" as const,
    sent: 12450,
    opened: 8715,
    clicked: 3240,
    conversions: 456,
    openRate: "70.0%",
    clickRate: "26.1%",
    startDate: "Mar 15, 2024",
    endDate: "Apr 15, 2024",
    budget: "$5,000",
    spent: "$3,200",
  },
  {
    id: "CMP-002",
    name: "Customer Re-engagement",
    type: "Email",
    status: "Completed",
    statusVariant: "muted" as const,
    sent: 8320,
    opened: 4160,
    clicked: 1248,
    conversions: 187,
    openRate: "50.0%",
    clickRate: "30.0%",
    startDate: "Feb 1, 2024",
    endDate: "Feb 28, 2024",
    budget: "$3,000",
    spent: "$2,850",
  },
  {
    id: "CMP-003",
    name: "Referral Program Promo",
    type: "SMS",
    status: "Active",
    statusVariant: "success" as const,
    sent: 5600,
    opened: 0,
    clicked: 1680,
    conversions: 234,
    openRate: "N/A",
    clickRate: "30.0%",
    startDate: "Mar 20, 2024",
    endDate: "Apr 20, 2024",
    budget: "$2,000",
    spent: "$1,100",
  },
  {
    id: "CMP-004",
    name: "Webinar Invitation",
    type: "Email",
    status: "Draft",
    statusVariant: "warning" as const,
    sent: 0,
    opened: 0,
    clicked: 0,
    conversions: 0,
    openRate: "-",
    clickRate: "-",
    startDate: "Apr 10, 2024",
    endDate: "Apr 10, 2024",
    budget: "$1,500",
    spent: "$0",
  },
  {
    id: "CMP-005",
    name: "Holiday Special Offer",
    type: "Email",
    status: "Completed",
    statusVariant: "muted" as const,
    sent: 15200,
    opened: 10640,
    clicked: 4560,
    conversions: 892,
    openRate: "70.0%",
    clickRate: "42.9%",
    startDate: "Dec 15, 2023",
    endDate: "Jan 5, 2024",
    budget: "$8,000",
    spent: "$7,500",
  },
];

const campaignStats = [
  { label: "Active Campaigns", value: "2", change: "Running now" },
  { label: "Total Sent", value: "41,570", change: "All time" },
  { label: "Avg. Open Rate", value: "63.3%", change: "+5.2% vs industry" },
  { label: "Total Conversions", value: "1,769", change: "+12% this quarter" },
];

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
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
                  Sent
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Open Rate
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Conversions
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
                      <p className="text-xs text-muted-foreground">{campaign.startDate} - {campaign.endDate}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <StatusBadge status={campaign.type} variant="muted" />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{campaign.sent.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm font-medium">{campaign.openRate}</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm font-medium">{campaign.conversions.toLocaleString()}</span>
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
      </div>
    </div>
  );
}
