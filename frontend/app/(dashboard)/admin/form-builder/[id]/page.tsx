"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Layout,
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Eye,
  Plus,
  Type,
  Mail,
  Phone,
  FileText,
  CheckSquare,
  List,
  Calendar,
  Upload,
  BarChart3,
} from "lucide-react";

const formData = {
  id: "FORM-001",
  name: "Contact Us",
  status: "Active",
  statusVariant: "success" as const,
  submissions: 234,
  lastModified: "Mar 15, 2024",
  createdBy: "Sarah Chen",
  embedUrl: "https://klyron.com/forms/contact",
};

const formFields = [
  { id: 1, type: "text", label: "Full Name", required: true, submissions: 234 },
  { id: 2, type: "email", label: "Email Address", required: true, submissions: 234 },
  { id: 3, type: "phone", label: "Phone Number", required: false, submissions: 189 },
  { id: 4, type: "select", label: "Subject", required: true, submissions: 234, options: ["General Inquiry", "Support", "Sales", "Partnership"] },
  { id: 5, type: "textarea", label: "Message", required: true, submissions: 234 },
  { id: 6, type: "checkbox", label: "Subscribe to Newsletter", required: false, submissions: 156 },
];

const recentSubmissions = [
  { name: "James Wilson", email: "james@techcorp.com", date: "Apr 2, 2024", subject: "Sales" },
  { name: "Maria Garcia", email: "maria@startup.com", date: "Apr 1, 2024", subject: "Support" },
  { name: "David Kim", email: "david@global.com", date: "Mar 31, 2024", subject: "General Inquiry" },
  { name: "Sarah Brown", email: "sarah@retail.com", date: "Mar 30, 2024", subject: "Partnership" },
];

export default function FormDetailPage() {
  const [activeTab, setActiveTab] = useState("fields");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={formData.name}
        description={`Created by ${formData.createdBy} · ${formData.submissions} submissions`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Form Builder", href: "/admin/form-builder" },
          { label: formData.name },
        ]}
        icon={<Layout className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/admin/form-builder"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Form
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "fields", label: "Fields", icon: Type },
          { id: "submissions", label: "Submissions", icon: BarChart3 },
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

      {/* Fields Tab */}
      {activeTab === "fields" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">#</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Field Label</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Required</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Responses</th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {formFields.map((field, i) => (
                      <tr key={field.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3 px-4 text-sm text-muted-foreground">{i + 1}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium">{field.label}</span>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <StatusBadge status={field.type} variant="muted" />
                        </td>
                        <td className="py-3 px-4">
                          {field.required ? (
                            <span className="text-xs text-success font-medium">Required</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Optional</span>
                          )}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">{field.submissions}</span>
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
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Form Info</h3>
              <div className="space-y-3">
                {[
                  { label: "Form ID", value: formData.id },
                  { label: "Status", value: formData.status },
                  { label: "Total Fields", value: formFields.length.toString() },
                  { label: "Last Modified", value: formData.lastModified },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Embed Code</h3>
              <code className="block p-3 bg-muted rounded-lg text-xs text-muted-foreground break-all">
                {`<iframe src="${formData.embedUrl}" width="100%" height="600"></iframe>`}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === "submissions" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Name</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Subject</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Date</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentSubmissions.map((sub, i) => (
                  <tr key={i} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">{sub.name}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{sub.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={sub.subject} variant="muted" />
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{sub.date}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
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
