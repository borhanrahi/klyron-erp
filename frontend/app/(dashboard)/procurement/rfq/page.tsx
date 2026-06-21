"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Send,
} from "lucide-react";

const rfqs = [
  {
    id: "RFQ-2024-001",
    supplier: "TechParts Supply Co",
    date: "Mar 24, 2024",
    dueDate: "Mar 31, 2024",
    items: 8,
    totalEstimate: "$24,500",
    status: "Pending",
    statusVariant: "warning" as const,
    quotes: 2,
  },
  {
    id: "RFQ-2024-002",
    supplier: "Global Materials Inc",
    date: "Mar 22, 2024",
    dueDate: "Mar 29, 2024",
    items: 15,
    totalEstimate: "$67,800",
    status: "Quoted",
    statusVariant: "info" as const,
    quotes: 4,
  },
  {
    id: "RFQ-2024-003",
    supplier: "Precision Components Ltd",
    date: "Mar 20, 2024",
    dueDate: "Mar 27, 2024",
    items: 5,
    totalEstimate: "$12,300",
    status: "Approved",
    statusVariant: "success" as const,
    quotes: 3,
  },
  {
    id: "RFQ-2024-004",
    supplier: "Industrial Solutions Corp",
    date: "Mar 18, 2024",
    dueDate: "Mar 25, 2024",
    items: 22,
    totalEstimate: "$89,200",
    status: "Sent",
    statusVariant: "primary" as const,
    quotes: 0,
  },
  {
    id: "RFQ-2024-005",
    supplier: "Digital Electronics Hub",
    date: "Mar 15, 2024",
    dueDate: "Mar 22, 2024",
    items: 12,
    totalEstimate: "$45,600",
    status: "Closed",
    statusVariant: "muted" as const,
    quotes: 5,
  },
];

const rfqStats = [
  { label: "Total RFQs", value: "89", change: "12 pending" },
  { label: "Awaiting Quotes", value: "18", change: "5 urgent" },
  { label: "Approved This Month", value: "24", change: "+8 vs last month" },
  { label: "Total Value", value: "$1.8M", change: "Q1 2024" },
];

export default function RFQListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch =
      rfq.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || rfq.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Procurement</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          RFQ List
        </span>
      </div>

      <PageHeader
        title="RFQ List"
        description="Manage and track outgoing vendor Requests for Quotation."
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create RFQ
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rfqStats.map((stat) => (
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

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
                <option value="Quoted">Quoted</option>
                <option value="Approved">Approved</option>
                <option value="Closed">Closed</option>
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
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    RFQ ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Supplier
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Due Date
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Items
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Total Estimate
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Quotes
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredRFQs.map((rfq) => (
                <tr
                  key={rfq.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {rfq.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium">{rfq.supplier}</p>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {rfq.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {rfq.dueDate}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {rfq.items} items
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold">
                      {rfq.totalEstimate}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={rfq.status}
                      variant={rfq.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {rfq.quotes} received
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
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

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRFQs.length} of {rfqs.length} RFQs
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
