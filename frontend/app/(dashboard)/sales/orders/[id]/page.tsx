"use client";

import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
  Truck,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouter } from "next/navigation";
import { apiGet, apiPut, apiDelete } from "@/lib/api";

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

const STATUS_OPTIONS = ["draft", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_ACTIONS: Record<string, { label: string; nextStatus: string; icon: typeof Truck; variant: string }> = {
  draft: { label: "Confirm", nextStatus: "confirmed", icon: CheckCircle, variant: "bg-primary" },
  confirmed: { label: "Start Processing", nextStatus: "processing", icon: Package, variant: "bg-primary" },
  processing: { label: "Ship", nextStatus: "shipped", icon: Truck, variant: "bg-primary" },
  shipped: { label: "Deliver", nextStatus: "delivered", icon: CheckCircle, variant: "bg-success" },
};

export default function SalesOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editStatus, setEditStatus] = useState("");
  const [editDeliveryDate, setEditDeliveryDate] = useState("");
  const [editShippingAddress, setEditShippingAddress] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    try {
      setLoading(true);
      const data = await apiGet<{ data: Order }>(`/sales/orders/${id}`);
      const orderData = data.data;
      setOrder(orderData);
      setEditStatus(orderData.status);
      setEditDeliveryDate(orderData.delivery_date ?? "");
      setEditShippingAddress(orderData.shipping_address ?? "");
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!order) return;
    try {
      setSaving(true);
      const updated = await apiPut<Order>(`/sales/orders/${id}`, {
        status: editStatus,
        delivery_date: editDeliveryDate || null,
        shipping_address: editShippingAddress || null,
      });
      setOrder(updated);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(nextStatus: string) {
    if (!order) return;
    try {
      setSaving(true);
      const updated = await apiPut<Order>(`/sales/orders/${id}`, {
        status: nextStatus,
      });
      setOrder(updated);
      setEditStatus(nextStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await apiDelete(`/sales/orders/${id}`);
      router.push("/sales/orders");
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading order...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Order not found.
      </div>
    );
  }

  const statusAction = STATUS_ACTIONS[order.status];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      <Link
        href="/sales/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sales Orders
      </Link>

      <PageHeader
        title={`Sales Order ${order.order_number}`}
        description={`Created on ${new Date(order.created_at).toLocaleDateString()}`}
        icon={<ShoppingCart className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            {statusAction && (
              <button
                onClick={() => handleStatusChange(statusAction.nextStatus)}
                disabled={saving}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <statusAction.icon className="h-4 w-4" />
                {statusAction.label}
              </button>
            )}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            )}
            <button
              onClick={handleDelete}
              className="border border-danger/30 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Items
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Item ID
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Qty
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Price
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Tax
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{item.item_id}</td>
                      <td className="py-3 px-4 text-right text-sm">{item.qty}</td>
                      <td className="py-3 px-4 text-right text-sm">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-sm">${item.tax.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-sm font-semibold">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={4} className="py-3 px-4 text-right text-sm text-muted-foreground">
                      Subtotal
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold">
                      ${order.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right text-sm text-muted-foreground">
                      Tax
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold">
                      ${order.tax.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-t border-border bg-muted/30">
                    <td colSpan={4} className="py-3 px-4 text-right text-sm font-bold">
                      Total
                    </td>
                    <td className="py-3 px-4 text-right text-lg font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            {editMode ? (
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <StatusBadge
                status={order.status}
                variant={mapStatusVariant(order.status)}
              />
            )}
          </div>

          {/* Delivery Date */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Delivery Date</h3>
            {editMode ? (
              <DatePicker
                value={editDeliveryDate}
                onChange={setEditDeliveryDate}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm">
                {order.delivery_date
                  ? new Date(order.delivery_date).toLocaleDateString()
                  : "Not set"}
              </p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            {editMode ? (
              <textarea
                rows={3}
                value={editShippingAddress}
                onChange={(e) => setEditShippingAddress(e.target.value)}
                placeholder="Full shipping address"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {order.shipping_address || "Not set"}
              </p>
            )}
          </div>

          {/* Customer ID */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Customer</h3>
            <p className="text-sm">
              <span className="text-muted-foreground">ID: </span>
              <span className="font-medium">{order.customer_id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
