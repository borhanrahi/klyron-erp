"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FolderKanban,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
} from "lucide-react";

const projects = [
  {
    id: "PRJ-001",
    name: "E-Commerce Platform Redesign",
    manager: "Sarah Chen",
    managerAvatar: "SC",
    budget: 125000,
    spent: 87500,
    progress: 70,
    status: "In Progress",
    statusVariant: "info" as const,
    startDate: "Jan 15, 2024",
    endDate: "Jul 30, 2024",
    team: 8,
  },
  {
    id: "PRJ-002",
    name: "Mobile App v2.0",
    manager: "Mike Johnson",
    managerAvatar: "MJ",
    budget: 200000,
    spent: 142000,
    progress: 55,
    status: "In Progress",
    statusVariant: "info" as const,
    startDate: "Feb 1, 2024",
    endDate: "Sep 15, 2024",
    team: 12,
  },
  {
    id: "PRJ-003",
    name: "ERP Integration Module",
    manager: "Emily Davis",
    managerAvatar: "ED",
    budget: 85000,
    spent: 85000,
    progress: 100,
    status: "Completed",
    statusVariant: "success" as const,
    startDate: "Nov 1, 2023",
    endDate: "Apr 30, 2024",
    team: 6,
  },
  {
    id: "PRJ-004",
    name: "Data Analytics Dashboard",
    manager: "David Park",
    managerAvatar: "DP",
    budget: 95000,
    spent: 32000,
    progress: 35,
    status: "In Progress",
    statusVariant: "info" as const,
    startDate: "Mar 10, 2024",
    endDate: "Oct 15, 2024",
    team: 5,
  },
  {
    id: "PRJ-005",
    name: "Customer Portal Upgrade",
    manager: "Rachel Martinez",
    managerAvatar: "RM",
    budget: 60000,
    spent: 15000,
    progress: 10,
    status: "Planning",
    statusVariant: "warning" as const,
    startDate: "May 1, 2024",
    endDate: "Dec 31, 2024",
    team: 4,
  },
  {
    id: "PRJ-006",
    name: "Legacy System Migration",
    manager: "Sarah Chen",
    managerAvatar: "SC",
    budget: 350000,
    spent: 280000,
    progress: 82,
    status: "In Progress",
    statusVariant: "info" as const,
    startDate: "Jun 15, 2023",
    endDate: "Aug 30, 2024",
    team: 15,
  },
  {
    id: "PRJ-007",
    name: "CI/CD Pipeline Setup",
    manager: "Alex Kim",
    managerAvatar: "AK",
    budget: 25000,
    spent: 25000,
    progress: 100,
    status: "Completed",
    statusVariant: "success" as const,
    startDate: "Jan 5, 2024",
    endDate: "Mar 15, 2024",
    team: 3,
  },
  {
    id: "PRJ-008",
    name: "AI Chatbot Implementation",
    manager: "Mike Johnson",
    managerAvatar: "MJ",
    budget: 150000,
    spent: 0,
    progress: 0,
    status: "On Hold",
    statusVariant: "muted" as const,
    startDate: "TBD",
    endDate: "TBD",
    team: 0,
  },
];

const projectStats = [
  { label: "Total Projects", value: "8", change: "+2 this quarter" },
  { label: "In Progress", value: "4", change: "50% active" },
  { label: "Completed", value: "2", change: "25% completion" },
  { label: "Total Budget", value: "$1.09M", change: "$886.5K spent" },
];

export default function ProjectsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Projects"
        description="Manage and track all your projects."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Projects" },
        ]}
        icon={<FolderKanban className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/projects/projects/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="All">Status: All</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Project
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Manager
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Budget
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Progress
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Dates
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.id} · {project.team} members
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                        {project.managerAvatar}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {project.manager}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div>
                      <p className="text-sm font-medium">
                        ${project.budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Spent: ${project.spent.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            project.progress === 100
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {project.startDate} - {project.endDate}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={project.status}
                      variant={project.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/projects/projects/${project.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
