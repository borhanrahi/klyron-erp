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
  Mail,
  Phone,
  DollarSign,
  Building2,
} from "lucide-react";
import Link from "next/link";

const customers = [
  {
    id: "C-001",
    name: "Acme Corp",
    contact: "Robert Anderson",
    email: "robert@acme.com",
    phone: "+1 (555) 123-4567",
    industry: "Manufacturing",
    totalSpent: "$285,000",
    orders: 12,
    status: "Active",
    statusVariant: "success" as const,
    since: "Jan 2022",
  },
  {
    id: "C-002",
    name: "TechStart Inc",
    contact: "Sarah Johnson",
    email: "sarah@techstart.io",
    phone: "+1 (555) 234-5678",
    industry: "Technology",
    totalSpent: "$142,500",
    orders: 8,
    status: "Active",
    statusVariant: "success" as const,
    since: "Mar 2023",
  },
  {
    id: "C-003",
    name: "Global Industries",
    contact: "James Chen",
    email: "james@globalind.com",
    phone: "+1 (555) 345-6789",
    industry: "Energy",
    totalSpent: "$456,000",
    orders: 15,
    status: "Active",
    statusVariant: "success" as const,
    since: "Jun 2021",
  },
  {
    id: "C-004",
    name: "Creative Solutions",
    contact: "Maria Garcia",
    email: "maria@creative.com",
    phone: "+1 (555) 456-7890",
    industry: "Marketing",
    totalSpent: "$67,500",
    orders: 4,
    status: "Inactive",
    statusVariant: "muted" as const,
    since: "Sep 2023",
  },
  {
    id: "C-005",
    name: "DataFlow Systems",
    contact: "David Kim",
    email: "david@dataflow.io",
    phone: "+1 (555) 567-8901",
    industry: "Finance",
    totalSpent: "$320,000",
    orders: 10,
    status: "Active",
    statusVariant: "success" as const,
    since: "Feb 2022",
  },
  {
    id: "C-006",
    name: "Innovate Labs",
    contact: "Rachel Thompson",
    email: "rachel@innovate.com",
    phone: "+1 (555) 678-9012",
    industry: "Healthcare",
    totalSpent: "$95,000",
    orders: 3,
    status: "Pending",
    statusVariant: "warning" as const,
    since: "Jan 2024",
  },
  {
    id: "C-007",
    name: "Quantum Enterprises",
    contact: "Alex Rivera",
    email: "alex@quantum.com",
    phone: "+1 (555) 789-0123",
    industry: "Logistics",
    totalSpent: "$188,000",
    orders: 7,
    status: "Active",
    statusVariant: "success" as const,
    since: "Aug 2022",
  },
  {
    id: "C-008",
    name: "Nexus Digital",
    contact: "Sophie Laurent",
    email: "sophie@nexus.com",
    phone: "+1 (555) 890-1234",
    industry: "E-commerce",
    totalSpent: "$210,000",
    orders: 9,
    status: "Active",
    statusVariant: "success" as const,
    since: "Apr 2023",
  },
];

const customerStats = [
  { label: "Total Customers", value: "1,248", change: "+32 this month" },
  { label: "Active", value: "1,186", change: "95% retention rate" },
  { label: "Avg. Lifetime Value", value: "$24,500", change: "+$1,200 vs last year" },
  { label: "Total Revenue", value: "$3.2M", change: "+18% YoY growth" },
];

export default function CustomersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Customers
        </span>
      </div>

      <PageHeader
        title="Customers"
        description="Manage your customer directory and relationships."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <Link
              href="/sales/customers/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {customerStats.map((stat) => (
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
                placeholder="Search customers..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
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
                    Customer
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Industry
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Total Spent
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Orders
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
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div>
                      <p className="text-sm font-medium">{customer.contact}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {customer.industry}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold">
                      {customer.totalSpent}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {customer.orders} orders
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={customer.status}
                      variant={customer.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/sales/customers/${customer.id}`}
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
            Showing {filteredCustomers.length} of {customers.length} customers
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
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              3
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
