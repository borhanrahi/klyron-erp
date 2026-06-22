"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Award,
  Search,
  Plus,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";

const appraisals = [
  { id: 1, employee: "Sarah Chen", avatar: "SC", department: "Engineering", period: "H1 2024", currentSalary: "$85,000", proposedSalary: "$95,000", increase: "11.8%", rating: "Exceeds", reviewer: "Emily Davis", status: "Approved", statusVariant: "success" as const },
  { id: 2, employee: "Mike Johnson", avatar: "MJ", department: "Marketing", period: "H1 2024", currentSalary: "$72,000", proposedSalary: "$78,000", increase: "8.3%", rating: "Meets", reviewer: "Rachel Martinez", status: "Approved", statusVariant: "success" as const },
  { id: 3, employee: "Emily Davis", avatar: "ED", department: "Product", period: "H1 2024", currentSalary: "$98,000", proposedSalary: "$108,000", increase: "10.2%", rating: "Exceeds", reviewer: "James Wilson", status: "Pending Approval", statusVariant: "warning" as const },
  { id: 4, employee: "David Park", avatar: "DP", department: "Engineering", period: "H1 2024", currentSalary: "$78,000", proposedSalary: "$84,000", increase: "7.7%", rating: "Meets", reviewer: "Sarah Chen", status: "In Review", statusVariant: "info" as const },
  { id: 5, employee: "Alex Kim", avatar: "AK", department: "DevOps", period: "H1 2024", currentSalary: "$82,000", proposedSalary: "$82,000", increase: "0%", rating: "Needs Improvement", reviewer: "Sarah Chen", status: "Draft", statusVariant: "muted" as const },
  { id: 6, employee: "Rachel Martinez", avatar: "RM", department: "HR", period: "H1 2024", currentSalary: "$68,000", proposedSalary: "$74,000", increase: "8.8%", rating: "Exceeds", reviewer: "James Wilson", status: "Approved", statusVariant: "success" as const },
];

export default function AppraisalsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = appraisals.filter((a) =>
    a.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Appraisals"
        description="Manage salary appraisals and promotions."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Performance", href: "/hr/performance" },
          { label: "Appraisals" },
        ]}
        icon={<Award className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Appraisal Cycle
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Appraisals</p>
          <p className="text-2xl font-bold mt-1">{appraisals.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold mt-1 text-success">{appraisals.filter((a) => a.status === "Approved").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Avg. Increase</p>
          <p className="text-2xl font-bold mt-1">8.2%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Budget Used</p>
          <p className="text-2xl font-bold mt-1">$124K</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search appraisals..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Period</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Current Salary</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Proposed</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Increase</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Rating</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((appraisal) => (
                <tr key={appraisal.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{appraisal.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{appraisal.employee}</p>
                        <p className="text-xs text-muted-foreground">{appraisal.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{appraisal.period}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{appraisal.currentSalary}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm font-medium text-success">{appraisal.proposedSalary}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm font-medium ${appraisal.increase === "0%" ? "text-danger" : "text-success"}`}>{appraisal.increase}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell"><StatusBadge status={appraisal.rating} variant={appraisal.rating === "Exceeds" ? "success" : appraisal.rating === "Meets" ? "info" : "warning"} /></td>
                  <td className="py-3 px-4"><StatusBadge status={appraisal.status} variant={appraisal.statusVariant} /></td>
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
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {appraisals.length} appraisals</p>
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
