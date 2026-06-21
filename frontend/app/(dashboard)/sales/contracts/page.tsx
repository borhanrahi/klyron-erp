"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileSignature,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Calendar,
  Building2,
} from "lucide-react";
import Link from "next/link";

const contracts = [
  {
    id: "CTR-2024-001",
    customer: "Acme Corp",
    title: "Enterprise Platform License Agreement",
    value: "$150,000",
    startDate: "Jan 1, 2024",
    endDate: "Dec 31, 2024",
    status: "Active",
    statusVariant: "success" as const,
    type: "Annual",
  },
  {
    id: "CTR-2024-002",
    customer: "TechStart Inc",
    title: "Cloud Infrastructure Services",
    value: "$87,500",
    startDate: "Mar 1, 2024",
    endDate: "Feb 28, 2025",
    status: "Active",
    statusVariant: "success" as const,
    type: "Annual",
  },
  {
    id: "CTR-2024-003",
    customer: "Global Industries",
    title: "Data Analytics Suite - Enterprise",
    value: "$210,000",
    startDate: "Apr 1, 2024",
    endDate: "Mar 31, 2025",
    status: "Pending Signature",
    statusVariant: "warning" as const,
    type: "Annual",
  },
  {
    id: "CTR-2024-004",
    customer: "Creative Solutions",
    title: "Marketing Automation Platform",
    value: "$36,000",
    startDate: "Feb 1, 2024",
    endDate: "Jan 31, 2025",
    status: "Active",
    statusVariant: "success" as const,
    type: "Annual",
  },
  {
    id: "CTR-2024-005",
    customer: "DataFlow Systems",
    title: "ERP Implementation Phase 2",
    value: "$340,000",
    startDate: "May 1, 2024",
    endDate: "Apr 30, 2025",
    status: "Draft",
    statusVariant: "muted" as const,
    type: "Project",
  },
  {
    id: "CTR-2023-008",
    customer: "Quantum Enterprises",
    title: "Security Audit Services",
    value: "$45,000",
    startDate: "Jun 1, 2023",
    endDate: "May 31, 2024",
    status: "Expiring Soon",
    statusVariant: "warning" as const,
    type: "Annual",
  },
];

const contractStats = [
  { label: "Active Contracts", value: "24", change: "+3 this quarter" },
  { label: "Total Value", value: "$1.8M", change: "+$420K vs last year" },
  { label: "Pending Renewal", value: "8", change: "Next 30 days" },
  { label: "Avg. Contract Length", value: "11.2 months", change: "+0.8 months" },
];

export default function ContractsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || contract.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Contracts
        </span>
      </div>

      <PageHeader
        title="Contracts"
        description="Manage customer contracts, renewals, and compliance."
        icon={<FileSignature className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link
              href="/sales/contracts/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Contract
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contractStats.map((stat) => (
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
                placeholder="Search contracts..."
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
                <option value="Pending Signature">Pending Signature</option>
                <option value="Draft">Draft</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Expired">Expired</option>
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
                    Contract
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Value
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Start Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  End Date
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
              {filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{contract.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {contract.id} • {contract.type}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {contract.customer}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold">
                      {contract.value}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {contract.startDate}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {contract.endDate}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={contract.status}
                      variant={contract.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/sales/contracts/${contract.id}`}
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
            Showing {filteredContracts.length} of {contracts.length} contracts
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
