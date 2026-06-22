"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Heart,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
} from "lucide-react";

const benefits = [
  { id: 1, name: "Health Insurance", type: "Insurance", provider: "Blue Cross", premium: "$450/mo", coverage: "Employee + Family", enrolled: 98, status: "Active", statusVariant: "success" as const },
  { id: 2, name: "Dental Insurance", type: "Insurance", provider: "Delta Dental", premium: "$85/mo", coverage: "Employee + Family", enrolled: 76, status: "Active", statusVariant: "success" as const },
  { id: 3, name: "Vision Insurance", type: "Insurance", provider: "VSP", premium: "$35/mo", coverage: "Employee Only", enrolled: 64, status: "Active", statusVariant: "success" as const },
  { id: 4, name: "401(k) Match", type: "Retirement", provider: "Fidelity", premium: "5% match", coverage: "All Employees", enrolled: 112, status: "Active", statusVariant: "success" as const },
  { id: 5, name: "Life Insurance", type: "Insurance", provider: "MetLife", premium: "$25/mo", coverage: "2x Annual Salary", enrolled: 98, status: "Active", statusVariant: "success" as const },
  { id: 6, name: "Gym Membership", type: "Wellness", provider: "Fitness First", premium: "$50/mo", coverage: "Employee Only", enrolled: 42, status: "Active", statusVariant: "success" as const },
  { id: 7, name: "Learning Budget", type: "Development", provider: "Internal", premium: "$2,000/yr", coverage: "Per Employee", enrolled: 56, status: "Active", statusVariant: "success" as const },
  { id: 8, name: "Remote Work Stipend", type: "Remote", provider: "Internal", premium: "$150/mo", coverage: "Remote Employees", enrolled: 32, status: "Active", statusVariant: "success" as const },
];

export default function BenefitsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = benefits.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Benefits Management"
        description="Manage employee benefits programs and enrollments."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Benefits" },
        ]}
        icon={<Heart className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Benefit
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Active Programs</p><p className="text-2xl font-bold">{benefits.length}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10"><Users className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Total Enrollments</p><p className="text-2xl font-bold">678</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/10"><Heart className="h-5 w-5 text-accent" /></div>
            <div><p className="text-sm text-muted-foreground">Monthly Cost</p><p className="text-2xl font-bold">$186K</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search benefits..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Benefit</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Provider</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Premium</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Coverage</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Enrolled</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((benefit) => (
                <tr key={benefit.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><Heart className="h-4 w-4 text-primary" /></div>
                      <span className="text-sm font-medium">{benefit.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><StatusBadge status={benefit.type} variant="primary" /></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{benefit.provider}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm font-medium">{benefit.premium}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell"><span className="text-sm text-muted-foreground">{benefit.coverage}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" /><span className="text-sm font-medium">{benefit.enrolled}</span></div>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={benefit.status} variant={benefit.statusVariant} /></td>
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
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {benefits.length} benefits</p>
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
