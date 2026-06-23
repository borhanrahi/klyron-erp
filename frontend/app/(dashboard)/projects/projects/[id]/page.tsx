"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FolderKanban,
  ArrowLeft,
  Edit,
  CheckCircle,
  Clock,
  Target,
  ListTodo,
  Milestone,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface Project {
  id: string;
  code: string;
  name: string;
  client_id: string;
  manager_id: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  progress_pct: number;
  billing_type: string;
  company_id: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface Milestone {
  id: string;
  name: string;
  due_date: string;
  amount: number;
  status: string;
}

function milestoneVariant(status: string) {
  const s = status.toLowerCase();
  if (s === "completed" || s === "done") return "success";
  if (s === "in progress" || s === "active") return "info";
  if (s === "cancelled" || s === "failed") return "danger";
  if (s === "upcoming" || s === "pending" || s === "not started") return "muted";
  return "info";
}

function projectStatusVariant(status: string) {
  const s = status.toLowerCase();
  if (s === "completed" || s === "done") return "success";
  if (s === "in progress" || s === "active") return "info";
  if (s === "on hold" || s === "paused") return "warning";
  if (s === "cancelled") return "danger";
  if (s === "planning" || s === "not started") return "muted";
  return "info";
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    async function load() {
      try {
        const [projRes, tasksRes, msRes] = await Promise.all([
          apiGet<{ data: Project }>(`/projects/${projectId}`),
          apiGet<{ items: Task[]; total: number }>(`/projects/tasks/list?project_id=${projectId}`),
          apiGet<{ items: Milestone[]; total: number }>(`/projects/milestones/list?project_id=${projectId}`),
        ]);
        if (cancelled) return;
        setProject(projRes.data);
        setTasks(tasksRes.items ?? []);
        setMilestones(msRes.items ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load project");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [projectId]);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status.toLowerCase() === "completed" || t.status.toLowerCase() === "done").length,
    inProgress: tasks.filter((t) => t.status.toLowerCase() === "in progress" || t.status.toLowerCase() === "active").length,
    todo: tasks.filter((t) => t.status.toLowerCase() === "todo" || t.status.toLowerCase() === "to do" || t.status.toLowerCase() === "not started").length,
  };

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const fmtDate = (s: string) => (s ? new Date(s).toLocaleDateString() : "—");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Project Not Found"
          icon={<FolderKanban className="h-6 w-6 text-primary" />}
          actions={
            <button
              onClick={() => router.back()}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          }
        />
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{error ?? "Project not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={project.name}
        description={project.code}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Projects", href: "/projects/projects" },
          { label: project.name },
        ]}
        icon={<FolderKanban className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={() => router.push(`/projects/projects/${projectId}/edit`)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Project
            </button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-2xl font-bold mt-1">{project.progress_pct}%</p>
          <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${project.progress_pct}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Budget</p>
          <p className="text-2xl font-bold mt-1">{fmtCurrency(project.budget)}</p>
          <p className="text-xs text-muted-foreground mt-1">{project.billing_type ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Tasks</p>
          <p className="text-2xl font-bold mt-1">{taskStats.total}</p>
          <p className="text-xs text-success mt-1">{taskStats.completed} completed</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Priority</p>
          <p className="text-2xl font-bold mt-1 capitalize">{project.priority}</p>
          <p className="text-xs text-muted-foreground mt-1">
            <StatusBadge status={project.status} variant={projectStatusVariant(project.status)} />
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "overview", label: "Overview", icon: FileText },
          { id: "tasks", label: "Tasks", icon: ListTodo },
          { id: "milestones", label: "Milestones", icon: Milestone },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="space-y-3">
              {[
                { label: "Status", value: <StatusBadge status={project.status} variant={projectStatusVariant(project.status)} /> },
                { label: "Manager ID", value: project.manager_id },
                { label: "Client ID", value: project.client_id },
                { label: "Start Date", value: fmtDate(project.start_date) },
                { label: "End Date", value: fmtDate(project.end_date) },
                { label: "Budget", value: fmtCurrency(project.budget) },
                { label: "Created", value: fmtDate(project.created_at) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{project.progress_pct}%</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Overall Completion</p>
                  <p className="text-xs text-muted-foreground">{taskStats.completed} of {taskStats.total} tasks done</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-3 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground">To Do</p>
                  <p className="text-lg font-bold">{taskStats.todo}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-lg font-bold text-info">{taskStats.inProgress}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-lg font-bold text-success">{taskStats.completed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "To Do", count: taskStats.todo, color: "text-muted-foreground" },
            { title: "In Progress", count: taskStats.inProgress, color: "text-info" },
            { title: "Completed", count: taskStats.completed, color: "text-success" },
          ].map((col) => (
            <div key={col.title} className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h4 className={`text-sm font-semibold ${col.color}`}>{col.title}</h4>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{col.count}</span>
              </div>
              <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                {tasks
                  .filter((t) => {
                    const s = t.status.toLowerCase();
                    if (col.title === "To Do") return s === "todo" || s === "to do" || s === "not started";
                    if (col.title === "In Progress") return s === "in progress" || s === "active";
                    return s === "completed" || s === "done";
                  })
                  .slice(0, 5)
                  .map((t) => (
                    <div key={t.id} className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{t.priority}</p>
                    </div>
                  ))}
                {col.count === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === "milestones" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No milestones found.</p>
          ) : (
            <div className="space-y-4">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ms.status.toLowerCase() === "completed" ? "bg-success/10" : "bg-muted"
                  }`}>
                    {ms.status.toLowerCase() === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : ms.status.toLowerCase() === "in progress" ? (
                      <Clock className="h-5 w-5 text-info" />
                    ) : (
                      <Target className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ms.name}</p>
                    <p className="text-xs text-muted-foreground">Due: {fmtDate(ms.due_date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {ms.amount != null && (
                      <span className="text-xs text-muted-foreground">{fmtCurrency(ms.amount)}</span>
                    )}
                    <StatusBadge status={ms.status} variant={milestoneVariant(ms.status)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
