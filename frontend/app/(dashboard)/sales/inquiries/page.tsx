"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  source: string;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
  date: string;
  priority: string;
}

function mapStatusVariant(status: string): Inquiry["statusVariant"] {
  const s = (status || "").toLowerCase();
  if (s === "qualified" || s === "won" || s === "resolved") return "success";
  if (s === "in progress" || s === "in_progress" || s === "pending") return "warning";
  if (s === "closed" || s === "rejected" || s === "lost") return "muted";
  if (s === "new" || s === "open") return "info";
  return "primary";
}

function mapInquiry(raw: any): Inquiry {
  const status = raw.status ?? raw.inquiry_status ?? "New";
  const priority = raw.priority ?? raw.priority_level ?? "Medium";
  return {
    id: raw.id ?? raw.ID ?? raw.inquiry_number ?? "",
    name: raw.name ?? raw.contact_name ?? raw.from_name ?? "",
    email: raw.email ?? raw.contact_email ?? raw.from_email ?? "",
    phone: raw.phone ?? raw.contact_phone ?? "",
    company: raw.company ?? raw.company_name ?? raw.organization ?? "",
    subject: raw.subject ?? raw.topic ?? raw.title ?? "",
    message: raw.message ?? raw.description ?? raw.body ?? "",
    source: raw.source ?? raw.inquiry_source ?? "",
    status: status,
    statusVariant: mapStatusVariant(status),
    date: raw.date ?? raw.created_at ?? raw.inquiry_date ?? "",
    priority: priority,
  };
}

const inquiryStats = [
  { label: "Total Inquiries", value: "184", change: "+28 this week" },
  { label: "New", value: "12", change: "6 high priority" },
  { label: "In Progress", value: "8", change: "Avg response: 2h" },
  { label: "Conversion Rate", value: "34.2%", change: "+3.8% vs last month" },
];

export default function InquiriesListPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await apiGet<any>("/sales/inquiries");
        const items = (res.items ?? res.data ?? []).map(mapInquiry);
        setInquiries(items);
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || inquiry.status.toLowerCase() === selectedStatus.toLowerCase();
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading inquiries...</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
