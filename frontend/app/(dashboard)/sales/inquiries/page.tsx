"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  HelpCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Clock,
} from "lucide-react";
import Link from "next/link";

const inquiries = [
  {
    id: "INQ-001",
    name: "Michael Chen",
    email: "michael.chen@startup.io",
    phone: "+1 (555) 111-2233",
    company: "Startup Ventures",
    subject: "Enterprise Plan Pricing",
    message: "Looking for pricing details for 500+ user enterprise plan.",
    source: "Website Form",
    status: "New",
    statusVariant: "info" as const,
    date: "Mar 24, 2024",
    priority: "High",
  },
  {
    id: "INQ-002",
    name: "Emma Wilson",
    email: "emma.w@globalcorp.com",
    phone: "+1 (555) 222-3344",
    company: "Global Corp",
    subject: "API Integration Support",
    message: "Need help with REST API integration for our CRM system.",
    source: "Support Portal",
    status: "In Progress",
    statusVariant: "warning" as const,
    date: "Mar 23, 2024",
    priority: "Medium",
  },
  {
    id: "INQ-003",
    name: "David Park",
    email: "david.park@techlabs.com",
    phone: "+1 (555) 333-4455",
    company: "TechLabs",
    subject: "Custom Development Request",
    message: "We need a custom module for inventory management.",
    source: "Email",
    status: "Qualified",
    statusVariant: "success" as const,
    date: "Mar 22, 2024",
    priority: "High",
  },
  {
    id: "INQ-004",
    name: "Lisa Anderson",
    email: "lisa.a@retailplus.com",
    phone: "+1 (555) 444-5566",
    company: "RetailPlus",
    subject: "Demo Request",
    message: "Would like to schedule a product demo for our team.",
    source: "LinkedIn",
    status: "New",
    statusVariant: "info" as const,
    date: "Mar 21, 2024",
    priority: "Low",
  },
  {
    id: "INQ-005",
    name: "James Mitchell",
    email: "james.m@financepro.com",
    phone: "+1 (555) 555-6677",
    company: "FinancePro",
    subject: "Security Compliance Question",
    message: "What security certifications does your platform have?",
    source: "Webinar",
    status: "Closed",
    statusVariant: "muted" as const,
    date: "Mar 20, 2024",
    priority: "Medium",
  },
];

const inquiryStats = [
  { label: "Total Inquiries", value: "184", change: "+28 this week" },
  { label: "New", value: "12", change: "6 high priority" },
  { label: "In Progress", value: "8", change: "Avg response: 2h" },
  { label: "Conversion Rate", value: "34.2%", change: "+3.8% vs last month" },
];

export default function InquiriesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || inquiry.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Inquiries
        </span>
      </div>

      <PageHeader
        title="Inquiries"
        description="Manage customer inquiries and support requests from web forms."
        icon={<HelpCircle className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inquiryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Qualified">Qualified</option>
                <option value="Closed">Closed</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Contact
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Subject
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Source
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Priority
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Date
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredInquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {inquiry.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{inquiry.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {inquiry.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {inquiry.company}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">
                      {inquiry.subject}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {inquiry.source}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={inquiry.status}
                      variant={inquiry.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <StatusBadge
                      status={inquiry.priority}
                      variant={
                        inquiry.priority === "High"
                          ? "danger"
                          : inquiry.priority === "Medium"
                            ? "warning"
                            : "muted"
                      }
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {inquiry.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/sales/inquiries/${inquiry.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
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

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              2
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
