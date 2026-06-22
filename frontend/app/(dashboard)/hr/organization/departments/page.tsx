"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Building2,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Users,
} from "lucide-react";

const departments = [
  { id: 1, name: "Engineering", head: "Sarah Chen", headAvatar: "SC", employees: 42, budget: "$2.4M", status: "Active", statusVariant: "success" as const },
  { id: 2, name: "Marketing", head: "Mike Johnson", headAvatar: "MJ", employees: 18, budget: "$890K", status: "Active", statusVariant: "success" as const },
  { id: 3, name: "Product", head: "Emily Davis", headAvatar: "ED", employees: 14, budget: "$1.1M", status: "Active", statusVariant: "success" as const },
  { id: 4, name: "Design", head: "Lisa Thompson", headAvatar: "LT", employees: 12, budget: "$720K", status: "Active", statusVariant: "success" as const },
  { id: 5, name: "HR", head: "Rachel Martinez", headAvatar: "RM", employees: 8, budget: "$450K", status: "Active", statusVariant: "success" as const },
  { id: 6, name: "Finance", head: "James Wilson", headAvatar: "JW", employees: 16, budget: "$980K", status: "Active", statusVariant: "success" as const },
  { id: 7, name: "Sales", head: "Priya Patel", headAvatar: "PP", employees: 22, budget: "$1.3M", status: "Active", statusVariant: "success" as const },
  { id: 8, name: "DevOps", head: "Alex Kim", headAvatar: "AK", employees: 8, budget: "$620K", status: "Active", statusVariant: "success" as const },
  { id: 9, name: "Legal", head: "TBD", headAvatar: "TBD", employees: 4, budget: "$380K", status: "Inactive", statusVariant: "muted" as const },
  { id: 10, name: "Customer Support", head: "TBD", headAvatar: "TBD", employees: 0, budget: "$0", status: "Inactive", statusVariant: "muted" as const },
];

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Departments"
        description="Manage organizational departments and their heads."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Organization" },
          { label: "Departments" },
        ]}
        icon={<Building2 className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search departments..."
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
                    Department <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Head</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employees</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Budget</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((dept) => (
                <tr key={dept.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{dept.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                        {dept.headAvatar}
                      </div>
                      <span className="text-sm text-muted-foreground">{dept.head}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{dept.employees}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{dept.budget}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={dept.status} variant={dept.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
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
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {departments.length} departments</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
