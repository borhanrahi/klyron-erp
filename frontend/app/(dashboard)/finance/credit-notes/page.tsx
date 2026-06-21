"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

const creditNotes = [
  {
    id: "CN-2024-012",
    customer: "Acme Corp",
    date: "Mar 24, 2024",
    amount: "$1,250.00",
    reason: "Returned damaged goods",
    invoiceRef: "INV-2024-038",
    status: "Applied",
    statusVariant: "success" as const,
  },
  {
    id: "CN-2024-013",
    customer: "TechStart Inc",
    date: "Mar 22, 2024",
    amount: "$875.00",
    reason: "Overcharged on invoice",
    invoiceRef: "INV-2024-041",
    status: "Applied",
    statusVariant: "success" as const,
  },
  {
    id: "CN-2024-014",
    customer: "Global Industries",
    date: "Mar 20, 2024",
    amount: "$3,400.00",
    reason: "Service credit for downtime",
    invoiceRef: "INV-2024-035",
    status: "Pending",
    statusVariant: "warning" as const,
  },
  {
    id: "CN-2024-015",
    customer: "Creative Solutions",
    date: "Mar 18, 2024",
    amount: "$520.00",
    reason: "Duplicate charge correction",
    invoiceRef: "INV-2024-039",
    status: "Draft",
    statusVariant: "muted" as const,
  },
  {
    id: "CN-2024-016",
    customer: "DataFlow Systems",
    date: "Mar 15, 2024",
    amount: "$2,100.00",
    reason: "Cancelled order refund",
    invoiceRef: "INV-2024-033",
    status: "Applied",
    statusVariant: "success" as const,
  },
  {
    id: "CN-2024-017",
    customer: "Quantum Enterprises",
    date: "Mar 12, 2024",
    amount: "$4,800.00",
    reason: "Contract termination credit",
    invoiceRef: "INV-2024-029",
    status: "Void",
    statusVariant: "danger" as const,
  },
];

const cnStats = [
  { label: "Total Credit Notes", value: "24", change: "Q1 2024" },
  { label: "Total Value", value: "$18,450", change: "3.2% of revenue" },
  { label: "Pending", value: "3", change: "$4,720 value" },
  { label: "Applied", value: "18", change: "This quarter" },
];

export default function CreditNotesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredNotes = creditNotes.filter((note) => {
    const matchesSearch =
      note.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || note.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Credit Notes
        </span>
      </div>

      <PageHeader
        title="Credit Notes"
        description="Issue and manage credit notes for returns, adjustments, and refunds."
        icon={<CreditCard className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Credit Note
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cnStats.map((stat) => (
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
                placeholder="Search credit notes..."
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
                <option value="Pending">Pending</option>
                <option value="Applied">Applied</option>
                <option value="Void">Void</option>
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
                    Credit Note ID
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
                  Invoice Ref
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Reason
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Amount
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
              {filteredNotes.map((note) => (
                <tr
                  key={note.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {note.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{note.customer}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {note.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-primary">{note.invoiceRef}</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {note.reason}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold text-danger">
                      {note.amount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={note.status}
                      variant={note.statusVariant}
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

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredNotes.length} of {creditNotes.length} credit notes
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
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
