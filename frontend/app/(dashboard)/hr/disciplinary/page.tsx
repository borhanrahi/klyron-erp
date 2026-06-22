"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  AlertTriangle,
  Search,
  Plus,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

const incidents = [
  { id: 1, employee: "Alex Kim", avatar: "AK", department: "DevOps", type: "Verbal Warning", category: "Attendance", description: "Repeated late arrivals", incidentDate: "Jun 15, 2024", issuedBy: "Sarah Chen", status: "Active", statusVariant: "warning" as const },
  { id: 2, employee: "David Park", avatar: "DP", department: "Engineering", type: "Written Warning", category: "Performance", description: "Missed project deadline", incidentDate: "May 28, 2024", issuedBy: "Sarah Chen", status: "Active", statusVariant: "warning" as const },
  { id: 3, employee: "Lisa Thompson", avatar: "LT", department: "Design", type: "Verbal Warning", category: "Conduct", description: "Unprofessional communication", incidentDate: "Jun 10, 2024", issuedBy: "Emily Davis", status: "Resolved", statusVariant: "success" as const },
  { id: 4, employee: "Omar Hassan", avatar: "OH", department: "Engineering", type: "Final Warning", category: "Attendance", description: "Excessive absenteeism", incidentDate: "Apr 15, 2024", issuedBy: "Sarah Chen", status: "Active", statusVariant: "danger" as const },
  { id: 5, employee: "Priya Patel", avatar: "PP", department: "Sales", type: "Written Warning", category: "Performance", description: "Below target for Q1", incidentDate: "Mar 30, 2024", issuedBy: "Mike Johnson", status: "Resolved", statusVariant: "success" as const },
];

export default function DisciplinaryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = incidents.filter((i) =>
    i.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Disciplinary Incidents"
        description="Track and manage employee disciplinary actions."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Disciplinary" },
        ]}
        icon={<AlertTriangle className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Report Incident
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Cases</p>
          <p className="text-2xl font-bold mt-1 text-warning">{incidents.filter((i) => i.status === "Active").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold mt-1 text-success">{incidents.filter((i) => i.status === "Resolved").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Final Warnings</p>
          <p className="text-2xl font-bold mt-1 text-danger">{incidents.filter((i) => i.type === "Final Warning").length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Category</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Description</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Issued By</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((incident) => (
                <tr key={incident.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{incident.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{incident.employee}</p>
                        <p className="text-xs text-muted-foreground">{incident.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <StatusBadge
                      status={incident.type}
                      variant={incident.type === "Final Warning" ? "danger" : incident.type === "Written Warning" ? "warning" : "info"}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{incident.category}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{incident.description}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{incident.incidentDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell"><span className="text-sm text-muted-foreground">{incident.issuedBy}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={incident.status} variant={incident.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {incidents.length} incidents</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
