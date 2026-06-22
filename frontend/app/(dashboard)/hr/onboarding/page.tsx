"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ClipboardCheck,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const onboardingChecklists = [
  { id: 1, employee: "Sarah Wilson", avatar: "SW", role: "Product Manager", startDate: "Jul 1, 2024", progress: 100, items: 12, completed: 12, status: "Completed", statusVariant: "success" as const },
  { id: 2, employee: "John Smith", avatar: "JS", role: "Senior Frontend Developer", startDate: "Jul 8, 2024", progress: 60, items: 12, completed: 7, status: "In Progress", statusVariant: "info" as const },
  { id: 3, employee: "Maria Garcia", avatar: "MG", role: "Backend Developer", startDate: "Jul 15, 2024", progress: 25, items: 12, completed: 3, status: "In Progress", statusVariant: "info" as const },
  { id: 4, employee: "David Lee", avatar: "DL", role: "DevOps Engineer", startDate: "Jul 22, 2024", progress: 0, items: 12, completed: 0, status: "Pending", statusVariant: "warning" as const },
];

const defaultTasks = [
  { category: "Documentation", tasks: ["Sign employment contract", "Submit tax forms (W-4)", "Provide ID proof", "Complete NDA"] },
  { category: "IT Setup", tasks: ["Create company email", "Set up laptop", "Configure VPN access", "Install required software"] },
  { category: "HR Orientation", tasks: ["Review employee handbook", "Complete benefits enrollment", "Set up payroll details", "Emergency contact form"] },
];

export default function OnboardingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = onboardingChecklists.filter((c) =>
    c.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Onboarding"
        description="Manage new employee onboarding checklists and progress."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Onboarding" },
        ]}
        icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Onboarding
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10"><CheckCircle className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">1</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10"><Clock className="h-5 w-5 text-info" /></div>
            <div><p className="text-sm text-muted-foreground">In Progress</p><p className="text-2xl font-bold">2</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10"><AlertCircle className="h-5 w-5 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold">1</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search onboarding..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {filtered.map((checklist) => (
            <div key={checklist.id} className="rounded-xl border border-border bg-muted/50 p-4 hover:bg-muted transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 lg:w-64">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{checklist.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{checklist.employee}</p>
                    <p className="text-xs text-muted-foreground">{checklist.role}</p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                    <p className="text-sm font-medium">{checklist.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${checklist.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium">{checklist.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                    <p className="text-sm font-medium">{checklist.completed}/{checklist.items}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={checklist.status} variant={checklist.statusVariant} />
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Default Onboarding Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaultTasks.map((category) => (
            <div key={category.category}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">{category.category}</h4>
              <div className="space-y-2">
                {category.tasks.map((task) => (
                  <div key={task} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
