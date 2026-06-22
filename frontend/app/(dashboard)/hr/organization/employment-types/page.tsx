"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const employmentTypes = [
  { id: 1, name: "Full-Time", employees: 98, description: "Permanent full-time positions with benefits", probation: "3 months", benefits: "Full Benefits", status: "Active", statusVariant: "success" as const },
  { id: 2, name: "Part-Time", employees: 12, description: "Part-time positions with limited benefits", probation: "1 month", benefits: "Partial Benefits", status: "Active", statusVariant: "success" as const },
  { id: 3, name: "Contract", employees: 18, description: "Fixed-term contract positions", probation: "N/A", benefits: "No Benefits", status: "Active", statusVariant: "success" as const },
  { id: 4, name: "Intern", employees: 8, description: "Internship positions for students", probation: "N/A", benefits: "Stipend Only", status: "Active", statusVariant: "success" as const },
  { id: 5, name: "Consultant", employees: 6, description: "External consultant arrangements", probation: "N/A", benefits: "No Benefits", status: "Active", statusVariant: "success" as const },
  { id: 6, name: "Temporary", employees: 6, description: "Temporary positions for seasonal needs", probation: "N/A", benefits: "Limited Benefits", status: "Inactive", statusVariant: "muted" as const },
];

export default function EmploymentTypesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = employmentTypes.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Employment Types"
        description="Manage employment categories and their policies."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Organization" },
          { label: "Employment Types" },
        ]}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Type
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employment types..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Description</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Probation</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Benefits</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employees</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((type) => (
                <tr key={type.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{type.name}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{type.description}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{type.probation}</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">{type.benefits}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{type.employees}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={type.status} variant={type.statusVariant} />
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
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {employmentTypes.length} types</p>
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
