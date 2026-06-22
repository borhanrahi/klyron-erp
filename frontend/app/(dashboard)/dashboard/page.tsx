"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { KPICard } from "@/components/common/KPICard";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  AlertCircle,
  Receipt,
  Package,
} from "lucide-react";

interface DashboardData {
  revenue: {
    total: number;
    pending: number;
    expenses: number;
    profit: number;
  };
  customers: {
    total: number;
    new_this_month: number;
  };
  orders: {
    total: number;
    pending: number;
  };
  leads: {
    total: number;
    active: number;
  };
  deals: {
    total: number;
    won: number;
  };
  pos_today: number;
  tickets: {
    open: number;
  };
  employees: number;
  recent_invoices: {
    id: number;
    invoice_number: string;
    total: number;
    status: string;
    created_at: string;
  }[];
  recent_orders: {
    id: number;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
  }[];
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    overdue: "bg-danger/10 text-danger",
    confirmed: "bg-success/10 text-success",
    draft: "bg-muted text-muted-foreground",
    cancelled: "bg-danger/10 text-danger",
  };
  return map[status] || "bg-muted text-muted-foreground";
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-muted/50 ${className ?? ""}`} />
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<{ data: DashboardData }>("/dashboard/executive");
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="space-y-8 animate-in fade-in-0 duration-200">
        <PageHeader
          title="Executive Dashboard"
          description="Welcome back, here's what's happening today."
          icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
        />
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in-0 duration-200">
        <PageHeader
          title="Executive Dashboard"
          description="Welcome back, here's what's happening today."
          icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
        />
        {/* KPI skeleton */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <SkeletonBlock className="h-11 w-11 rounded-xl" />
                <SkeletonBlock className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
        {/* Revenue + tables skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <SkeletonBlock className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <SkeletonBlock className="h-6 w-36" />
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
        {/* Table skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <SkeletonBlock className="h-6 w-36" />
              {[1, 2, 3].map((j) => (
                <SkeletonBlock key={j} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Executive Dashboard"
        description="Welcome back, here's what's happening today."
        icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Export Report
          </button>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(data!.revenue.total)}
          icon={<DollarSign className="h-5 w-5" />}
          color="primary"
        />
        <KPICard
          label="Active Customers"
          value={formatNumber(data!.customers.total)}
          change={`${data!.customers.new_this_month} new this month`}
          changeType="up"
          icon={<Users className="h-5 w-5" />}
          color="success"
        />
        <KPICard
          label="Pending Orders"
          value={formatNumber(data!.orders.pending)}
          change={`${data!.orders.total} total`}
          changeType="neutral"
          icon={<ShoppingCart className="h-5 w-5" />}
          color="warning"
        />
        <KPICard
          label="Open Tickets"
          value={formatNumber(data!.tickets.open)}
          icon={<AlertCircle className="h-5 w-5" />}
          color="danger"
        />
      </div>

      {/* Revenue Overview + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(data!.revenue.total)}</p>
            </div>
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/10">
              <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-danger">{formatCurrency(data!.revenue.expenses)}</p>
            </div>
            <div className={`p-4 rounded-xl border ${data!.revenue.profit >= 0 ? "bg-success/5 border-success/10" : "bg-danger/5 border-danger/10"}`}>
              <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
              <p className={`text-xl font-bold ${data!.revenue.profit >= 0 ? "text-success" : "text-danger"}`}>
                {formatCurrency(data!.revenue.profit)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/10">
              <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
              <p className="text-xl font-bold text-warning">{formatCurrency(data!.revenue.pending)}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm text-muted-foreground">POS Today</span>
              <span className="text-sm font-semibold">{formatCurrency(data!.pos_today)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm text-muted-foreground">Active Leads</span>
              <span className="text-sm font-semibold">{formatNumber(data!.leads.active)} / {formatNumber(data!.leads.total)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm text-muted-foreground">Deals Won</span>
              <span className="text-sm font-semibold">{formatNumber(data!.deals.won)} / {formatNumber(data!.deals.total)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm text-muted-foreground">Employees</span>
              <span className="text-sm font-semibold">{formatNumber(data!.employees)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 p-6 pb-0">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Recent Invoices</h3>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">Invoice</th>
                  <th className="text-right font-medium text-muted-foreground px-6 py-3">Amount</th>
                  <th className="text-center font-medium text-muted-foreground px-6 py-3">Status</th>
                  <th className="text-right font-medium text-muted-foreground px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data!.recent_invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 font-medium">{inv.invoice_number}</td>
                    <td className="px-6 py-3 text-right font-mono">{formatCurrency(inv.total)}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-muted-foreground">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data!.recent_invoices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No recent invoices</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 p-6 pb-0">
            <Package className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">Order</th>
                  <th className="text-right font-medium text-muted-foreground px-6 py-3">Total</th>
                  <th className="text-center font-medium text-muted-foreground px-6 py-3">Status</th>
                  <th className="text-right font-medium text-muted-foreground px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data!.recent_orders.map((ord) => (
                  <tr key={ord.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 font-medium">{ord.order_number}</td>
                    <td className="px-6 py-3 text-right font-mono">{formatCurrency(ord.total)}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-muted-foreground">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data!.recent_orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
