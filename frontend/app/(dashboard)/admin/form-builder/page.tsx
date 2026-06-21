"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Layout,
} from "lucide-react";

const forms = [
  { id: "FORM-001", name: "Contact Us", fields: 6, submissions: 234, status: "Active", statusVariant: "success" as const, lastModified: "Mar 15, 2024" },
  { id: "FORM-002", name: "Demo Request", fields: 8, submissions: 156, status: "Active", statusVariant: "success" as const, lastModified: "Mar 10, 2024" },
  { id: "FORM-003", name: "Feedback Survey", fields: 12, submissions: 89, status: "Active", statusVariant: "success" as const, lastModified: "Feb 28, 2024" },
  { id: "FORM-004", name: "Job Application", fields: 15, submissions: 67, status: "Draft", statusVariant: "warning" as const, lastModified: "Feb 20, 2024" },
  { id: "FORM-005", name: "Newsletter Signup", fields: 3, submissions: 1205, status: "Active", statusVariant: "success" as const, lastModified: "Jan 15, 2024" },
  { id: "FORM-006", name: "Bug Report", fields: 7, submissions: 45, status: "Inactive", statusVariant: "muted" as const, lastModified: "Jan 10, 2024" },
];

const formStats = [
  { label: "Total Forms", value: "6", change: "3 active" },
  { label: "Total Submissions", value: "1,796", change: "+124 this month" },
  { label: "Avg. Fields", value: "8.5", change: "Per form" },
  { label: "Conversion Rate", value: "34.2%", change: "+2.1% vs last month" },
];

export default function FormBuilderPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredForms = forms.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Form Builder"
        description="Create and manage custom forms for data collection."
        icon={<Layout className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Form Builder" },
        ]}
        actions={
          <a
            href="/admin/form-builder/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Form
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {formStats.map((stat) => (
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
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <div key={form.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <StatusBadge status={form.status} variant={form.statusVariant} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{form.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{form.fields} fields</span>
              <span>{form.submissions} submissions</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Last modified: {form.lastModified}</p>
            <div className="flex items-center gap-2">
              <a
                href={`/admin/form-builder/${form.id}`}
                className="flex-1 border border-border bg-muted text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-muted/80 flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View
              </a>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
