"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Copy,
} from "lucide-react";

const estimates = [
  {
    id: "EST-2024-018",
    customer: "Acme Corp",
    date: "Mar 24, 2024",
    validUntil: "Apr 23, 2024",
    amount: "$18,500.00",
    items: 8,
    status: "Accepted",
    statusVariant: "success" as const,
  },
  {
    id: "EST-2024-019",
    customer: "TechStart Inc",
    date: "Mar 22, 2024",
    validUntil: "Apr 21, 2024",
    amount: "$12,750.00",
    items: 5,
    status: "Sent",
    statusVariant: "info" as const,
  },
  {
    id: "EST-2024-020",
    customer: "Global Industries",
    date: "Mar 20, 2024",
    validUntil: "Apr 19, 2024",
    amount: "$45,200.00",
    items: 18,
    status: "Draft",
    statusVariant: "muted" as const,
  },
  {
    id: "EST-2024-021",
    customer: "Creative Solutions",
    date: "Mar 18, 2024",
    validUntil: "Apr 17, 2024",
    amount: "$6,300.00",
    items: 3,
    status: "Expired",
    statusVariant: "danger" as const,
  },
  {
    id: "EST-2024-022",
    customer: "DataFlow Systems",
    date: "Mar 15, 2024",
    validUntil: "Apr 14, 2024",
    amount: "$28,900.00",
    items: 12,
    status: "Accepted",
    statusVariant: "success" as const,
  },
  {
    id: "EST-2024-023",
    customer: "Innovate Labs",
    date: "Mar 12, 2024",
    validUntil: "Apr 11, 2024",
    amount: "$9,450.00",
    items: 6,
    status: "Declined",
    statusVariant: "danger" as const,
  },
  {
    id: "EST-2024-024",
    customer: "Quantum Enterprises",
    date: "Mar 10, 2024",
    validUntil: "Apr 09, 2024",
    amount: "$52,800.00",
    items: 22,
    status: "Sent",
    statusVariant: "info" as const,
  },
];

const estimateStats = [
  { label: "Total Estimates", value: "42", change: "Q1 2024" },
  { label: "Total Value", value: "$173,900", change: "Pipeline value" },
  { label: "Win Rate", value: "68%", change: "+5% vs last quarter" },
  { label: "Pending", value: "8", change: "$89,200 value" },
];

export default function EstimatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredEstimates = estimates.filter((estimate) => {
    const matchesSearch =
      estimate.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || estimate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Estimates
        </span>
      </div>

      <PageHeader
        title="Estimates & Quotes"
        description="Create, send, and track sales estimates and quotations."
        icon={<FileSpreadsheet className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Estimate
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {estimateStats.map((stat) => (
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
                placeholder="Search estimates..."
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
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Expired">Expired</option>
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
                    Estimate ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Valid Until
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Amount
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Items
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
              {filteredEstimates.map((estimate) => (
                <tr
                  key={estimate.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {estimate.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">
                      {estimate.customer}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {estimate.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {estimate.validUntil}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">
                      {estimate.amount}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {estimate.items} items
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={estimate.status}
                      variant={estimate.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                      {estimate.status === "Accepted" && (
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary">
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      {estimate.status === "Draft" && (
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEstimates.length} of {estimates.length} estimates
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
