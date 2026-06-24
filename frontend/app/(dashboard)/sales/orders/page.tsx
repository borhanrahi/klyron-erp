"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";

interface OrderItem {
  id: number;
  item_id: number;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  delivery_date: string | null;
  shipping_address: string | null;
  created_at: string;
  items: OrderItem[];
}

function mapStatusVariant(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "confirmed" || s === "delivered" || s === "completed") return "success" as const;
  if (s === "pending" || s === "processing" || s === "draft") return "warning" as const;
  if (s === "cancelled" || s === "failed") return "danger" as const;
  if (s === "shipped") return "primary" as const;
  return "info" as const;
}

const STATUS_OPTIONS = ["All", "draft", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function SalesOrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { confirm, state, handleClose } = useConfirm();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await apiGet<{ items: Order[]; total: number }>("/sales/orders");
      setOrders(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = await confirm("Are you sure you want to delete this order?");
    if (!ok) return;
    try {
      await apiDelete(`/sales/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Sales Orders"
        description="Manage and track customer orders, fulfillment, and invoicing."
        icon={<ShoppingCart className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/orders/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Order
          </Link>
        }
      />

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  Status: {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading orders...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Order #
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Customer ID
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Total
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-primary">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {order.customer_id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={order.status}
                          variant={mapStatusVariant(order.status)}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/sales/orders/${order.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {total} orders
              </p>
            </div>
          </>
        )}
      </div>
      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
