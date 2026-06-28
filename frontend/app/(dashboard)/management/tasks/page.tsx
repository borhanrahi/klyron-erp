"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ClipboardList,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  X,
} from "lucide-react";

type Priority = "high" | "medium" | "low";
type Status = "todo" | "in_progress" | "review" | "done";

interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: string;
  assigned_to_avatar: string;
  department: string;
  priority: Priority;
  status: Status;
  due_date: string;
  created_at: string;
}

const priorityColors: Record<Priority, "danger" | "warning" | "info"> = {
  high: "danger",
  medium: "warning",
  low: "info",
};

const statusColors: Record<Status, "muted" | "info" | "warning" | "success"> = {
  todo: "muted",
  in_progress: "info",
  review: "warning",
  done: "success",
};

const TEAM_MEMBERS = [
  { name: "Sumaiya Rahman", initials: "SR", department: "Product" },
  { name: "Tanvir Ahmed", initials: "TA", department: "Design" },
  { name: "Sabrina Islam", initials: "SI", department: "Design" },
  { name: "Md Karim", initials: "MK", department: "Marketing" },
  { name: "Tasnim Fahmida", initials: "TF", department: "Marketing" },
  { name: "Jubayer Hossain", initials: "JH", department: "Sales" },
  { name: "Farhana Parveen", initials: "FP", department: "Sales" },
  { name: "Nadia Sultana", initials: "NS", department: "Finance" },
  { name: "Mst Khatun", initials: "MK", department: "HR" },
  { name: "Zahid Hassan", initials: "ZH", department: "Operations" },
  { name: "Ruma Akhter", initials: "RA", department: "Support" },
  { name: "Sohel Rana", initials: "SR", department: "QA" },
  { name: "Shirin Sultana", initials: "SS", department: "Product" },
  { name: "Rakibul Islam", initials: "RI", department: "Sales" },
  { name: "Jahanara Begum", initials: "JB", department: "Finance" },
];

const initialTasks: Task[] = [
  { id: 1, title: "Design system audit", description: "Review all components for consistency", assigned_to: "Sarah Chen", assigned_to_avatar: "SC", department: "Engineering", priority: "high", status: "in_progress", due_date: "2026-07-20", created_at: "2026-07-10" },
  { id: 2, title: "API documentation", description: "Write docs for new endpoints", assigned_to: "Mike Johnson", assigned_to_avatar: "MJ", department: "Engineering", priority: "high", status: "todo", due_date: "2026-07-25", created_at: "2026-07-12" },
  { id: 3, title: "User testing sessions", description: "Schedule and run usability tests", assigned_to: "Emily Davis", assigned_to_avatar: "ED", department: "Product", priority: "medium", status: "in_progress", due_date: "2026-07-22", created_at: "2026-07-11" },
  { id: 4, title: "Q3 performance reviews", description: "Complete Q3 review cycles", assigned_to: "Rachel Martinez", assigned_to_avatar: "RM", department: "HR", priority: "medium", status: "review", due_date: "2026-07-30", created_at: "2026-07-01" },
  { id: 5, title: "Database migration", description: "Migrate user data to new schema", assigned_to: "David Park", assigned_to_avatar: "DP", department: "DevOps", priority: "high", status: "done", due_date: "2026-07-15", created_at: "2026-06-28" },
  { id: 6, title: "Marketing materials update", description: "Update Q3 collateral", assigned_to: "Lisa Thompson", assigned_to_avatar: "LT", department: "Design", priority: "low", status: "todo", due_date: "2026-08-05", created_at: "2026-07-14" },
  { id: 7, title: "Server maintenance", description: "Apply security patches to staging", assigned_to: "Alex Kim", assigned_to_avatar: "AK", department: "DevOps", priority: "high", status: "in_progress", due_date: "2026-07-18", created_at: "2026-07-13" },
  { id: 8, title: "Budget planning", description: "Prepare Q4 budget projections", assigned_to: "James Wilson", assigned_to_avatar: "JW", department: "Finance", priority: "medium", status: "todo", due_date: "2026-07-28", created_at: "2026-07-10" },
];

export default function TeamTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"list" | "kanban">("list");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "medium" as Priority,
    due_date: "",
  });
  const [nextId, setNextId] = useState(9);

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todo = filtered.filter((t) => t.status === "todo");
  const inProgress = filtered.filter((t) => t.status === "in_progress" || t.status === "review");
  const done = filtered.filter((t) => t.status === "done");

  function handleCreateTask() {
    if (!newTask.title.trim() || !newTask.assigned_to) return;
    const member = TEAM_MEMBERS.find((m) => m.name === newTask.assigned_to);
    const task: Task = {
      id: nextId,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      assigned_to: newTask.assigned_to,
      assigned_to_avatar: member?.initials || "NA",
      department: member?.department || "General",
      priority: newTask.priority,
      status: "todo",
      due_date: newTask.due_date || new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [task, ...prev]);
    setNextId((id) => id + 1);
    setShowModal(false);
    setNewTask({ title: "", description: "", assigned_to: "", priority: "medium", due_date: "" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Tasks"
        description="Track and manage tasks across your team"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 text-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        }
      />

      {/* Search & View Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex items-center bg-muted rounded-lg p-0.5 border border-border">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "kanban" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Board
          </button>
        </div>
      </div>

      {view === "list" ? (
        /* ── List View ── */
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Task</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Assignee</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Due Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Priority</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                          {task.assigned_to_avatar}
                        </div>
                        <span className="text-sm">{task.assigned_to}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {task.due_date}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={task.priority} variant={priorityColors[task.priority]} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={task.status.replace("_", " ")} variant={statusColors[task.status]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filtered.length} tasks</p>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</span>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Kanban Board ── */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do Column */}
          <div className="rounded-xl bg-muted/30 border border-border p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-muted-foreground">To Do</h3>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{todo.length}</span>
            </div>
            <div className="space-y-2">
              {todo.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
              ) : (
                todo.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium">{task.title}</p>
                      <StatusBadge status={task.priority} variant={priorityColors[task.priority]} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-semibold text-primary">
                          {task.assigned_to_avatar}
                        </div>
                        <span className="text-xs text-muted-foreground">{task.assigned_to}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.due_date}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="rounded-xl bg-muted/30 border border-border p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-muted-foreground">In Progress</h3>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{inProgress.length}</span>
            </div>
            <div className="space-y-2">
              {inProgress.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
              ) : (
                inProgress.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium">{task.title}</p>
                      <StatusBadge status={task.priority} variant={priorityColors[task.priority]} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-semibold text-primary">
                          {task.assigned_to_avatar}
                        </div>
                        <span className="text-xs text-muted-foreground">{task.assigned_to}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.due_date}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="rounded-xl bg-muted/30 border border-border p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-muted-foreground">Done</h3>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{done.length}</span>
            </div>
            <div className="space-y-2">
              {done.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
              ) : (
                done.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow cursor-pointer opacity-70">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium line-through">{task.title}</p>
                      <StatusBadge status="success" variant="success" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-semibold text-primary">
                          {task.assigned_to_avatar}
                        </div>
                        <span className="text-xs text-muted-foreground">{task.assigned_to}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        Done
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── New Task Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg mx-4 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Create New Task</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Design system audit"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  placeholder="Describe what needs to be done..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              {/* Assignee + Priority row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Assign To *</label>
                  <select
                    value={newTask.assigned_to}
                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select member...</option>
                    {TEAM_MEMBERS.map((m) => (
                      <option key={m.name} value={m.name}>{m.name} ({m.department})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim() || !newTask.assigned_to}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
