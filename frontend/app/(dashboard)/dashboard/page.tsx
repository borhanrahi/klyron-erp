"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { KPICard } from "@/components/common/KPICard";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function DashboardPage() {
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
          value="$84,254"
          change="+12.5% from last month"
          changeType="up"
          icon={<DollarSign className="h-5 w-5" />}
          color="primary"
        />
        <KPICard
          label="Active Customers"
          value="2,847"
          change="+8.2% from last month"
          changeType="up"
          icon={<Users className="h-5 w-5" />}
          color="success"
        />
        <KPICard
          label="Pending Orders"
          value="142"
          change="-3.1% from last week"
          changeType="down"
          icon={<ShoppingCart className="h-5 w-5" />}
          color="warning"
        />
        <KPICard
          label="Growth Rate"
          value="23.5%"
          change="+2.4% this quarter"
          changeType="up"
          icon={<TrendingUp className="h-5 w-5" />}
          color="accent"
        />
      </div>

      {/* Placeholder for charts and activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
            Chart placeholder
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">New lead added</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
