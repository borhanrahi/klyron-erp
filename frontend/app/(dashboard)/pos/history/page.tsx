"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";

const transactions = [
  {
    id: "SALE-1001",
    date: "Jun 21, 2024 03:45 PM",
    cashier: "Sarah Chen",
    items: 5,
    subtotal: 149.95,
    tax: 15.0,
    total: 164.95,
    paymentMethod: "Cash",
    paymentIcon: Banknote,
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "SALE-1002",
    date: "Jun 21, 2024 02:30 PM",
    cashier: "Mike Johnson",
    items: 2,
    subtotal: 89.98,
    tax: 9.0,
    total: 98.98,
    paymentMethod: "Card",
    paymentIcon: CreditCard,
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "SALE-1003",
    date: "Jun 21, 2024 01:15 PM",
    cashier: "Sarah Chen",
    items: 8,
    subtotal: 234.92,
    tax: 23.49,
    total: 258.41,
    paymentMethod: "Digital",
    paymentIcon: Smartphone,
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "SALE-1004",
    date: "Jun 21, 2024 12:00 PM",
    cashier: "Emily Davis",
    items: 1,
    subtotal: 59.99,
    tax: 6.0,
    total: 65.99,
    paymentMethod: "Card",
    paymentIcon: CreditCard,
    status: "Refunded",
    statusVariant: "danger" as const,
  },
  {
    id: "SALE-1005",
    date: "Jun 21, 2024 10:45 AM",
    cashier: "Mike Johnson",
    items: 3,
    subtotal: 67.47,
    tax: 6.75,
    total: 74.22,
    paymentMethod: "Cash",
    paymentIcon: Banknote,
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "SALE-1006",
    date: "Jun 20, 2024 05:30 PM",
    cashier: "Sarah Chen",
    items: 4,
    subtotal: 199.96,
    tax: 20.0,
    total: 219.96,
    paymentMethod: "Card",
    paymentIcon: CreditCard,
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "SALE-1007",
    date: "Jun 20, 2024 03:15 PM",
    cashier: "Emily Davis",
    items: 6,
    subtotal: 312.44,
    tax: 31.24,
    total: 343.68,
    paymentMethod: "Digital",
    paymentIcon: Smartphone,
    status: "Void",
    statusVariant: "warning" as const,
  },
  {
    id: "SALE-1008",
    date: "Jun 20, 2024 01:00 PM",
    cashier: "Mike Johnson",
    items: 2,
    subtotal: 42.48,
    tax: 4.25,
    total: 46.73,
    paymentMethod: "Cash",
    paymentIcon: Banknote,
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "SALE-1009",
    date: "Jun 20, 2024 11:20 AM",
    cashier: "Sarah Chen",
    items: 7,
    subtotal: 178.43,
    tax: 17.84,
    total: 196.27,
    paymentMethod: "Card",
    paymentIcon: CreditCard,
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "SALE-1010",
    date: "Jun 20, 2024 09:45 AM",
    cashier: "Emily Davis",
    items: 1,
    subtotal: 34.99,
    tax: 3.5,
    total: 38.49,
    paymentMethod: "Digital",
    paymentIcon: Smartphone,
    status: "Completed",
    statusVariant: "success" as const,
  },
];

const todayStats = [
  { label: "Total Sales", value: "$1,247.85", change: "+12% vs yesterday" },
  { label: "Transactions", value: "28", change: "+5 vs yesterday" },
  { label: "Avg. Transaction", value: "$44.57", change: "+3.2%" },
  { label: "Refunds", value: "$65.99", change: "1 refund" },
];

export default function POSHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("today");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || tx.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Transaction History"
        description="View and manage POS transaction records."
        breadcrumbs={[
          { label: "POS", href: "/pos" },
          { label: "History" },
        ]}
        icon={<History className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {todayStats.map((stat) => (
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

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by sale # or cashier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                {["today", "week", "month"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedDate(period)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                      selectedDate === period
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Completed">Completed</option>
                <option value="Refunded">Refunded</option>
                <option value="Void">Void</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Sale #
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Date & Time
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Cashier
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Items
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Total
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden sm:table-cell">
                  Payment
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
              {filteredTransactions.map((tx) => {
                const PaymentIcon = tx.paymentIcon;
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-primary">
                        {tx.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {tx.date}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm">{tx.cashier}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {tx.items} items
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold">
                        ${tx.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {tx.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={tx.status}
                        variant={tx.statusVariant}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`/pos/history/${tx.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground inline-flex"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
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
