"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { ListTodo, ArrowLeft, Edit, Calendar, Clock, Loader2, AlertCircle } from "lucide-react";

interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  assignee_id: number | null;
  priority: string;
  due_date: string | null;
  status: string;
  hours_estimated: number | null;
  hours_logged: number | null;
  parent_id: number | null;
  stage: string | null;
  created_at: string;
}

const priorityVariant: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  low: "muted",
  medium: "info",
  high: "warning",
  critical: "danger",
};

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  todo: "muted",
  in_progress: "info",
  review: "warning",
  done: "success",
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    apiGet<{ data: Task }>(`/projects/tasks/${params.id}`)
      .then((res) => setTask(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-danger" />
        <p className="text-muted-foreground">{error || "Task not found"}</p>
        <button
          onClick={() => router.push("/projects/tasks")}
          className="text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tasks
        </button>
      </div>
    );
  }

  const logged = task.hours_logged ?? 0;
  const estimated = task.hours_estimated ?? 1;
  const timePercent = Math.min((logged / estimated) * 100, 100);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={task.title}
        description={`Task #${task.id}`}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Tasks", href: "/projects/tasks" },
          { label: `#${task.id}` },
        ]}
        icon={<ListTodo className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/projects/tasks")}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Task
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-1 border-b border-border">
            {[
              { id: "details", label: "Details" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "details" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description || "No description provided."}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status & Priority */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <StatusBadge
                status={task.status.replace("_", " ")}
                variant={statusVariant[task.status] ?? "info"}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
              <StatusBadge
                status={task.priority}
                variant={priorityVariant[task.priority] ?? "info"}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Project</label>
              <a
                href={`/projects/projects/${task.project_id}`}
                className="text-sm text-primary hover:underline"
              >
                Project #{task.project_id}
              </a>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Assignee</label>
              <p className="text-sm">{task.assignee_id ? `User #${task.assignee_id}` : "Unassigned"}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{formatDate(task.due_date)}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Time Tracking</label>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{logged}h logged</span>
                <span>{task.hours_estimated ?? "—"}h estimated</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-info rounded-full"
                  style={{ width: `${timePercent}%` }}
                />
              </div>
            </div>
            {task.stage && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Stage</label>
                <p className="text-sm">{task.stage}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Created</label>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{formatDate(task.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
