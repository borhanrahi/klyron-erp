"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Target,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const kpis = [
  { id: 1, name: "Code Quality Score", department: "Engineering", target: "90%", current: "94%", progress: 104, owner: "Sarah Chen", frequency: "Monthly", status: "On Track", statusVariant: "success" as const },
  { id: 2, name: "Customer Satisfaction", department: "Support", target: "4.5/5", current: "4.3/5", progress: 96, owner: "Rachel Martinez", frequency: "Quarterly", status: "At Risk", statusVariant: "warning" as const },
  { id: 3, name: "Revenue per Rep", department: "Sales", target: "$50,000", current: "$52,000", progress: 104, owner: "Priya Patel", frequency: "Monthly", status: "On Track", statusVariant: "success" as const },
  { id: 4, name: "Campaign ROI", department: "Marketing", target: "300%", current: "280%", progress: 93, owner: "Mike Johnson", frequency: "Quarterly", status: "At Risk", statusVariant: "warning" as const },
  { id: 5, name: "Sprint Velocity", department: "Engineering", target: "45 pts", current: "48 pts", progress: 107, owner: "David Park", frequency: "Bi-weekly", status: "On Track", statusVariant: "success" as const },
  { id: 6, name: "Hiring Turnaround", department: "HR", target: "21 days", current: "18 days", progress: 114, owner: "Rachel Martinez", frequency: "Monthly", status: "Exceeded", statusVariant: "success" as const },
  { id: 7, name: "Bug Resolution Time", department: "Engineering", target: "48h", current: "56h", progress: 86, owner: "Alex Kim", frequency: "Weekly", status: "Behind", statusVariant: "danger" as const },
  { id: 8, name: "Employee Retention", department: "HR", target: "95%", current: "92%", progress: 97, owner: "Rachel Martinez", frequency: "Quarterly", status: "At Risk", statusVariant: "warning" as const },
];

export default function KPIsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = kpis.filter((k) =>
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="KPI Management"
        description="Define and track key performance indicators."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Performance", href: "/hr/performance" },
          { label: "KPIs" },
        ]}
        icon={<Target className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add KPI
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">On Track</p><p className="text-2xl font-bold">{kpis.filter((k) => k.status === "On Track" || k.status === "Exceeded").length}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10"><TrendingDown className="h-5 w-5 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">At Risk</p><p className="text-2xl font-bold">{kpis.filter((k) => k.status === "At Risk").length}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-danger/10"><TrendingDown className="h-5 w-5 text-danger" /></div>
            <div><p className="text-sm text-muted-foreground">Behind</p><p className="text-2xl font-bold">{kpis.filter((k) => k.status === "Behind").length}</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search KPIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">KPI</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Target</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Current</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Progress</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Frequency</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{kpi.name}</p>
                      <p className="text-xs text-muted-foreground">{kpi.owner}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><StatusBadge status={kpi.department} variant="primary" /></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{kpi.target}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm font-medium">{kpi.current}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="w-20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{kpi.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${kpi.progress >= 100 ? 'bg-success' : kpi.progress >= 90 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${Math.min(kpi.progress, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell"><span className="text-sm text-muted-foreground">{kpi.frequency}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={kpi.status} variant={kpi.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {kpis.length} KPIs</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
