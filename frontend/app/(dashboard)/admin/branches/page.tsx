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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  User,
} from "lucide-react";

const branches = [
  { id: "BR-001", name: "Headquarters", code: "HQ", address: "123 Innovation Dr, San Francisco, CA", manager: "Sarah Chen", employees: 145, status: "Active", statusVariant: "success" as const },
  { id: "BR-002", name: "East Coast Office", code: "ECO", address: "456 Broadway, New York, NY", manager: "Mike Johnson", employees: 89, status: "Active", statusVariant: "success" as const },
  { id: "BR-003", name: "European Hub", code: "EUH", address: "789 Oxford St, London, UK", manager: "Emma Wilson", employees: 67, status: "Active", statusVariant: "success" as const },
  { id: "BR-004", name: "Asia Pacific", code: "APAC", address: "321 Marina Bay, Singapore", manager: "David Kim", employees: 52, status: "Active", statusVariant: "success" as const },
  { id: "BR-005", name: "Remote Office", code: "REM", address: "Distributed / Remote", manager: "Alex Rivera", employees: 34, status: "Active", statusVariant: "success" as const },
];

const branchStats = [
  { label: "Total Branches", value: "5", change: "Across 4 countries" },
  { label: "Total Employees", value: "387", change: "+12 this month" },
  { label: "Active Locations", value: "5", change: "All operational" },
  { label: "Avg. per Branch", value: "77", change: "Employees" },
];

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Branches"
        description="Manage your company locations and office branches."
        icon={<Building2 className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Branches" },
        ]}
        actions={
          <a
            href="/admin/branches/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {branchStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search branches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Branches Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Branch
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Code
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Address
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Manager
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Employees
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
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{branch.name}</p>
                        <p className="text-xs text-muted-foreground">{branch.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm font-mono text-muted-foreground">{branch.code}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{branch.address}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{branch.manager}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{branch.employees}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={branch.status} variant={branch.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/admin/branches/${branch.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
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
      </div>
    </div>
  );
}
