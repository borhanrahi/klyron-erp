"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const journalEntries = [
  {
    id: "JE-2024-001",
    date: "Mar 24, 2024",
    reference: "INV-2024-045",
    description: "Revenue from Acme Corp invoice",
    lines: [
      { account: "1200 - Accounts Receivable", debit: "$12,500", credit: "-" },
      { account: "4000 - Sales Revenue", debit: "-", credit: "$12,500" },
    ],
    status: "Posted",
    statusVariant: "success" as const,
    total: "$12,500",
  },
  {
    id: "JE-2024-002",
    date: "Mar 23, 2024",
    reference: "PAY-2024-089",
    description: "Payment to Global Materials Inc",
    lines: [
      { account: "2010 - Accounts Payable", debit: "$8,750", credit: "-" },
      { account: "1010 - Cash and Cash Equivalents", debit: "-", credit: "$8,750" },
    ],
    status: "Posted",
    statusVariant: "success" as const,
    total: "$8,750",
  },
  {
    id: "JE-2024-003",
    date: "Mar 22, 2024",
    reference: "EXP-2024-156",
    description: "Office supplies purchase",
    lines: [
      { account: "5100 - Office Supplies Expense", debit: "$450", credit: "-" },
      { account: "1010 - Cash and Cash Equivalents", debit: "-", credit: "$450" },
    ],
    status: "Draft",
    statusVariant: "warning" as const,
    total: "$450",
  },
  {
    id: "JE-2024-004",
    date: "Mar 21, 2024",
    reference: "SAL-2024-032",
    description: "Monthly payroll processing",
    lines: [
      { account: "5200 - Salaries Expense", debit: "$45,000", credit: "-" },
      { account: "2020 - Salaries Payable", debit: "-", credit: "$45,000" },
    ],
    status: "Posted",
    statusVariant: "success" as const,
    total: "$45,000",
  },
  {
    id: "JE-2024-005",
    date: "Mar 20, 2024",
    reference: "DEP-2024-018",
    description: "Customer deposit received",
    lines: [
      { account: "1010 - Cash and Cash Equivalents", debit: "$5,000", credit: "-" },
      { account: "2300 - Unearned Revenue", debit: "-", credit: "$5,000" },
    ],
    status: "Draft",
    statusVariant: "warning" as const,
    total: "$5,000",
  },
];

const entryStats = [
  { label: "Total Entries", value: "342", change: "+18 this month" },
  { label: "Total Debits", value: "$1.2M", change: "Q1 2024" },
  { label: "Total Credits", value: "$1.2M", change: "Balanced ✓" },
  { label: "Pending Review", value: "5", change: "2 urgent" },
];

export default function JournalEntriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || entry.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Journal Entries
        </span>
      </div>

      <PageHeader
        title="Journal Entries"
        description="Record and manage manual journal entries and adjustments."
        icon={<BookOpen className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Journal Entry
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {entryStats.map((stat) => (
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

      {/* Balance Indicator */}
      <div className="rounded-2xl border border-success/20 bg-success/5 p-4 flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-success" />
        <div>
          <p className="text-sm font-semibold text-success">
            Ledger in Balance
          </p>
          <p className="text-xs text-muted-foreground">
            Total debits equal total credits — your books are balanced.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search entries..."
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
                <option value="Posted">Posted</option>
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
                    Entry ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Description
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Reference
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Total
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
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {entry.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {entry.date}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{entry.description}</p>
                      <div className="mt-1 space-y-0.5">
                        {entry.lines.map((line, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            {line.debit !== "-" ? "Dr" : "Cr"}: {line.account}{" "}
                            {line.debit !== "-" ? line.debit : line.credit}
                          </p>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {entry.reference}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold">{entry.total}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={entry.status}
                      variant={entry.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
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
            Showing {filteredEntries.length} of {journalEntries.length} entries
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
