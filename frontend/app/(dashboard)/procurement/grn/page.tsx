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
  Building2,
  Package,
  CheckCircle,
} from "lucide-react";

const goodsReceiptNotes = [
  {
    id: "GRN-2024-001",
    poReference: "PO-2024-001",
    supplier: "TechParts International",
    receivedDate: "2024-01-22",
    receivedBy: "Alice Johnson",
    items: 12,
    totalQuantity: 15,
    status: "Accepted",
    condition: "Good",
  },
  {
    id: "GRN-2024-002",
    poReference: "PO-2024-003",
    supplier: "Packaging Solutions Ltd",
    receivedDate: "2024-01-20",
    receivedBy: "Bob Smith",
    items: 8,
    totalQuantity: 500,
    status: "Accepted",
    condition: "Good",
  },
  {
    id: "GRN-2024-003",
    poReference: "PO-2024-004",
    supplier: "Office Supplies Direct",
    receivedDate: "2024-01-18",
    receivedBy: "Carol Williams",
    items: 15,
    totalQuantity: 200,
    status: "Partial",
    condition: "Mixed",
  },
  {
    id: "GRN-2024-004",
    poReference: "PO-2024-006",
    supplier: "Industrial Equipment Inc",
    receivedDate: "2024-01-17",
    receivedBy: "David Brown",
    items: 3,
    totalQuantity: 3,
    status: "Rejected",
    condition: "Damaged",
  },
  {
    id: "GRN-2024-005",
    poReference: "PO-2024-002",
    supplier: "Global Materials Co",
    receivedDate: "2024-01-25",
    receivedBy: "Eva Martinez",
    items: 6,
    totalQuantity: 60,
    status: "Pending Inspection",
    condition: "N/A",
  },
];

export default function GRNPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const statuses = [
    "All",
    "Accepted",
    "Partial",
    "Rejected",
    "Pending Inspection",
  ];

  const filteredGRN = goodsReceiptNotes.filter((grn) => {
    const matchesSearch =
      grn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.poReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || grn.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Receipt Notes"
        description="Track received goods and inventory updates"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "GRN" },
        ]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            New GRN
          </button>
        }
      />

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search GRNs..."
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
                  GRN Number
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  PO Reference
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Received Date
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Received By
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Qty
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Condition
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
              {filteredGRN.map((grn) => (
                <tr
                  key={grn.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{grn.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-muted-foreground">
                      {grn.poReference}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{grn.supplier}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {grn.receivedDate}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-foreground">{grn.receivedBy}</span>
                  </td>
                  <td className="py-4 px-4 text-foreground">{grn.items}</td>
                  <td className="py-4 px-4 text-foreground">
                    {grn.totalQuantity}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        grn.condition === "Good"
                          ? "bg-success/20 text-success"
                          : grn.condition === "Damaged"
                          ? "bg-danger/20 text-danger"
                          : grn.condition === "Mixed"
                          ? "bg-warning/20 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {grn.condition}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={grn.status} />
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
            Showing {filteredGRN.length} of {goodsReceiptNotes.length} GRNs
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