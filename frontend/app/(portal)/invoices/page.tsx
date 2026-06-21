"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Download,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";

const invoices = [
  {
    id: "INV-2024-045",
    date: "Mar 24, 2024",
    dueDate: "Apr 23, 2024",
    amount: "$12,500.00",
    status: "Pending",
    statusVariant: "warning" as const,
  },
  {
    id: "INV-2024-038",
    date: "Mar 15, 2024",
    dueDate: "Apr 14, 2024",
    amount: "$8,750.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "INV-2024-031",
    date: "Mar 5, 2024",
    dueDate: "Apr 4, 2024",
    amount: "$24,300.00",
    status: "Overdue",
    statusVariant: "danger" as const,
  },
  {
    id: "INV-2024-024",
    date: "Feb 28, 2024",
    dueDate: "Mar 29, 2024",
    amount: "$3,200.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "INV-2024-017",
    date: "Feb 15, 2024",
    dueDate: "Mar 16, 2024",
    amount: "$18,900.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
];

const invoiceStats = [
  { label: "Total Outstanding", value: "$12,500", icon: DollarSign, color: "text-warning" },
  { label: "Overdue", value: "$24,300", icon: Clock, color: "text-danger" },
  { label: "Paid This Month", value: "$27,650", icon: CheckCircle, color: "text-success" },
];

export default function PortalInvoicesPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your invoices
          </p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {invoiceStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-muted rounded-xl`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Invoice ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Due Date
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Amount
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {invoice.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {invoice.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {invoice.dueDate}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">{invoice.amount}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge
                      status={invoice.status}
                      variant={invoice.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
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
            Showing 1-5 of 42 invoices
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
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              3
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
