"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  GraduationCap,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Clock,
} from "lucide-react";

const trainingPrograms = [
  { id: 1, name: "React Advanced Patterns", type: "Technical", instructor: "Sarah Chen", startDate: "Jul 1, 2024", duration: "3 days", enrolled: 12, capacity: 15, status: "Upcoming", statusVariant: "info" as const },
  { id: 2, name: "Leadership Essentials", type: "Soft Skills", instructor: "External - MBA Corp", startDate: "Jul 8, 2024", duration: "5 days", enrolled: 8, capacity: 10, status: "Upcoming", statusVariant: "info" as const },
  { id: 3, name: "AWS Certification Prep", type: "Technical", instructor: "Alex Kim", startDate: "Jun 15, 2024", duration: "10 days", enrolled: 15, capacity: 15, status: "In Progress", statusVariant: "success" as const },
  { id: 4, name: "Effective Communication", type: "Soft Skills", instructor: "Rachel Martinez", startDate: "Jun 1, 2024", duration: "2 days", enrolled: 20, capacity: 25, status: "Completed", statusVariant: "muted" as const },
  { id: 5, name: "Data Privacy & Security", type: "Compliance", instructor: "External - SecureIT", startDate: "Jun 10, 2024", duration: "1 day", enrolled: 48, capacity: 50, status: "Completed", statusVariant: "muted" as const },
  { id: 6, name: "Agile Methodologies", type: "Process", instructor: "Mike Johnson", startDate: "Jul 15, 2024", duration: "2 days", enrolled: 6, capacity: 20, status: "Upcoming", statusVariant: "info" as const },
  { id: 7, name: "Diversity & Inclusion Workshop", type: "Compliance", instructor: "External - IncluOrg", startDate: "May 20, 2024", duration: "1 day", enrolled: 35, capacity: 40, status: "Completed", statusVariant: "muted" as const },
];

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = trainingPrograms.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Training Programs"
        description="Manage employee training and development programs."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Training" },
        ]}
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Program
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Programs</p>
          <p className="text-2xl font-bold mt-1">{trainingPrograms.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Upcoming</p>
          <p className="text-2xl font-bold mt-1 text-info">{trainingPrograms.filter((t) => t.status === "Upcoming").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-success">{trainingPrograms.filter((t) => t.status === "In Progress").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Enrolled</p>
          <p className="text-2xl font-bold mt-1">{trainingPrograms.reduce((acc, t) => acc + t.enrolled, 0)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search programs..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Program</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Instructor</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Start Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Duration</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Enrolled</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((program) => (
                <tr key={program.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><GraduationCap className="h-4 w-4 text-primary" /></div>
                      <span className="text-sm font-medium">{program.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><StatusBadge status={program.type} variant="primary" /></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{program.instructor}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{program.startDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{program.duration}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{program.enrolled}/{program.capacity}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={program.status} variant={program.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {trainingPrograms.length} programs</p>
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
