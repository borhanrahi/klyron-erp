"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
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

const taskColumns = [
  {
    id: "todo",
    title: "To Do",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    count: 4,
    tasks: [
      { id: 1, title: "Design checkout flow wireframes", assignee: "ED", assigneeName: "Emily Davis", priority: "High", project: "E-Commerce Redesign", dueDate: "Jun 25", tags: ["Design"] },
      { id: 2, title: "Set up staging environment", assignee: "AK", assigneeName: "Alex Kim", priority: "Medium", project: "Mobile App v2.0", dueDate: "Jun 28", tags: ["DevOps"] },
      { id: 3, title: "Write API documentation", assignee: "OH", assigneeName: "Omar Hassan", priority: "Low", project: "E-Commerce Redesign", dueDate: "Jul 1", tags: ["Docs"] },
      { id: 4, title: "Create onboarding email templates", assignee: "PP", assigneeName: "Priya Patel", priority: "Medium", project: "Customer Portal", dueDate: "Jul 5", tags: ["Marketing"] },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "text-info",
    bgColor: "bg-info/10",
    count: 3,
    tasks: [
      { id: 5, title: "Implement user authentication", assignee: "MJ", assigneeName: "Mike Johnson", priority: "High", project: "E-Commerce Redesign", dueDate: "Jun 22", tags: ["Backend"] },
      { id: 6, title: "Build product catalog API", assignee: "DP", assigneeName: "David Park", priority: "High", project: "E-Commerce Redesign", dueDate: "Jun 24", tags: ["Backend"] },
      { id: 7, title: "Create component library", assignee: "OH", assigneeName: "Omar Hassan", priority: "Medium", project: "E-Commerce Redesign", dueDate: "Jun 30", tags: ["Frontend"] },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "text-warning",
    bgColor: "bg-warning/10",
    count: 2,
    tasks: [
      { id: 8, title: "Payment gateway integration", assignee: "MJ", assigneeName: "Mike Johnson", priority: "Critical", project: "E-Commerce Redesign", dueDate: "Jun 20", tags: ["Backend", "Finance"] },
      { id: 9, title: "User dashboard mockups", assignee: "ED", assigneeName: "Emily Davis", priority: "High", project: "Data Analytics", dueDate: "Jun 23", tags: ["Design"] },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "text-success",
    bgColor: "bg-success/10",
    count: 3,
    tasks: [
      { id: 10, title: "Setup CI/CD pipeline", assignee: "AK", assigneeName: "Alex Kim", priority: "High", project: "CI/CD Pipeline", dueDate: "Jun 15", tags: ["DevOps"] },
      { id: 11, title: "Database schema design", assignee: "DP", assigneeName: "David Park", priority: "High", project: "E-Commerce Redesign", dueDate: "Jun 10", tags: ["Backend"] },
      { id: 12, title: "Brand guidelines document", assignee: "ED", assigneeName: "Emily Davis", priority: "Medium", project: "E-Commerce Redesign", dueDate: "Jun 8", tags: ["Design"] },
    ],
  },
];

const priorityColors: Record<string, string> = {
  Critical: "text-danger",
  High: "text-warning",
  Medium: "text-info",
  Low: "text-muted-foreground",
};

const priorityBg: Record<string, string> = {
  Critical: "bg-danger/10",
  High: "bg-warning/10",
  Medium: "bg-info/10",
  Low: "bg-muted",
};

export default function TasksBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
                    <div className="flex gap-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${priorityBg[task.priority]} ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors mb-2">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-semibold text-primary">
                        {task.assignee}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {task.assigneeName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate}
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
