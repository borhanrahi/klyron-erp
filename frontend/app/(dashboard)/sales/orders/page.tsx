"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: string;
  items: number;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
  payment: string;
  paymentVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
}

function mapStatusVariant(status: string): Order["statusVariant"] {
  const s = (status || "").toLowerCase();
  if (s === "confirmed" || s === "delivered" || s === "completed" || s === "paid") return "success";
  if (s === "pending" || s === "processing") return "warning";
  if (s === "cancelled" || s === "failed" || s === "unpaid") return "danger";
  if (s === "shipped" || s === "in transit") return "primary";
  return "info";
}

function mapPaymentVariant(payment: string): Order["paymentVariant"] {
  const p = (payment || "").toLowerCase();
  if (p === "paid" || p === "completed") return "success";
  if (p === "pending" || p === "partial") return "warning";
  if (p === "unpaid" || p === "overdue" || p === "failed") return "danger";
  if (p === "refunded") return "muted";
  return "info";
}

function mapOrder(raw: any): Order {
  const status = raw.status ?? raw.order_status ?? "";
  const payment = raw.payment ?? raw.payment_status ?? raw.paymentStatus ?? "";
  return {
    id: raw.id ?? raw.ID ?? raw.order_number ?? "",
    customer: raw.customer ?? raw.customer_name ?? raw.company_name ?? "",
    email: raw.email ?? raw.customer_email ?? "",
    date: raw.date ?? raw.created_at ?? raw.order_date ?? "",
    total: raw.total ?? raw.total_amount ?? raw.amount ?? "$0",
    items: Array.isArray(raw.items) ? raw.items.length : (raw.item_count ?? 0),
    status: status,
    statusVariant: mapStatusVariant(status),
    payment: payment,
    paymentVariant: mapPaymentVariant(payment),
  };
}

const orderStats = [
  { label: "Total Orders", value: "247", change: "+18 this week" },
  { label: "Pending", value: "12", change: "3 urgent" },
  { label: "Processing", value: "28", change: "On track" },
  { label: "Revenue", value: "$1.2M", change: "+12% vs last month" },
];

export default function SalesOrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await apiGet<any>("/sales/orders");
        const items = (res.items ?? res.data ?? []).map(mapOrder);
        setOrders(items);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Sales</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Sales Orders
        </span>
      </div>

      <PageHeader
        title="Sales Orders"
        description="Manage and track customer orders, fulfillment, and invoicing."
        icon={<ShoppingCart className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Sales Order
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStats.map((stat) => (
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

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
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
            <span className="ml-2 text-sm text-muted-foreground">Loading orders...</span>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        Order ID
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Customer
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Total
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Items
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                      Payment
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-primary">
                          {order.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {order.date}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">{order.total}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {Array.isArray(order.items) ? order.items.length : order.items} items
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={order.status}
                          variant={order.statusVariant}
                        />
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <StatusBadge
                          status={order.payment}
                          variant={order.paymentVariant}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4" />
                          </button>
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

            {/* Pagination */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {orders.length} orders
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
          </>
        )}
      </div>
    </div>
  );
}
