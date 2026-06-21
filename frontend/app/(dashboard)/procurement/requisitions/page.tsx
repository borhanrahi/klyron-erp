"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building2,
} from "lucide-react";

const requisitions = [
  {
    id: "PR-2024-001",
    title: "Office Supplies Restocking",
    requester: "Alice Johnson",
    department: "Administration",
    date: "2024-01-15",
    priority: "Normal",
    status: "Approved",
    total: 2450.0,
    items: 8,
  },
  {
    id: "PR-2024-002",
    title: "IT Equipment Upgrade",
    requester: "Bob Smith",
    department: "Information Technology",
    date: "2024-01-14",
    priority: "High",
    status: "Pending",
    total: 15800.0,
    items: 5,
  },
  {
    id: "PR-2024-003",
    title: "Manufacturing Parts",
    requester: "Carol Williams",
    department: "Production",
    date: "2024-01-13",
    priority: "Urgent",
    status: "Pending Approval",
    total: 32500.0,
    items: 12,
  },
  {
    id: "PR-2024-004",
    title: "Marketing Materials",
    requester: "David Brown",
    department: "Marketing",
    date: "2024-01-12",
    priority: "Normal",
    status: "Rejected",
    total: 4200.0,
    items: 6,
  },
  {
    id: "PR-2024-005",
    title: "Warehouse Equipment",
    requester: "Eva Martinez",
    department: "Logistics",
    date: "2024-01-11",
    priority: "High",
    status: "Draft",
    total: 28900.0,
    items: 9,
  },
  {
    id: "PR-2024-006",
    title: "Lab Supplies",
    requester: "Frank Wilson",
    department: "Research & Development",
    date: "2024-01-10",
    priority: "Normal",
    status: "Approved",
    total: 8750.0,
    items: 15,
  },
];

export default function RequisitionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const statuses = [
    "All",
    "Draft",
    "Pending Approval",
    "Approved",
    "Rejected",
    "Cancelled",
  ];

  const filteredRequisitions = requisitions.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Requisitions"
        description="Manage purchase requests from all departments"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Requisitions" },
        ]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            New Requisition
          </button>
        }
      />

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search requisitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  PR Number
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Requester
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{req.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{req.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Priority: {req.priority}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{req.requester}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{req.department}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{req.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{req.items}</td>
                  <td className="py-4 px-4 font-medium text-foreground">
                    ${req.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4 text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRequisitions.length} of {requisitions.length}{" "}
            requisitions
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}