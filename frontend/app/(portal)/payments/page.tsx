"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  CreditCard,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";

const payments = [
  {
    id: "PAY-2024-089",
    date: "Mar 24, 2024",
    invoice: "INV-2024-038",
    amount: "$8,750.00",
    method: "Credit Card",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "PAY-2024-082",
    date: "Mar 15, 2024",
    invoice: "INV-2024-031",
    amount: "$12,500.00",
    method: "Bank Transfer",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "PAY-2024-075",
    date: "Mar 5, 2024",
    invoice: "INV-2024-024",
    amount: "$3,200.00",
    method: "Credit Card",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "PAY-2024-068",
    date: "Feb 28, 2024",
    invoice: "INV-2024-017",
    amount: "$18,900.00",
    method: "Wire Transfer",
    status: "Pending",
    statusVariant: "warning" as const,
  },
];

const paymentStats = [
  { label: "Total Paid", value: "$43,350", icon: CheckCircle, color: "text-success" },
  { label: "Pending", value: "$18,900", icon: Clock, color: "text-warning" },
  { label: "This Month", value: "$21,250", icon: DollarSign, color: "text-primary" },
];

export default function PortalPaymentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your payment history and status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {paymentStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-xl">
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
              placeholder="Search payments..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Payment ID
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Invoice
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Method
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Amount
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {payment.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {payment.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {payment.invoice}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {payment.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">{payment.amount}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge
                      status={payment.status}
                      variant={payment.statusVariant}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-4 of 24 payments
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
