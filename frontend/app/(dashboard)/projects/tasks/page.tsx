"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  ListTodo,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  GripVertical,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee_id?: number;
  project_id?: number;
  due_date?: string;
}

interface TaskColumn {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  count: number;
  tasks: Task[];
}

const priorityColors: Record<string, string> = {
  critical: "text-danger",
  high: "text-warning",
  medium: "text-info",
  low: "text-muted-foreground",
};

const priorityBg: Record<string, string> = {
  critical: "bg-danger/10",
  high: "bg-warning/10",
  medium: "bg-info/10",
  low: "bg-muted",
};

export default function TasksBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [taskColumns, setTaskColumns] = useState<TaskColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ items: Task[] }>("/projects/tasks/list")
      .then((res) => {
        const items = res.items || [];
        const columns: Record<string, Task[]> = {
          todo: [],
          "in-progress": [],
          review: [],
          done: [],
        };
        const statusMap: Record<string, string> = {
          todo: "todo",
          in_progress: "in-progress",
          review: "review",
          done: "done",
          completed: "done",
        };
        items.forEach((task) => {
          const col = statusMap[task.status] || "todo";
          columns[col].push(task);
        });
        setTaskColumns([
          { id: "todo", title: "To Do", color: "text-muted-foreground", bgColor: "bg-muted", count: columns.todo.length, tasks: columns.todo },
          { id: "in-progress", title: "In Progress", color: "text-info", bgColor: "bg-info/10", count: columns["in-progress"].length, tasks: columns["in-progress"] },
          { id: "review", title: "Review", color: "text-warning", bgColor: "bg-warning/10", count: columns.review.length, tasks: columns.review },
          { id: "done", title: "Done", color: "text-success", bgColor: "bg-success/10", count: columns.done.length, tasks: columns.done },
        ]);
      })
      .catch(() => setTaskColumns([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Tasks Board"
        description="Manage and track tasks across your projects."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Tasks" },
        ]}
        icon={<ListTodo className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64"
              />
            </div>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <a
              href="/projects/tasks/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Task
            </a>
          </div>
        }
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {taskColumns.map((column) => (
          <div key={column.id} className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-semibold ${column.color}`}>
                  {column.title}
                </h4>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {column.count}
                </span>
              </div>
              <button className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 space-y-3 min-h-[200px]">
              {column.tasks.map((task) => (
                <a
                  key={task.id}
                  href={`/projects/tasks/${task.id}`}
                  className="block p-3 bg-muted rounded-xl hover:bg-muted/80 transition-all cursor-pointer group hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${priorityBg[task.priority] || ""} ${priorityColors[task.priority] || ""}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors mb-2">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-semibold text-primary">
                        #{task.assignee_id || "NA"}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {task.assignee_id ? `User #${task.assignee_id}` : "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : "TBD"}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
