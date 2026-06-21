"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  Calendar,
  Package,
  Award,
  Clock,
} from "lucide-react";

const dailySalesData = [
  { day: "Mon", sales: 1245, transactions: 28 },
  { day: "Tue", sales: 987, transactions: 22 },
  { day: "Wed", sales: 1456, transactions: 32 },
  { day: "Thu", sales: 1123, transactions: 25 },
  { day: "Fri", sales: 1678, transactions: 38 },
  { day: "Sat", sales: 2134, transactions: 48 },
  { day: "Sun", sales: 1890, transactions: 42 },
];

const topProducts = [
  { rank: 1, name: "Mechanical Keyboard", sold: 42, revenue: 3779.58, trend: "up" },
  { rank: 2, name: "Webcam HD 1080p", sold: 38, revenue: 2659.62, trend: "up" },
  { rank: 3, name: "USB-C Hub", sold: 35, revenue: 1749.65, trend: "down" },
  { rank: 4, name: "Wireless Mouse", sold: 31, revenue: 929.69, trend: "up" },
  { rank: 5, name: "Laptop Sleeve 15\"", sold: 28, revenue: 699.72, trend: "up" },
];

const cashierPerformance = [
  { name: "Sarah Chen", transactions: 156, revenue: 8234.50, avgTime: "3:24", rating: 4.9 },
  { name: "Mike Johnson", transactions: 132, revenue: 6892.30, avgTime: "3:45", rating: 4.7 },
  { name: "Emily Davis", transactions: 98, revenue: 5123.80, avgTime: "4:12", rating: 4.6 },
];

const hourlySales = [
  { hour: "9AM", sales: 320 },
  { hour: "10AM", sales: 480 },
  { hour: "11AM", sales: 650 },
  { hour: "12PM", sales: 890 },
  { hour: "1PM", sales: 720 },
  { hour: "2PM", sales: 540 },
  { hour: "3PM", sales: 410 },
  { hour: "4PM", sales: 380 },
  { hour: "5PM", sales: 290 },
];

const categoryBreakdown = [
  { category: "Electronics", revenue: 9245.00, percentage: 52 },
  { category: "Furniture", revenue: 4523.00, percentage: 25 },
  { category: "Stationery", revenue: 2812.00, percentage: 16 },
  { category: "Accessories", revenue: 1245.00, percentage: 7 },
];

const kpiCards = [
  { label: "Today's Revenue", value: "$4,823.00", change: "+15.3%", icon: DollarSign, trend: "up" as const },
  { label: "Transactions", value: "92", change: "+8.2%", icon: ShoppingCart, trend: "up" as const },
  { label: "Active Cashiers", value: "3", change: "All online", icon: Users, trend: "up" as const },
  { label: "Avg. Basket Size", value: "$52.42", change: "+3.7%", icon: Package, trend: "up" as const },
];

export default function POSReportsPage() {
  const [dateRange, setDateRange] = useState("today");

  const maxSales = Math.max(...dailySalesData.map((d) => d.sales));
  const maxHourly = Math.max(...hourlySales.map((h) => h.sales));

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
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
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
            <div className="flex items-center gap-1 mt-1">
              {kpi.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-danger" />
              )}
              <span className="text-xs text-success">{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Daily Sales</h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> This Week
            </span>
          </div>
          <div className="space-y-3">
            {dailySalesData.map((item) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-8">
                  {item.day}
                </span>
                <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-lg flex items-center px-3"
                    style={{ width: `${(item.sales / maxSales) * 100}%` }}
                  >
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      ${item.sales.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">
                  {item.transactions} txns
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Sales Pattern */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Hourly Pattern</h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Today
            </span>
          </div>
          <div className="flex items-end gap-2 h-48">
            {hourlySales.map((item) => (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[10px] text-muted-foreground">
                  ${item.sales}
                </span>
                <div
                  className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                  style={{
                    height: `${(item.sales / maxHourly) * 100}%`,
                    minHeight: "8px",
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {item.hour}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-warning" />
              Top Products
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {topProducts.map((product) => (
              <div
                key={product.rank}
                className="p-4 flex items-center gap-3 hover:bg-muted/5 transition-colors"
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    product.rank <= 3
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {product.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sold} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-0.5 justify-end">
                    {product.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-danger" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Revenue by Category</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{cat.category}</span>
                  <span className="font-semibold">
                    ${cat.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {cat.percentage}% of total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cashier Performance */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Cashier Performance
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {cashierPerformance.map((cashier) => (
              <div key={cashier.name} className="p-4 hover:bg-muted/5 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {cashier.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cashier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cashier.transactions} transactions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${cashier.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                    <p className="text-sm font-semibold">{cashier.avgTime}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-sm font-semibold text-warning">
                      ★ {cashier.rating}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
