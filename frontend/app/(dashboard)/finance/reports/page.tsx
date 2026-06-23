"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import { BarChart3, TrendingUp, PieChart, Activity, DollarSign, Loader2 } from "lucide-react";

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiGet<{ items: any[] }>("/finance/invoices").catch(() => ({ items: [] })),
      apiGet<{ items: any[] }>("/finance/transactions").catch(() => ({ items: [] })),
      apiGet<{ items: any[] }>("/finance/expenses").catch(() => ({ items: [] })),
      apiGet<{ items: any[] }>("/finance/bank-accounts").catch(() => ({ items: [] })),
      apiGet<{ items: any[] }>("/finance/estimates").catch(() => ({ items: [] })),
      apiGet<{ items: any[] }>("/finance/credit-notes").catch(() => ({ items: [] })),
    ]).then(([inv, txn, exp, bank, est, cn]) => {
      setInvoices(inv.items || []);
      setTransactions(txn.items || []);
      setExpenses(exp.items || []);
      setBankAccounts(bank.items || []);
      setEstimates(est.items || []);
      setCreditNotes(cn.items || []);
    }).finally(() => setLoading(false));
  }, []);

  const totalInvoiced = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalPaid = invoices.reduce((s, i) => s + (i.paid_amount || 0), 0);
  const totalOutstanding = invoices.reduce((s, i) => s + (i.balance_due || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalRevenue = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpend = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const cashBalance = bankAccounts.reduce((s, b) => s + (b.balance || 0), 0);
  const netIncome = totalRevenue - totalExpenses;
  const pendingEstimates = estimates.filter((e) => e.status === "draft" || e.status === "pending").length;
  const totalCreditNoteValue = creditNotes.reduce((s, c) => s + (c.amount || 0), 0);

  const quickStats = [
    { label: "Total Revenue", value: fmt(totalRevenue), change: `${transactions.filter((t) => t.amount > 0).length} transactions`, icon: TrendingUp },
    { label: "Total Expenses", value: fmt(totalExpenses), change: `${expenses.length} recorded`, icon: DollarSign },
    { label: "Net Income", value: fmt(netIncome), change: netIncome >= 0 ? "Profitable" : "Loss", icon: netIncome >= 0 ? TrendingUp : DollarSign },
    { label: "Cash Position", value: fmt(cashBalance), change: `${bankAccounts.length} accounts`, icon: DollarSign },
  ];

  const reports = [
    {
      id: "pnl", title: "Profit & Loss Statement", description: "Revenue, expenses, and net income for the current period.",
      icon: TrendingUp, iconBg: "bg-success/10", iconColor: "text-success",
      metrics: [
        { label: "Revenue", value: fmt(totalRevenue), positive: true },
        { label: "Expenses", value: fmt(totalExpenses), positive: false },
        { label: "Net Income", value: fmt(netIncome), positive: netIncome >= 0 },
      ],
    },
    {
      id: "invoices", title: "Invoice Summary", description: "Outstanding invoices and collection status.",
      icon: PieChart, iconBg: "bg-primary/10", iconColor: "text-primary",
      metrics: [
        { label: "Total Invoiced", value: fmt(totalInvoiced), positive: true },
        { label: "Collected", value: fmt(totalPaid), positive: true },
        { label: "Outstanding", value: fmt(totalOutstanding), positive: totalOutstanding === 0 },
      ],
    },
    {
      id: "cash-flow", title: "Cash Flow", description: "Cash inflows and outflows across all bank accounts.",
      icon: DollarSign, iconBg: "bg-warning/10", iconColor: "text-warning",
      metrics: [
        { label: "Cash Balance", value: fmt(cashBalance), positive: true },
        { label: "Cash In", value: fmt(totalRevenue), positive: true },
        { label: "Cash Out", value: fmt(totalSpend), positive: false },
      ],
    },
    {
      id: "estimates", title: "Estimates & Credit Notes", description: "Pending estimates and credit note exposure.",
      icon: Activity, iconBg: "bg-info/10", iconColor: "text-info",
      metrics: [
        { label: "Pending Estimates", value: `${pendingEstimates}`, positive: true },
        { label: "Total Estimates", value: `${estimates.length}`, positive: true },
        { label: "Credit Notes", value: fmt(totalCreditNoteValue), positive: totalCreditNoteValue === 0 },
      ],
    },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Reports</span>
      </div>

      <PageHeader title="Financial Reports" description="Overview of financial performance computed from live data." icon={<BarChart3 className="h-6 w-6 text-primary" />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{stat.label}</p><Icon className="h-4 w-4 text-muted-foreground" /></div>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-success mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-5">
                <div className={`p-3 rounded-xl ${report.iconBg}`}><Icon className={`h-6 w-6 ${report.iconColor}`} /></div>
                <div className="flex-1"><h3 className="text-lg font-semibold">{report.title}</h3><p className="text-sm text-muted-foreground mt-1">{report.description}</p></div>
              </div>
              <div className="space-y-3">
                {report.metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                    <span className={`text-sm font-semibold ${m.positive ? "text-success" : "text-danger"}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
