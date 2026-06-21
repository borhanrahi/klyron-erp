"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

const inquiries = [
  {
    id: "INQ-001",
    name: "James Wilson",
    email: "james.wilson@techcorp.com",
    phone: "+1 (555) 123-4567",
    subject: "Enterprise Plan Pricing",
    source: "Web Form",
    date: "Apr 2, 2024",
    status: "New",
    statusVariant: "info" as const,
    priority: "High",
  },
  {
    id: "INQ-002",
    name: "Maria Garcia",
    email: "maria.garcia@startupinc.com",
    phone: "+1 (555) 234-5678",
    subject: "Product Demo Request",
    source: "Contact Form",
    date: "Apr 1, 2024",
    status: "In Progress",
    statusVariant: "warning" as const,
    priority: "Medium",
  },
  {
    id: "INQ-003",
    name: "David Kim",
    email: "david.kim@globalco.com",
    phone: "+1 (555) 345-6789",
    subject: "Integration Inquiry",
    source: "Email",
    date: "Mar 31, 2024",
    status: "Replied",
    statusVariant: "success" as const,
    priority: "Low",
  },
  {
    id: "INQ-004",
    name: "Sarah Brown",
    email: "sarah.brown@retailmax.com",
    phone: "+1 (555) 456-7890",
    subject: "Custom Development Request",
    source: "Web Form",
    date: "Mar 30, 2024",
    status: "New",
    statusVariant: "info" as const,
    priority: "High",
  },
  {
    id: "INQ-005",
    name: "Robert Taylor",
    email: "robert.taylor@logistics.com",
    phone: "+1 (555) 567-8901",
    subject: "Partnership Opportunity",
    source: "Referral",
    date: "Mar 29, 2024",
    status: "Closed",
    statusVariant: "muted" as const,
    priority: "Medium",
  },
  {
    id: "INQ-006",
    name: "Emily Chen",
    email: "emily.chen@designstudio.com",
    phone: "+1 (555) 678-9012",
    subject: "API Documentation Access",
    source: "Web Form",
    date: "Mar 28, 2024",
    status: "In Progress",
    statusVariant: "warning" as const,
    priority: "Low",
  },
  {
    id: "INQ-007",
    name: "Michael Lee",
    email: "michael.lee@financegroup.com",
    phone: "+1 (555) 789-0123",
    subject: "Bulk Order Inquiry",
    source: "Contact Form",
    date: "Mar 27, 2024",
    status: "New",
    statusVariant: "info" as const,
    priority: "High",
  },
];

const inquiryStats = [
  { label: "Total Inquiries", value: "156", change: "+12 this week" },
  { label: "New", value: "23", change: "Needs attention" },
  { label: "In Progress", value: "18", change: "Assigned to team" },
  { label: "Closed This Month", value: "47", change: "+18% vs last month" },
];

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || inquiry.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
                        {inquiry.name.split(" ").map((n) => n[0]).join("")}
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
                    <span className="text-sm text-muted-foreground">{inquiry.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={inquiry.status} variant={inquiry.statusVariant} />
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
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">2</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
