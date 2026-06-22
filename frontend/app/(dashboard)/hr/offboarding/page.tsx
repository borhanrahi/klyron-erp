"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  LogOut,
  Search,
  Plus,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const offboardingRecords = [
  { id: 1, employee: "Lisa Thompson", avatar: "LT", department: "Design", type: "Resignation", lastDay: "Jul 15, 2024", noticeDate: "Jun 15, 2024", reason: "Career change", status: "In Progress", statusVariant: "info" as const, tasksCompleted: 6, totalTasks: 12 },
  { id: 2, employee: "Tom Harris", avatar: "TH", department: "Sales", type: "Termination", lastDay: "Jun 30, 2024", noticeDate: "Jun 20, 2024", reason: "Performance", status: "In Progress", statusVariant: "warning" as const, tasksCompleted: 4, totalTasks: 12 },
  { id: 3, employee: "Nina Patel", avatar: "NP", department: "Engineering", type: "Resignation", lastDay: "Jul 31, 2024", noticeDate: "Jun 30, 2024", reason: "Better opportunity", status: "Pending", statusVariant: "muted" as const, tasksCompleted: 0, totalTasks: 12 },
  { id: 4, employee: "Carlos Mendez", avatar: "CM", department: "Operations", type: "End of Contract", lastDay: "Jun 30, 2024", noticeDate: "May 30, 2024", reason: "Contract ended", status: "Completed", statusVariant: "success" as const, tasksCompleted: 12, totalTasks: 12 },
];

export default function OffboardingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = offboardingRecords.filter((r) =>
    r.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Offboarding"
        description="Manage employee departures, resignations, and exit processes."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Offboarding" },
        ]}
        icon={<LogOut className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Initiate Offboarding
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10"><LogOut className="h-5 w-5 text-info" /></div>
            <div><p className="text-sm text-muted-foreground">Active Offboarding</p><p className="text-2xl font-bold">{offboardingRecords.filter((r) => r.status !== "Completed").length}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10"><AlertTriangle className="h-5 w-5 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">Resignations</p><p className="text-2xl font-bold">{offboardingRecords.filter((r) => r.type === "Resignation").length}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10"><Calendar className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{offboardingRecords.filter((r) => r.status === "Completed").length}</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search offboarding records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {filtered.map((record) => (
            <div key={record.id} className="rounded-xl border border-border bg-muted/50 p-4 hover:bg-muted transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 lg:w-64">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{record.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{record.employee}</p>
                    <p className="text-xs text-muted-foreground">{record.department}</p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <StatusBadge status={record.type} variant={record.type === "Resignation" ? "warning" : record.type === "Termination" ? "danger" : "info"} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Day</p>
                    <p className="text-sm font-medium">{record.lastDay}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reason</p>
                    <p className="text-sm font-medium">{record.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(record.tasksCompleted / record.totalTasks) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium">{record.tasksCompleted}/{record.totalTasks}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={record.status} variant={record.statusVariant} />
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
