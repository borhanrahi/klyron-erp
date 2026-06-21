"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Phone,
  Mail,
  Building2,
  Star,
} from "lucide-react";
import Link from "next/link";

const leads = [
  {
    id: "L-001",
    name: "Sarah Johnson",
    company: "TechStart Inc",
    email: "sarah.johnson@techstart.io",
    phone: "+1 (555) 234-5678",
    source: "Webinar",
    status: "Qualified",
    statusVariant: "success" as const,
    score: 85,
    value: "$45,000",
    owner: "Mike Johnson",
    created: "Mar 15, 2024",
  },
  {
    id: "L-002",
    name: "James Chen",
    company: "Global Industries",
    email: "james.chen@globalind.com",
    phone: "+1 (555) 345-6789",
    source: "Referral",
    status: "New",
    statusVariant: "info" as const,
    score: 42,
    value: "$12,000",
    owner: "Emily Davis",
    created: "Mar 18, 2024",
  },
  {
    id: "L-003",
    name: "Maria Garcia",
    company: "Creative Solutions",
    email: "maria.garcia@creative.com",
    phone: "+1 (555) 456-7890",
    source: "Website",
    status: "Contacted",
    statusVariant: "warning" as const,
    score: 58,
    value: "$28,500",
    owner: "Mike Johnson",
    created: "Mar 12, 2024",
  },
  {
    id: "L-004",
    name: "David Kim",
    company: "DataFlow Systems",
    email: "david.kim@dataflow.io",
    phone: "+1 (555) 567-8901",
    source: "LinkedIn",
    status: "Proposal Sent",
    statusVariant: "primary" as const,
    score: 72,
    value: "$67,000",
    owner: "Emily Davis",
    created: "Mar 10, 2024",
  },
  {
    id: "L-005",
    name: "Rachel Thompson",
    company: "Innovate Labs",
    email: "rachel.t@innovate.com",
    phone: "+1 (555) 678-9012",
    source: "Trade Show",
    status: "Unqualified",
    statusVariant: "danger" as const,
    score: 15,
    value: "$8,000",
    owner: "Mike Johnson",
    created: "Mar 20, 2024",
  },
  {
    id: "L-006",
    name: "Alex Rivera",
    company: "Quantum Enterprises",
    email: "alex.r@quantum.com",
    phone: "+1 (555) 789-0123",
    source: "Cold Call",
    status: "New",
    statusVariant: "info" as const,
    score: 35,
    value: "$19,200",
    owner: "Emily Davis",
    created: "Mar 21, 2024",
  },
  {
    id: "L-007",
    name: "Sophie Laurent",
    company: "Nexus Digital",
    email: "sophie.l@nexus.com",
    phone: "+1 (555) 890-1234",
    source: "Webinar",
    status: "Qualified",
    statusVariant: "success" as const,
    score: 91,
    value: "$120,000",
    owner: "Mike Johnson",
    created: "Mar 8, 2024",
  },
  {
    id: "L-008",
    name: "Tom Bradley",
    company: "Apex Solutions",
    email: "tom.b@apex.com",
    phone: "+1 (555) 901-2345",
    source: "Website",
    status: "Contacted",
    statusVariant: "warning" as const,
    score: 48,
    value: "$33,000",
    owner: "Emily Davis",
    created: "Mar 16, 2024",
  },
];

const leadStats = [
  { label: "Total Leads", value: "156", change: "+24 this month" },
  { label: "Qualified", value: "42", change: "+8 this week" },
  { label: "Conversion Rate", value: "18.5%", change: "+2.3% vs last month" },
  { label: "Pipeline Value", value: "$2.1M", change: "+$340K this quarter" },
];

export default function LeadsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Leads
        </span>
      </div>

      <PageHeader
        title="Leads"
        description="Track and manage your sales leads through the pipeline."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <Link
              href="/sales/leads/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leadStats.map((stat) => (
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
                placeholder="Search leads..."
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
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Unqualified">Unqualified</option>
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
                    Lead
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Source
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Score
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Value
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {lead.company}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={lead.status}
                      variant={lead.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            lead.score >= 70
                              ? "bg-success"
                              : lead.score >= 40
                                ? "bg-warning"
                                : "bg-danger"
                          }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold">{lead.value}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/sales/leads/${lead.id}`}
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
            Showing {filteredLeads.length} of {leads.length} leads
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
