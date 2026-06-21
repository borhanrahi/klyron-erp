"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  LayoutDashboard,
  Search,
  Bell,
  ChevronDown,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Users,
  Plus,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
} from "lucide-react";

const tasks = {
  todo: [
    {
      id: 1,
      title: "Design new landing page",
      assignee: "Sarah Chen",
      priority: "High",
      dueDate: "Mar 25",
      tags: ["Design", "Marketing"],
      comments: 4,
      attachments: 2,
      avatar: "SC",
    },
    {
      id: 2,
      title: "API integration testing",
      assignee: "Mike Johnson",
      priority: "Medium",
      dueDate: "Mar 27",
      tags: ["Backend", "QA"],
      comments: 2,
      attachments: 1,
      avatar: "MJ",
    },
    {
      id: 3,
      title: "Update documentation",
      assignee: "Alex Kim",
      priority: "Low",
      dueDate: "Mar 30",
      tags: ["Docs"],
      comments: 0,
      attachments: 0,
      avatar: "AK",
    },
  ],
  inProgress: [
    {
      id: 4,
      title: "Implement auth flow",
      assignee: "Sarah Chen",
      priority: "High",
      dueDate: "Mar 24",
      tags: ["Backend", "Security"],
      comments: 8,
      attachments: 3,
      avatar: "SC",
    },
    {
      id: 5,
      title: "Dashboard analytics setup",
      assignee: "Mike Johnson",
      priority: "Medium",
      dueDate: "Mar 26",
      tags: ["Frontend", "Analytics"],
      comments: 5,
      attachments: 1,
      avatar: "MJ",
    },
  ],
  review: [
    {
      id: 6,
      title: "Payment gateway integration",
      assignee: "David Park",
      priority: "High",
      dueDate: "Mar 23",
      tags: ["Backend", "Payments"],
      comments: 12,
      attachments: 4,
      avatar: "DP",
    },
  ],
  done: [
    {
      id: 7,
      title: "User onboarding flow",
      assignee: "Emily Davis",
      priority: "Medium",
      dueDate: "Mar 20",
      tags: ["Frontend", "UX"],
      comments: 6,
      attachments: 2,
      avatar: "ED",
    },
    {
      id: 8,
      title: "Database schema design",
      assignee: "Alex Kim",
      priority: "High",
      dueDate: "Mar 18",
      tags: ["Backend", "Database"],
      comments: 15,
      attachments: 5,
      avatar: "AK",
    },
  ],
};

const stats = [
  { label: "Total Tasks", value: 38, change: "+5 this week", icon: Target },
  { label: "In Progress", value: 12, change: "3 due today", icon: Clock },
  { label: "Completed", value: 24, change: "85% completion", icon: CheckCircle },
  { label: "Overdue", value: 2, change: "Needs attention", icon: AlertCircle },
];

const teamMembers = [
  { name: "Sarah Chen", role: "Lead Designer", tasks: 8, avatar: "SC", status: "online" },
  { name: "Mike Johnson", role: "Backend Dev", tasks: 6, avatar: "MJ", status: "online" },
  { name: "David Park", role: "Full Stack Dev", tasks: 7, avatar: "DP", status: "away" },
  { name: "Emily Davis", role: "Product Manager", tasks: 5, avatar: "ED", status: "offline" },
  { name: "Alex Kim", role: "DevOps Engineer", tasks: 4, avatar: "AK", status: "online" },
];

export default function TeamDashboardPage() {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Top Bar with Breadcrumbs */}
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

      {/* Stats Grid */}
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
                <span className="text-xs text-success font-semibold flex items-center gap-1">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Kanban Board */}
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
            {/* To Do Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <h4 className="text-sm font-semibold">To Do</h4>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {tasks.todo.length}
                </span>
              </div>
              {tasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* In Progress Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-info" />
                <h4 className="text-sm font-semibold">In Progress</h4>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {tasks.inProgress.length}
                </span>
              </div>
              {tasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Review Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <h4 className="text-sm font-semibold">Review</h4>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {tasks.review.length}
                </span>
              </div>
              {tasks.review.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Done Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-success" />
                <h4 className="text-sm font-semibold">Done</h4>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {tasks.done.length}
                </span>
              </div>
              {tasks.done.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>

        {/* Team Members Sidebar */}
        <div className="xl:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {member.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                      member.status === "online"
                        ? "bg-success"
                        : member.status === "away"
                        ? "bg-warning"
                        : "bg-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{member.tasks}</p>
                  <p className="text-xs text-muted-foreground">tasks</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors">
                View All Tasks
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors">
                Team Calendar
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors">
                Reports & Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const priorityColors = {
    High: "bg-danger/10 text-danger",
    Medium: "bg-warning/10 text-warning",
    Low: "bg-success/10 text-success",
  };

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all cursor-pointer group">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
          {task.priority}
        </span>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <h5 className="text-sm font-medium mb-3">{task.title}</h5>
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
            {task.avatar}
          </div>
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {task.attachments}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
}
