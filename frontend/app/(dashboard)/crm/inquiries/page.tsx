"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  MessageSquare,
  Search,
  Download,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";

interface InquiryItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  source: string;
  status: string;
  priority: string;
  created_at: string;
  statusVariant: "info" | "warning" | "success" | "muted" | "danger";
  priorityVariant: "danger" | "warning" | "info" | "muted";
}

const statusVariantMap: Record<string, InquiryItem["statusVariant"]> = {
  new: "info",
  "in_progress": "warning",
  replied: "success",
  closed: "muted",
  open: "danger",
};

const priorityVariantMap: Record<string, InquiryItem["priorityVariant"]> = {
  high: "danger",
  medium: "warning",
  low: "muted",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function capitalize(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ items: InquiryItem[] }>("/sales/inquiries")
      .then((res) =>
        setInquiries(
          res.items.map((item) => ({
            ...item,
            statusVariant: statusVariantMap[item.status] || "info",
            priorityVariant: priorityVariantMap[item.priority] || "info",
          }))
        )
      )
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  }, []);

  const inquiryStats = [
    { label: "Total Inquiries", value: String(inquiries.length), change: "All time" },
    { label: "New", value: String(inquiries.filter((i) => i.status === "new").length), change: "Needs attention" },
    { label: "In Progress", value: String(inquiries.filter((i) => i.status === "in_progress").length), change: "Assigned to team" },
    { label: "Closed", value: String(inquiries.filter((i) => i.status === "closed").length), change: "Resolved" },
  ];

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || capitalize(inquiry.status) === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Customer Inquiries"
        description="Manage incoming customer inquiries from web forms and contact submissions."
        icon={<MessageSquare className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Inquiries" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inquiryStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Replied">Replied</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Customer
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Subject
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Source
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Date
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
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {getInitials(inquiry.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{inquiry.name}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{inquiry.subject}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <StatusBadge status={inquiry.source} variant="muted" />
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">{formatDate(inquiry.created_at)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={capitalize(inquiry.status)} variant={inquiry.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/crm/inquiries/${inquiry.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </p>
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
