"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
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

interface POSSession {
  id: string;
  opened_at: string;
  closed_at: string;
  opening_balance: number;
  closing_balance: number;
  status: string;
  cashier_id: string;
}

interface Transaction {
  id: string;
  date: string;
  cashier: string;
  items: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentIcon: typeof Banknote;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
}

const paymentIcons: Record<string, typeof Banknote> = {
  Cash: Banknote,
  Card: CreditCard,
  Digital: Smartphone,
};

function mapSessionToTransaction(session: POSSession): Transaction {
  const isOpen = session.status === "open" || session.status === "active";
  const isClosed = session.status === "closed";
  return {
    id: session.id,
    date: session.opened_at
      ? new Date(session.opened_at).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A",
    cashier: session.cashier_id || "Unknown",
    items: 0,
    subtotal: session.opening_balance || 0,
    tax: 0,
    total: session.closing_balance || session.opening_balance || 0,
    paymentMethod: "Cash",
    paymentIcon: Banknote,
    status: isOpen ? "Active" : isClosed ? "Completed" : session.status,
    statusVariant: isOpen ? "info" : isClosed ? "success" : "muted",
  };
}

export default function POSHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("today");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ items: POSSession[] }>("/pos/sessions")
      .then((res) => setTransactions(res.items.map(mapSessionToTransaction)))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  const todayStats = [
    { label: "Total Sales", value: `$${transactions.reduce((a, t) => a + t.total, 0).toFixed(2)}`, change: "+12% vs yesterday" },
    { label: "Transactions", value: String(transactions.length), change: "+5 vs yesterday" },
    { label: "Avg. Transaction", value: `$${transactions.length > 0 ? (transactions.reduce((a, t) => a + t.total, 0) / transactions.length).toFixed(2) : "0.00"}`, change: "+3.2%" },
    { label: "Refunds", value: `$${transactions.filter((t) => t.status === "Refunded").reduce((a, t) => a + t.total, 0).toFixed(2)}`, change: `${transactions.filter((t) => t.status === "Refunded").length} refund(s)` },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || tx.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <option value="Active">Active</option>
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
