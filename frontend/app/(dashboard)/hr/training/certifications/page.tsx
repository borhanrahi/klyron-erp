"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Award,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

const certifications = [
  { id: 1, employee: "Sarah Chen", avatar: "SC", certification: "AWS Solutions Architect", issuer: "Amazon", issueDate: "Jan 15, 2024", expiryDate: "Jan 15, 2027", status: "Active", statusVariant: "success" as const },
  { id: 2, employee: "Alex Kim", avatar: "AK", certification: "AWS DevOps Engineer", issuer: "Amazon", issueDate: "Mar 20, 2023", expiryDate: "Mar 20, 2026", status: "Active", statusVariant: "success" as const },
  { id: 3, employee: "David Park", avatar: "DP", certification: "React Developer Certification", issuer: "Meta", issueDate: "Jun 1, 2024", expiryDate: "Jun 1, 2026", status: "Active", statusVariant: "success" as const },
  { id: 4, employee: "Mike Johnson", avatar: "MJ", certification: "Google Analytics Certified", issuer: "Google", issueDate: "Feb 10, 2023", expiryDate: "Feb 10, 2025", status: "Expiring Soon", statusVariant: "warning" as const },
  { id: 5, employee: "Emily Davis", avatar: "ED", certification: "PMP Certification", issuer: "PMI", issueDate: "Aug 5, 2022", expiryDate: "Aug 5, 2025", status: "Active", statusVariant: "success" as const },
  { id: 6, employee: "Rachel Martinez", avatar: "RM", certification: "SHRM-CP", issuer: "SHRM", issueDate: "Nov 12, 2023", expiryDate: "Nov 12, 2026", status: "Active", statusVariant: "success" as const },
  { id: 7, employee: "James Wilson", avatar: "JW", certification: "CFA Level 3", issuer: "CFA Institute", issueDate: "Jul 20, 2022", expiryDate: "Jul 20, 2024", status: "Expired", statusVariant: "danger" as const },
  { id: 8, employee: "Lisa Thompson", avatar: "LT", certification: "Google UX Design", issuer: "Google", issueDate: "Apr 15, 2024", expiryDate: "Apr 15, 2026", status: "Active", statusVariant: "success" as const },
];

export default function CertificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = certifications.filter((c) =>
    c.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Certifications"
        description="Track employee professional certifications and expiry dates."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Training", href: "/hr/training" },
          { label: "Certifications" },
        ]}
        icon={<Award className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Certification
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Certifications</p>
          <p className="text-2xl font-bold mt-1">{certifications.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Expiring Soon</p>
          <p className="text-2xl font-bold mt-1 text-warning">{certifications.filter((c) => c.status === "Expiring Soon").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold mt-1 text-danger">{certifications.filter((c) => c.status === "Expired").length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search certifications..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Certification</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Issuer</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Issue Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Expiry Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{cert.avatar}</div>
                      <span className="text-sm font-medium">{cert.employee}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{cert.certification}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{cert.issuer}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{cert.issueDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{cert.expiryDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={cert.status} variant={cert.statusVariant} /></td>
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
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {certifications.length} certifications</p>
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
