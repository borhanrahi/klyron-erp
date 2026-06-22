"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Briefcase,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

const designations = [
  { id: 1, name: "Junior Developer", department: "Engineering", level: "Entry", minSalary: "$55,000", maxSalary: "$75,000", employees: 8, status: "Active", statusVariant: "success" as const },
  { id: 2, name: "Mid-Level Developer", department: "Engineering", level: "Mid", minSalary: "$75,000", maxSalary: "$100,000", employees: 12, status: "Active", statusVariant: "success" as const },
  { id: 3, name: "Senior Developer", department: "Engineering", level: "Senior", minSalary: "$100,000", maxSalary: "$140,000", employees: 10, status: "Active", statusVariant: "success" as const },
  { id: 4, name: "Lead Developer", department: "Engineering", level: "Lead", minSalary: "$130,000", maxSalary: "$170,000", employees: 4, status: "Active", statusVariant: "success" as const },
  { id: 5, name: "Marketing Manager", department: "Marketing", level: "Manager", minSalary: "$90,000", maxSalary: "$120,000", employees: 2, status: "Active", statusVariant: "success" as const },
  { id: 6, name: "Marketing Specialist", department: "Marketing", level: "Mid", minSalary: "$55,000", maxSalary: "$80,000", employees: 8, status: "Active", statusVariant: "success" as const },
  { id: 7, name: "Product Manager", department: "Product", level: "Manager", minSalary: "$100,000", maxSalary: "$140,000", employees: 3, status: "Active", statusVariant: "success" as const },
  { id: 8, name: "UI/UX Designer", department: "Design", level: "Mid", minSalary: "$65,000", maxSalary: "$95,000", employees: 6, status: "Active", statusVariant: "success" as const },
  { id: 9, name: "HR Specialist", department: "HR", level: "Mid", minSalary: "$55,000", maxSalary: "$80,000", employees: 4, status: "Active", statusVariant: "success" as const },
  { id: 10, name: "Financial Analyst", department: "Finance", level: "Mid", minSalary: "$65,000", maxSalary: "$90,000", employees: 5, status: "Active", statusVariant: "success" as const },
  { id: 11, name: "Sales Executive", department: "Sales", level: "Mid", minSalary: "$50,000", maxSalary: "$80,000", employees: 10, status: "Active", statusVariant: "success" as const },
  { id: 12, name: "DevOps Engineer", department: "DevOps", level: "Senior", minSalary: "$95,000", maxSalary: "$130,000", employees: 6, status: "Active", statusVariant: "success" as const },
];

export default function DesignationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = designations.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Designations"
        description="Manage job titles, levels, and salary ranges."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Organization" },
          { label: "Designations" },
        ]}
        icon={<Briefcase className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Designation
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search designations..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Designation <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Level</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Salary Range</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employees</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((des) => (
                <tr key={des.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{des.name}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{des.department}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{des.level}</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">{des.minSalary} - {des.maxSalary}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{des.employees}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={des.status} variant={des.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {designations.length} designations</p>
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
