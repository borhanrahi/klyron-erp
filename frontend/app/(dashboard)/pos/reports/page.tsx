"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  CreditCard,
  Wallet,
  Smartphone,
  Loader2,
} from "lucide-react";

interface Summary {
  total_sessions: number;
  total_sales: number;
  total_revenue: number;
  avg_sale: number;
}

interface PaymentMethod {
  method: string;
  count: number;
  total: number;
}

interface RecentSession {
  id: number;
  status: string;
  opening_balance: number;
  closing_balance: number | null;
  opened_at: string;
  closed_at: string | null;
}

interface RecentSale {
  id: number;
  total_amount: number;
  payment_method: string;
  created_at: string;
}

interface POSReportData {
  data: {
    summary: Summary;
    payment_methods: PaymentMethod[];
    recent_sessions: RecentSession[];
    recent_sales: RecentSale[];
  };
}

const paymentMethodIcons: Record<string, typeof DollarSign> = {
  cash: Wallet,
  card: CreditCard,
  mobile: Smartphone,
};

const paymentMethodLabels: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  mobile: "Mobile",
};

export default function POSReportsPage() {
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState<POSReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiGet<POSReportData>("/reports/pos-summary")
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err.message || "Failed to load report data");
      })
      .finally(() => setLoading(false));
  }, [dateRange]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        <PageHeader
          title="POS Reports"
          description="Analytics and insights for your point of sale."
          breadcrumbs={[
            { label: "POS", href: "/pos" },
            { label: "Reports" },
          ]}
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        <PageHeader
          title="POS Reports"
          description="Analytics and insights for your point of sale."
          breadcrumbs={[
            { label: "POS", href: "/pos" },
            { label: "Reports" },
          ]}
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        />
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-destructive mb-2 font-medium">Failed to load report data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, payment_methods, recent_sessions, recent_sales } = data.data;

  const maxPaymentTotal = Math.max(...payment_methods.map((pm) => pm.total), 1);

  const kpiCards = [
    {
      label: "Total Revenue",
      value: `$${summary.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      label: "Total Sales",
      value: summary.total_sales.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      label: "Avg Sale",
      value: `$${summary.avg_sale.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: Package,
    },
    {
      label: "Total Sessions",
      value: summary.total_sessions.toLocaleString(),
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="POS Reports"
        description="Analytics and insights for your point of sale."
        breadcrumbs={[
          { label: "POS", href: "/pos" },
          { label: "Reports" },
        ]}
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {["today", "week", "month"].map((period) => (
                <button
                  key={period}
                  onClick={() => setDateRange(period)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                    dateRange === period
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <div className="p-2 bg-primary/10 rounded-lg">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Payment Methods</h3>
        <div className="space-y-4">
          {payment_methods.map((pm) => {
            const Icon = paymentMethodIcons[pm.method] || DollarSign;
            const label = paymentMethodLabels[pm.method] || pm.method;
            const percentage = maxPaymentTotal > 0 ? (pm.total / maxPaymentTotal) * 100 : 0;
            return (
              <div key={pm.method}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                    <span className="text-xs text-muted-foreground">({pm.count} txns)</span>
                  </span>
                  <span className="text-sm font-semibold">
                    ${pm.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Sessions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-3 text-xs font-medium text-muted-foreground">Opening</th>
                  <th className="text-right p-3 text-xs font-medium text-muted-foreground">Closing</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Opened</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recent_sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-muted/5 transition-colors">
                    <td className="p-3 font-medium">#{session.id}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          session.status === "closed"
                            ? "bg-muted text-muted-foreground"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      ${session.opening_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right">
                      {session.closing_balance != null
                        ? `$${session.closing_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "—"}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(session.opened_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recent_sessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      No recent sessions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Recent Sales
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Method</th>
                  <th className="text-right p-3 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recent_sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-muted/5 transition-colors">
                    <td className="p-3 font-medium">#{sale.id}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-xs capitalize">
                        {(() => {
                          const Icon = paymentMethodIcons[sale.payment_method] || DollarSign;
                          return <Icon className="h-3 w-3" />;
                        })()}
                        {paymentMethodLabels[sale.payment_method] || sale.payment_method}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      ${sale.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recent_sales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      No recent sales
                    </td>
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
