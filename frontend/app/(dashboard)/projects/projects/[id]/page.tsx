"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FolderKanban,
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  MessageSquare,
  ListTodo,
  Milestone,
} from "lucide-react";

const projectData = {
  id: "PRJ-001",
  name: "E-Commerce Platform Redesign",
  description:
    "Complete redesign of the company e-commerce platform with modern UI/UX, improved performance, and new features including AI-powered recommendations.",
  manager: "Sarah Chen",
  managerAvatar: "SC",
  budget: 125000,
  spent: 87500,
  progress: 70,
  status: "In Progress",
  statusVariant: "info" as const,
  startDate: "Jan 15, 2024",
  endDate: "Jul 30, 2024",
  team: [
    { name: "Sarah Chen", role: "Project Manager", avatar: "SC" },
    { name: "Mike Johnson", role: "Lead Developer", avatar: "MJ" },
    { name: "Emily Davis", role: "UI/UX Designer", avatar: "ED" },
    { name: "David Park", role: "Backend Developer", avatar: "DP" },
    { name: "Omar Hassan", role: "Frontend Developer", avatar: "OH" },
    { name: "Priya Patel", role: "QA Engineer", avatar: "PP" },
  ],
  tasks: {
    total: 48,
    completed: 34,
    inProgress: 8,
    todo: 6,
  },
  milestones: [
    { name: "Discovery & Planning", date: "Feb 15, 2024", status: "Completed", statusVariant: "success" as const },
    { name: "Design Phase", date: "Mar 30, 2024", status: "Completed", statusVariant: "success" as const },
    { name: "Frontend Development", date: "May 15, 2024", status: "In Progress", statusVariant: "info" as const },
    { name: "Backend Integration", date: "Jun 15, 2024", status: "Upcoming", statusVariant: "muted" as const },
    { name: "Testing & QA", date: "Jul 10, 2024", status: "Upcoming", statusVariant: "muted" as const },
    { name: "Launch", date: "Jul 30, 2024", status: "Upcoming", statusVariant: "muted" as const },
  ],
  recentActivity: [
    { user: "Sarah Chen", action: "updated task", target: "API Integration", time: "2 hours ago" },
    { user: "Mike Johnson", action: "completed", target: "Payment Gateway Setup", time: "4 hours ago" },
    { user: "Emily Davis", action: "uploaded", target: "New homepage mockups", time: "6 hours ago" },
    { user: "David Park", action: "commented on", target: "Product Catalog API", time: "8 hours ago" },
  ],
};

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const budgetPercentage = (projectData.spent / projectData.budget) * 100;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={projectData.name}
        description={projectData.id}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Projects", href: "/projects/projects" },
          { label: projectData.name },
        ]}
        icon={<FolderKanban className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/projects/projects"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Project
            </button>
          </div>
        }
      />

      {/* Project Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-2xl font-bold mt-1">{projectData.progress}%</p>
          <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${projectData.progress}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Budget</p>
          <p className="text-2xl font-bold mt-1">
            ${projectData.budget.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Spent: ${projectData.spent.toLocaleString()} (
            {budgetPercentage.toFixed(0)}%)
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Tasks</p>
          <p className="text-2xl font-bold mt-1">{projectData.tasks.total}</p>
          <p className="text-xs text-success mt-1">
            {projectData.tasks.completed} completed
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Team Size</p>
          <p className="text-2xl font-bold mt-1">{projectData.team.length}</p>
          <p className="text-xs text-muted-foreground mt-1">members assigned</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "overview", label: "Overview", icon: FileText },
          { id: "tasks", label: "Tasks", icon: ListTodo },
          { id: "milestones", label: "Milestones", icon: Milestone },
          { id: "team", label: "Team", icon: Users },
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
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {projectData.description}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="space-y-3">
              {[
                { label: "Status", value: <StatusBadge status={projectData.status} variant={projectData.statusVariant} /> },
                { label: "Manager", value: projectData.manager },
                { label: "Start Date", value: projectData.startDate },
                { label: "End Date", value: projectData.endDate },
                { label: "Budget", value: `$${projectData.budget.toLocaleString()}` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Budget Tracking</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">
                    ${projectData.spent.toLocaleString()} / $
                    {projectData.budget.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      budgetPercentage > 90 ? "bg-danger" : budgetPercentage > 70 ? "bg-warning" : "bg-success"
                    }`}
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="text-lg font-bold text-success">
                    ${(projectData.budget - projectData.spent).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground">Burn Rate</p>
                  <p className="text-lg font-bold">$12.5K/mo</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {projectData.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "To Do", count: projectData.tasks.todo, color: "text-muted-foreground" },
            { title: "In Progress", count: projectData.tasks.inProgress, color: "text-info" },
            { title: "Completed", count: projectData.tasks.completed, color: "text-success" },
          ].map((col) => (
            <div key={col.title} className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h4 className={`text-sm font-semibold ${col.color}`}>{col.title}</h4>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{col.count}</span>
              </div>
              <div className="p-3 space-y-2">
                {Array.from({ length: Math.min(col.count, 3) }).map((_, i) => (
                  <div key={i} className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                    <p className="text-sm font-medium">Sample task item {i + 1}</p>
                    <p className="text-xs text-muted-foreground mt-1">Assigned to team member</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === "milestones" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            {projectData.milestones.map((ms, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  ms.status === "Completed" ? "bg-success/10" : ms.status === "In Progress" ? "bg-info/10" : "bg-muted"
                }`}>
                  {ms.status === "Completed" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : ms.status === "In Progress" ? (
                    <Clock className="h-5 w-5 text-info" />
                  ) : (
                    <Target className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{ms.name}</p>
                  <p className="text-xs text-muted-foreground">Due: {ms.date}</p>
                </div>
                <StatusBadge status={ms.status} variant={ms.statusVariant} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectData.team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
