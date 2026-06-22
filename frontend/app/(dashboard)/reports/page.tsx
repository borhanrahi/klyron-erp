"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Download,
  Clock,
  Eye,
  ChevronRight,
  FileText,
  Activity,
  DollarSign,
  Calendar,
  Briefcase,
  CheckCircle,
  Wrench,
  Receipt,
  Building2,
} from "lucide-react";

interface DashboardData {
  sales: { customers: number; leads: number; deals: number; orders: number };
  finance: { invoices: number; revenue: number; expenses: number; profit: number };
  inventory: { items: number; warehouses: number };
  procurement: { suppliers: number; purchase_orders: number };
  projects: { projects: number; tasks: number };
  support: { tickets: number; open_tickets: number };
  hr: { employees: number };
  pos: { sales: number };
}

const moduleCards: {
  id: string;
  title: string;
  description: string;
  icon: typeof DollarSign;
  iconBg: string;
  iconColor: string;
  href: string;
  getCount: (data: DashboardData) => number;
  countLabel: string;
}[] = [
  {
    id: "sales",
    title: "Sales",
    description: "Customers, leads, deals, and orders overview.",
    icon: TrendingUp,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    href: "/sales",
    getCount: (d) => d.sales.customers + d.sales.leads + d.sales.deals + d.sales.orders,
    countLabel: "records",
  },
  {
    id: "finance",
    title: "Finance",
    description: "Invoices, revenue, expenses, and profit tracking.",
    icon: DollarSign,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    href: "/finance",
    getCount: (d) => d.finance.invoices,
    countLabel: "invoices",
  },
  {
    id: "inventory",
    title: "Inventory",
    description: "Stock items and warehouse management.",
    icon: Package,
    iconBg: "bg-info/10",
    iconColor: "text-info",
    href: "/inventory",
    getCount: (d) => d.inventory.items,
    countLabel: "items",
  },
  {
    id: "procurement",
    title: "Procurement",
    description: "Suppliers and purchase order tracking.",
    icon: Briefcase,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    href: "/procurement",
    getCount: (d) => d.procurement.suppliers + d.procurement.purchase_orders,
    countLabel: "records",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Projects and task management.",
    icon: CheckCircle,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    href: "/projects",
    getCount: (d) => d.projects.projects + d.projects.tasks,
    countLabel: "records",
  },
  {
    id: "support",
    title: "Support",
    description: "Ticket tracking and open issue management.",
    icon: Wrench,
    iconBg: "bg-danger/10",
    iconColor: "text-danger",
    href: "/support",
    getCount: (d) => d.support.tickets,
    countLabel: "tickets",
  },
  {
    id: "hr",
    title: "HR",
    description: "Employee records and headcount.",
    icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    href: "/hr",
    getCount: (d) => d.hr.employees,
    countLabel: "employees",
  },
  {
    id: "pos",
    title: "POS",
    description: "Point-of-sale transactions.",
    icon: ShoppingCart,
    iconBg: "bg-danger/10",
    iconColor: "text-danger",
    href: "/pos",
    getCount: (d) => d.pos.sales,
    countLabel: "sales",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function ReportsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: DashboardData }>("/reports/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        <PageHeader
          title="Reports"
          description="Generate, view, and export business reports across all modules."
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
              <div className="h-8 w-20 bg-muted rounded mt-2" />
              <div className="h-3 w-32 bg-muted rounded mt-2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-muted rounded-xl" />
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        <PageHeader
          title="Reports"
          description="Generate, view, and export business reports across all modules."
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        />
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
          <p className="text-danger font-medium">Failed to load dashboard data</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); apiGet<{ data: DashboardData }>("/reports/dashboard").then((res) => setData(res.data)).catch((err) => setError(err.message)).finally(() => setLoading(false)); }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Reports"
        description="Generate, view, and export business reports across all modules."
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All
          </button>
        }
      />

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(data.finance.revenue), change: `${data.finance.invoices} invoices`, icon: DollarSign },
          { label: "Net Profit", value: formatCurrency(data.finance.profit), change: `${formatCurrency(data.finance.expenses)} expenses`, icon: TrendingUp },
          { label: "Total Employees", value: String(data.hr.employees), change: "Active headcount", icon: Users },
          { label: "Open Support Tickets", value: String(data.support.open_tickets), change: `of ${data.support.tickets} total`, icon: Activity },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Module Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Module Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            const count = mod.getCount(data);
            return (
              <a
                key={mod.id}
                href={mod.href}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${mod.iconBg}`}>
                    <Icon className={`h-6 w-6 ${mod.iconColor}`} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
                    {count} {mod.countLabel}
                  </span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {mod.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-primary mt-4 font-medium">
                  View Reports
                  <ChevronRight className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Customers", value: data.sales.customers },
            { label: "Leads", value: data.sales.leads },
            { label: "Deals", value: data.sales.deals },
            { label: "Orders", value: data.sales.orders },
            { label: "Warehouses", value: data.inventory.warehouses },
            { label: "Projects", value: data.projects.projects },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
