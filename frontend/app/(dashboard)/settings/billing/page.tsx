"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  CreditCard,
  Download,
  Receipt,
  Check,
  ArrowRight,
  Calendar,
  DollarSign,
  Users,
  HardDrive,
} from "lucide-react";

const planData = {
  name: "Business Pro",
  price: "$79",
  period: "month",
  status: "Active",
  statusVariant: "success" as const,
  nextBilling: "Jul 15, 2024",
  paymentMethod: "Visa ending in 4242",
};

const usage = [
  { label: "Users", used: 42, limit: 50, icon: Users },
  { label: "Storage", used: 12.5, limit: 50, unit: "GB", icon: HardDrive },
  { label: "API Calls", used: 45000, limit: 100000, icon: Receipt },
];

const invoices = [
  { id: "INV-2024-006", date: "Jun 15, 2024", amount: "$79.00", status: "Paid", statusVariant: "success" as const },
  { id: "INV-2024-005", date: "May 15, 2024", amount: "$79.00", status: "Paid", statusVariant: "success" as const },
  { id: "INV-2024-004", date: "Apr 15, 2024", amount: "$79.00", status: "Paid", statusVariant: "success" as const },
  { id: "INV-2024-003", date: "Mar 15, 2024", amount: "$79.00", status: "Paid", statusVariant: "success" as const },
  { id: "INV-2024-002", date: "Feb 15, 2024", amount: "$79.00", status: "Paid", statusVariant: "success" as const },
  { id: "INV-2024-001", date: "Jan 15, 2024", amount: "$79.00", status: "Paid", statusVariant: "success" as const },
];

const plans = [
  { name: "Starter", price: "$29", period: "month", features: ["5 Users", "10GB Storage", "Basic Reports", "Email Support"] },
  { name: "Business Pro", price: "$79", period: "month", features: ["50 Users", "50GB Storage", "Advanced Reports", "Priority Support", "API Access"], current: true },
  { name: "Enterprise", price: "$199", period: "month", features: ["Unlimited Users", "200GB Storage", "Custom Reports", "24/7 Support", "API Access", "Custom Integrations"] },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Billing & Subscription"
        description="Manage your subscription plan, payment method, and invoices."
        icon={<CreditCard className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Billing" },
        ]}
      />

      {/* Current Plan */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{planData.name}</h3>
              <StatusBadge status={planData.status} variant={planData.statusVariant} />
            </div>
            <p className="text-3xl font-bold mb-1">
              {planData.price}<span className="text-sm font-normal text-muted-foreground">/{planData.period}</span>
            </p>
            <p className="text-sm text-muted-foreground">Next billing: {planData.nextBilling}</p>
          </div>
          <div className="flex gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              Change Plan
            </button>
            <button className="border border-danger/30 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {usage.map((item) => {
          const percentage = typeof item.limit === "number" ? Math.round((item.used / item.limit) * 100) : 0;
          return (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {typeof item.used === "number" && item.used > 1000
                  ? `${(item.used / 1000).toFixed(0)}K`
                  : item.used}
                <span className="text-sm font-normal text-muted-foreground">
                  {item.unit ? ` ${item.unit}` : ""} / {typeof item.limit === "number" && item.limit > 1000 ? `${(item.limit / 1000).toFixed(0)}K` : item.limit}{item.unit ? ` ${item.unit}` : ""}
                </span>
              </p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${percentage > 80 ? "bg-danger" : percentage > 60 ? "bg-warning" : "bg-primary"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 rounded bg-primary/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{planData.paymentMethod}</p>
              <p className="text-xs text-muted-foreground">Expires 12/2026</p>
            </div>
          </div>
          <button className="border border-border bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted/80">
            Update
          </button>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border p-6 shadow-sm ${plan.current ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              {plan.current && (
                <StatusBadge status="Current Plan" variant="primary" />
              )}
              <h4 className="text-lg font-bold mt-2">{plan.name}</h4>
              <p className="text-2xl font-bold mt-1">
                {plan.price}<span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
              </p>
              <ul className="space-y-2 mt-4 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <button className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-2">
                  Switch Plan
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Invoice History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-6">Invoice</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-6 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-6">Amount</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-6">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-6 text-sm font-medium">{invoice.id}</td>
                  <td className="py-3 px-6 hidden md:table-cell text-sm text-muted-foreground">{invoice.date}</td>
                  <td className="py-3 px-6 text-sm font-medium">{invoice.amount}</td>
                  <td className="py-3 px-6">
                    <StatusBadge status={invoice.status} variant={invoice.statusVariant} />
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
