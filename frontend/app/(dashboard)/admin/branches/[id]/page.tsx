"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Building2,
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  Users,
  User,
  Calendar,
  Clock,
} from "lucide-react";

const branchData = {
  id: "BR-001",
  name: "Headquarters",
  code: "HQ",
  address: "123 Innovation Drive, San Francisco, CA 94105",
  phone: "+1 (555) 100-2000",
  email: "hq@klyron.com",
  manager: "Sarah Chen",
  employees: 145,
  status: "Active",
  statusVariant: "success" as const,
  timezone: "America/Los_Angeles",
  createdAt: "Jan 1, 2021",
};

const recentEmployees = [
  { name: "James Wilson", role: "Senior Developer", joined: "Mar 2024" },
  { name: "Maria Garcia", role: "Product Manager", joined: "Feb 2024" },
  { name: "David Kim", role: "UX Designer", joined: "Jan 2024" },
  { name: "Emily Chen", role: "DevOps Engineer", joined: "Dec 2023" },
  { name: "Robert Taylor", role: "QA Lead", joined: "Nov 2023" },
];

export default function BranchDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={branchData.name}
        description={`${branchData.code} · ${branchData.address}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Branches", href: "/admin/branches" },
          { label: branchData.name },
        ]}
        icon={<Building2 className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/admin/branches"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Branch
            </button>
          </div>
        }
      />

      {/* Branch Info Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{branchData.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{branchData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{branchData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Manager: {branchData.manager}</span>
            </div>
          </div>
          <StatusBadge status={branchData.status} variant={branchData.statusVariant} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "employees", label: "Employees", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Branch Details</h3>
            <div className="space-y-4">
              {[
                { label: "Branch ID", value: branchData.id },
                { label: "Branch Code", value: branchData.code },
                { label: "Branch Name", value: branchData.name },
                { label: "Manager", value: branchData.manager },
                { label: "Total Employees", value: branchData.employees.toString() },
                { label: "Timezone", value: branchData.timezone },
                { label: "Created", value: branchData.createdAt },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              {[
                { label: "Phone", value: branchData.phone },
                { label: "Email", value: branchData.email },
                { label: "Address", value: branchData.address },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === "employees" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Role</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentEmployees.map((emp, i) => (
                  <tr key={i} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {emp.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{emp.role}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{emp.joined}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
