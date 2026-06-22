"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { KPICard } from "@/components/common/KPICard";
import {
  TrendingUp,
  Users,
  Target,
  Award,
  AlertTriangle,
  Star,
} from "lucide-react";
import Link from "next/link";

const kpis = [
  { label: "Avg. Performance Score", value: "3.8", change: "+0.2 vs last Q", changeType: "up" as const, icon: <Star className="h-5 w-5" />, color: "primary" as const },
  { label: "Reviews Completed", value: "89%", change: "132/148", changeType: "up" as const, icon: <Users className="h-5 w-5" />, color: "success" as const },
  { label: "Top Performers", value: "24", change: "16.2% of workforce", changeType: "up" as const, icon: <Award className="h-5 w-5" />, color: "accent" as const },
  { label: "Underperformers", value: "6", change: "4.1% of workforce", changeType: "down" as const, icon: <AlertTriangle className="h-5 w-5" />, color: "danger" as const },
];

const performanceDistribution = [
  { rating: "Exceptional (5)", count: 12, percentage: 8, color: "bg-success" },
  { rating: "Exceeds Expectations (4)", count: 36, percentage: 24, color: "bg-primary" },
  { rating: "Meets Expectations (3)", count: 72, percentage: 49, color: "bg-info" },
  { rating: "Needs Improvement (2)", count: 18, percentage: 12, color: "bg-warning" },
  { rating: "Unsatisfactory (1)", count: 6, percentage: 4, color: "bg-danger" },
];

const quickLinks = [
  { label: "KPI Management", href: "/hr/performance/kpis", icon: <Target className="h-5 w-5" /> },
  { label: "Performance Reviews", href: "/hr/performance/reviews", icon: <TrendingUp className="h-5 w-5" /> },
  { label: "Appraisals", href: "/hr/performance/appraisals", icon: <Award className="h-5 w-5" /> },
];

export default function PerformancePage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Performance Management"
        description="Track employee performance, KPIs, and reviews."
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Performance Distribution</h3>
          <div className="space-y-3">
            {performanceDistribution.map((item) => (
              <div key={item.rating}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{item.rating}</span>
                  <span className="text-sm font-medium">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-xl text-primary">{link.icon}</div>
                <div>
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p className="text-xs text-muted-foreground">Manage {link.label.toLowerCase()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Recent Performance Updates</h3>
        </div>
        <div className="divide-y divide-border/50">
          {[
            { employee: "Sarah Chen", avatar: "SC", action: "Score updated to 4.5/5", date: "Jun 18, 2024", type: "review" },
            { employee: "Mike Johnson", avatar: "MJ", action: "KPI target achieved: 112%", date: "Jun 17, 2024", type: "kpi" },
            { employee: "Emily Davis", avatar: "ED", action: "Appraisal scheduled for Jul 1", date: "Jun 16, 2024", type: "appraisal" },
            { employee: "David Park", avatar: "DP", action: "360 review completed", date: "Jun 15, 2024", type: "review" },
            { employee: "Alex Kim", avatar: "AK", action: "Performance improvement plan initiated", date: "Jun 14, 2024", type: "pip" },
          ].map((item, i) => (
            <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{item.avatar}</div>
                <div>
                  <p className="text-sm font-medium">{item.employee}</p>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
