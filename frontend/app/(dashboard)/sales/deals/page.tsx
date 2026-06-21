"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  TrendingUp,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Target,
} from "lucide-react";
import Link from "next/link";

const deals = [
  {
    id: "D-001",
    title: "Enterprise Platform Migration",
    company: "Acme Corp",
    value: "$125,000",
    stage: "Negotiation",
    stageVariant: "warning" as const,
    probability: 75,
    expectedClose: "Apr 15, 2024",
    owner: "Mike Johnson",
    created: "Feb 20, 2024",
  },
  {
    id: "D-002",
    title: "Cloud Infrastructure Setup",
    company: "TechStart Inc",
    value: "$87,500",
    stage: "Proposal",
    stageVariant: "info" as const,
    probability: 50,
    expectedClose: "Apr 30, 2024",
    owner: "Emily Davis",
    created: "Mar 5, 2024",
  },
  {
    id: "D-003",
    title: "Data Analytics Suite",
    company: "Global Industries",
    value: "$210,000",
    stage: "Discovery",
    stageVariant: "muted" as const,
    probability: 25,
    expectedClose: "May 20, 2024",
    owner: "Sarah Wilson",
    created: "Mar 10, 2024",
  },
  {
    id: "D-004",
    title: "Security Audit & Compliance",
    company: "Creative Solutions",
    value: "$45,000",
    stage: "Closed Won",
    stageVariant: "success" as const,
    probability: 100,
    expectedClose: "Mar 18, 2024",
    owner: "Mike Johnson",
    created: "Jan 15, 2024",
  },
  {
    id: "D-005",
    title: "ERP Implementation Phase 2",
    company: "DataFlow Systems",
    value: "$340,000",
    stage: "Negotiation",
    stageVariant: "warning" as const,
    probability: 80,
    expectedClose: "Apr 25, 2024",
    owner: "Emily Davis",
    created: "Feb 28, 2024",
  },
  {
    id: "D-006",
    title: "Mobile App Development",
    company: "Innovate Labs",
    value: "$95,000",
    stage: "Proposal",
    stageVariant: "info" as const,
    probability: 60,
    expectedClose: "May 10, 2024",
    owner: "Sarah Wilson",
    created: "Mar 12, 2024",
  },
  {
    id: "D-007",
    title: "Custom CRM Integration",
    company: "Quantum Enterprises",
    value: "$62,000",
    stage: "Discovery",
    stageVariant: "muted" as const,
    probability: 30,
    expectedClose: "Jun 1, 2024",
    owner: "Mike Johnson",
    created: "Mar 18, 2024",
  },
  {
    id: "D-008",
    title: "Digital Marketing Automation",
    company: "Nexus Digital",
    value: "$28,500",
    stage: "Closed Won",
    stageVariant: "success" as const,
    probability: 100,
    expectedClose: "Mar 12, 2024",
    owner: "Emily Davis",
    created: "Jan 28, 2024",
  },
];

const dealStats = [
  { label: "Total Pipeline", value: "$993,000", change: "+$120K this month" },
  { label: "Won This Month", value: "$73,500", change: "+18% vs last month" },
  { label: "Avg Deal Size", value: "$111,625", change: "+$8K vs last quarter" },
  { label: "Win Rate", value: "32.5%", change: "+4.2% vs last quarter" },
];

export default function DealsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage =
      selectedStage === "All" || deal.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Deals
        </span>
      </div>

      <PageHeader
        title="Deals"
        description="Manage your sales pipeline and track deal progress."
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <Link
              href="/sales/deals/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Deal
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dealStats.map((stat) => (
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
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Stage: All</option>
                <option value="Discovery">Discovery</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
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
                    Deal
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Value
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Stage
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Probability
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Expected Close
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDeals.map((deal) => (
                <tr
                  key={deal.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">{deal.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {deal.company}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold">{deal.value}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={deal.stage}
                      variant={deal.stageVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {deal.probability}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {deal.expectedClose}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/sales/deals/${deal.id}`}
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
            Showing {filteredDeals.length} of {deals.length} deals
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
