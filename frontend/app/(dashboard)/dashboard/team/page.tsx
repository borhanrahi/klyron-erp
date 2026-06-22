"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import {
  LayoutDashboard,
  Search,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  MoreHorizontal,
  AlertTriangle,
  Briefcase,
} from "lucide-react";

interface TeamData {
  task_counts: { todo: number; in_progress: number; review: number; done: number; blocked: number };
  total_tasks: number;
  priority_counts: { high: number; medium: number; low: number };
  overdue_tasks: number;
  recent_tasks: Array<{
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string;
    project_name: string;
    assignee_id: number;
  }>;
  team_members: Array<{
    id: number;
    name: string;
    designation_id: number;
    tasks: number;
  }>;
  active_projects: Array<{
    id: number;
    name: string;
    status: string;
    progress_pct: number;
  }>;
}

const kanbanColumns = [
  { key: "todo", label: "To Do", dot: "bg-muted-foreground" },
  { key: "in_progress", label: "In Progress", dot: "bg-info" },
  { key: "review", label: "Review", dot: "bg-warning" },
  { key: "done", label: "Done", dot: "bg-success" },
] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamDashboardPage() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("team");

  useEffect(() => {
    apiGet<{ data: TeamData }>("/dashboard/team")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Dashboards</span>
          <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
            Team Dashboard
          </span>
        </div>
        <PageHeader
          title="Team Dashboard"
          description="Manage your team's tasks and progress."
          icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-muted rounded-xl animate-pulse h-9 w-9" />
                <div className="animate-pulse h-3 w-16 bg-muted rounded" />
              </div>
              <div className="animate-pulse h-8 w-12 bg-muted rounded mb-1" />
              <div className="animate-pulse h-3 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-9 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="animate-pulse h-6 w-32 bg-muted rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="animate-pulse h-4 w-20 bg-muted rounded mb-4" />
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="rounded-xl border border-border/50 p-4 space-y-3">
                      <div className="animate-pulse h-3 w-12 bg-muted rounded" />
                      <div className="animate-pulse h-4 w-full bg-muted rounded" />
                      <div className="animate-pulse h-3 w-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="xl:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="animate-pulse h-6 w-28 bg-muted rounded mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="animate-pulse h-10 w-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="animate-pulse h-3 w-24 bg-muted rounded" />
                    <div className="animate-pulse h-2 w-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Dashboards</span>
          <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
            Team Dashboard
          </span>
        </div>
        <PageHeader
          title="Team Dashboard"
          description="Manage your team's tasks and progress."
          icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
        />
        <div className="rounded-2xl border border-border bg-card p-12 shadow-sm flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-12 w-12 text-danger mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); apiGet<{ data: TeamData }>("/dashboard/team").then((res) => setData(res.data)).catch((err) => setError(err.message)).finally(() => setLoading(false)); }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const groupedTasks: Record<string, TeamData["recent_tasks"]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };
  data?.recent_tasks.forEach((task) => {
    if (task.status in groupedTasks) {
      groupedTasks[task.status].push(task);
    }
  });

  const stats = [
    { label: "Total Tasks", value: data?.total_tasks ?? 0, icon: Target },
    { label: "In Progress", value: data?.task_counts.in_progress ?? 0, icon: Clock },
    { label: "Completed", value: data?.task_counts.done ?? 0, icon: CheckCircle },
    { label: "Overdue", value: data?.overdue_tasks ?? 0, icon: AlertCircle },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Dashboards</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Team Dashboard
        </span>
      </div>

      <PageHeader
        title="Team Dashboard"
        description="Manage your team's tasks and progress."
        icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-9 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Task Board</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kanbanColumns.map((col) => (
              <div key={col.key} className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <h4 className="text-sm font-semibold">{col.label}</h4>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {groupedTasks[col.key]?.length ?? 0}
                  </span>
                </div>
                {(groupedTasks[col.key] ?? []).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Team Members</h3>
            <div className="space-y-4">
              {(data?.team_members ?? []).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {getInitials(member.name)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{member.tasks}</p>
                    <p className="text-xs text-muted-foreground">tasks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
            <div className="space-y-4">
              {(data?.active_projects ?? []).map((project) => (
                <div
                  key={project.id}
                  className="p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium truncate">{project.name}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${project.progress_pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground capitalize">{project.status}</span>
                    <span className="text-xs font-semibold text-primary">{project.progress_pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: TeamData["recent_tasks"][number] }) {
  const priorityColors: Record<string, string> = {
    high: "bg-danger/10 text-danger",
    medium: "bg-warning/10 text-warning",
    low: "bg-success/10 text-success",
  };

  const priorityLabels: Record<string, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all cursor-pointer group">
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[task.priority] ?? "bg-muted text-muted-foreground"}`}
        >
          {priorityLabels[task.priority] ?? task.priority}
        </span>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <h5 className="text-sm font-medium mb-3">{task.title}</h5>
      {task.project_name && (
        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">
          {task.project_name}
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
            #{task.assignee_id}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.due_date && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
