"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const salaryStructures = [
  { id: 1, name: "Engineering - Junior", department: "Engineering", level: "Junior", baseMin: "$55,000", baseMax: "$75,000", allowances: "$5,000", deductions: "22%", employees: 8, status: "Active", statusVariant: "success" as const },
  { id: 2, name: "Engineering - Mid", department: "Engineering", level: "Mid", baseMin: "$75,000", baseMax: "$100,000", allowances: "$8,000", deductions: "22%", employees: 12, status: "Active", statusVariant: "success" as const },
  { id: 3, name: "Engineering - Senior", department: "Engineering", level: "Senior", baseMin: "$100,000", baseMax: "$140,000", allowances: "$12,000", deductions: "25%", employees: 10, status: "Active", statusVariant: "success" as const },
  { id: 4, name: "Marketing - Specialist", department: "Marketing", level: "Mid", baseMin: "$55,000", baseMax: "$80,000", allowances: "$6,000", deductions: "22%", employees: 8, status: "Active", statusVariant: "success" as const },
  { id: 5, name: "Marketing - Manager", department: "Marketing", level: "Manager", baseMin: "$90,000", baseMax: "$120,000", allowances: "$10,000", deductions: "25%", employees: 2, status: "Active", statusVariant: "success" as const },
  { id: 6, name: "Product - Manager", department: "Product", level: "Manager", baseMin: "$100,000", baseMax: "$140,000", allowances: "$12,000", deductions: "25%", employees: 3, status: "Active", statusVariant: "success" as const },
  { id: 7, name: "Sales - Executive", department: "Sales", level: "Mid", baseMin: "$50,000", baseMax: "$80,000", allowances: "$10,000", deductions: "20%", employees: 10, status: "Active", statusVariant: "success" as const },
  { id: 8, name: "Executive", department: "All", level: "Executive", baseMin: "$150,000", baseMax: "$250,000", allowances: "$25,000", deductions: "30%", employees: 4, status: "Active", statusVariant: "success" as const },
];

export default function SalaryStructuresPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = salaryStructures.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Salary Structures"
        description="Define salary ranges, allowances, and deduction templates."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Salary Structures" },
        ]}
        icon={<Layers className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Structure
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search salary structures..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Structure</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Base Range</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Allowances</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Deductions</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employees</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.level}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{s.department}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{s.baseMin} - {s.baseMax}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-success">{s.allowances}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell"><span className="text-sm text-danger">{s.deductions}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" /><span className="text-sm font-medium">{s.employees}</span></div>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={s.status} variant={s.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
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
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {salaryStructures.length} structures</p>
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
