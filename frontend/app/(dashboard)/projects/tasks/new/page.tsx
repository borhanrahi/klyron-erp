"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { ListTodo, Save, ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface Project {
  id: number;
  code: string;
  name: string;
}

export default function NewTaskPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    project_id: "",
    title: "",
    description: "",
    assignee_id: "",
    priority: "medium",
    status: "todo",
    due_date: "",
    hours_estimated: "",
  });

  useEffect(() => {
    apiGet<{ items: Project[] }>("/projects/")
      .then((res) => setProjects(res.items))
      .catch(() => {})
      .finally(() => setLoadingProjects(false));
  }, []);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.project_id || !form.title) {
      setError("Project and title are required.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await apiPost("/projects/tasks", {
        project_id: Number(form.project_id),
        title: form.title,
        description: form.description || undefined,
        assignee_id: form.assignee_id ? Number(form.assignee_id) : undefined,
        priority: form.priority,
        status: form.status,
        due_date: form.due_date || undefined,
        hours_estimated: form.hours_estimated ? Number(form.hours_estimated) : undefined,
      });
      router.push("/projects/tasks");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Create New Task"
        description="Add a new task to track work items."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Tasks", href: "/projects/tasks" },
          { label: "New Task" },
        ]}
        icon={<ListTodo className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.push("/projects/tasks")}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Task Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Task Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter task title"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the task details and requirements..."
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Project *
              </label>
              <select
                required
                value={form.project_id}
                onChange={(e) => updateField("project_id", e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">{loadingProjects ? "Loading projects..." : "Select project"}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Priority *
              </label>
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Assignee ID
              </label>
              <input
                type="number"
                value={form.assignee_id}
                onChange={(e) => updateField("assignee_id", e.target.value)}
                placeholder="Enter user ID"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Status *
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <DatePicker
                  value={form.due_date}
                  onChange={(d) => updateField("due_date", d)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Hours Estimated
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.hours_estimated}
                onChange={(e) => updateField("hours_estimated", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/projects/tasks")}
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
