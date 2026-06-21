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
  Truck,
} from "lucide-react";

const purchaseOrders = [
  {
    id: "PO-2024-001",
    supplier: "TechParts International",
    date: "2024-01-15",
    deliveryDate: "2024-01-25",
    amount: 24500.0,
    status: "Confirmed",
    items: 12,
    prReference: "PR-2024-001",
  },
  {
    id: "PO-2024-002",
    supplier: "Global Materials Co",
    date: "2024-01-14",
    deliveryDate: "2024-01-28",
    amount: 18750.0,
    status: "Pending",
    items: 8,
    prReference: "PR-2024-002",
  },
  {
    id: "PO-2024-003",
    supplier: "Packaging Solutions Ltd",
    date: "2024-01-13",
    deliveryDate: "2024-01-20",
    amount: 12300.0,
    status: "Shipped",
    items: 5,
    prReference: "PR-2024-003",
  },
  {
    id: "PO-2024-004",
    supplier: "Office Supplies Direct",
    date: "2024-01-12",
    deliveryDate: "2024-01-18",
    amount: 5200.0,
    status: "Delivered",
    items: 15,
    prReference: "PR-2024-004",
  },
  {
    id: "PO-2024-005",
    supplier: "GreenTech Solutions",
    date: "2024-01-11",
    deliveryDate: "2024-01-30",
    amount: 31200.0,
    status: "Draft",
    items: 6,
    prReference: "PR-2024-005",
  },
  {
    id: "PO-2024-006",
    supplier: "Industrial Equipment Inc",
    date: "2024-01-10",
    deliveryDate: "2024-01-22",
    amount: 8900.0,
    status: "Cancelled",
    items: 3,
    prReference: "PR-2024-006",
  },
];

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const statuses = [
    "All",
    "Draft",
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || po.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Track and manage all purchase orders"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders" },
        ]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            Create PO
          </button>
        }
      />

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search purchase orders..."
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
                  PO Number
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  PR Reference
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Order Date
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Delivery Date
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Amount
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
              {filteredOrders.map((po) => (
                <tr
                  key={po.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{po.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{po.supplier}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-muted-foreground">
                      {po.prReference}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{po.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {po.deliveryDate}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{po.items}</td>
                  <td className="py-4 px-4 font-medium text-foreground">
                    ${po.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={po.status} />
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
            Showing {filteredOrders.length} of {purchaseOrders.length} purchase
            orders
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