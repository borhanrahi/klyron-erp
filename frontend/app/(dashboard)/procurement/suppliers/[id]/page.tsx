"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  ShoppingCart,
  TrendingUp,
  Clock,
  Plus,
  Edit,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface SupplierData {
  id: string;
  name: string;
  code: string;
  category: string;
  rating: number;
  status: string;
  since: string;
  contact: {
    name: string;
    title: string;
    phone: string;
    email: string;
    address: string;
  };
  stats: {
    totalOrders: number;
    avgDelivery: string;
    onTimeRate: string;
    totalSpend: string;
  };
}

interface Order {
  id: string;
  date: string;
  items: number;
  total: string;
  status: string;
}

export default function SupplierProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    async function fetchSupplier() {
      try {
        const res = await apiGet<{ data: any }>(
          `/procurement/suppliers/${params.id}`
        );
        const s = res.data || res;
        setSupplier({
          id: s.id,
          name: s.name || s.company_name || "",
          code: s.code || s.supplier_code || `SUP-${s.id}`,
          category: s.category || "",
          rating: s.rating || 0,
          status: s.status || "Active",
          since: s.created_at || s.since || "",
          contact: {
            name: s.contact_person || s.contact?.name || "",
            title: s.contact_title || s.contact?.title || "",
            phone: s.phone || s.contact?.phone || "",
            email: s.email || s.contact?.email || "",
            address: s.address || s.contact?.address || "",
          },
          stats: {
            totalOrders: s.total_orders || s.stats?.totalOrders || 0,
            avgDelivery: s.avg_delivery || s.stats?.avgDelivery || "N/A",
            onTimeRate: s.on_time_rate || s.stats?.onTimeRate || "N/A",
            totalSpend: s.total_spend || s.stats?.totalSpend || "$0",
          },
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    async function fetchOrders() {
      try {
        const res = await apiGet<{ items: any[] }>("/procurement/orders");
        const filtered = res.items
          .filter(
            (o: any) =>
              String(o.supplier_id) === String(params.id) ||
              String(o.supplier) === String(params.id)
          )
          .slice(0, 5);
        setOrders(
          filtered.map((o: any) => ({
            id: o.order_number || `PO-${o.id}`,
            date: o.order_date || o.created_at || "",
            items: o.item_count || o.items_count || 0,
            total: `$${(o.total_amount || o.total || 0).toLocaleString()}`,
            status: o.status || "Draft",
          }))
        );
      } catch {
        setOrders([]);
      }
    }

    Promise.all([fetchSupplier(), fetchOrders()]);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Supplier Not Found"
          description="The supplier you are looking for does not exist"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Procurement", href: "/procurement" },
            { label: "Suppliers", href: "/procurement/suppliers" },
            { label: "Not Found" },
          ]}
          actions={
            <button
              onClick={() => router.push("/procurement/suppliers")}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Suppliers
            </button>
          }
        />
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Supplier not found or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const performanceMetrics = [
    { label: "Quality Score", value: "96%", icon: Star, color: "text-success" },
    { label: "Delivery Score", value: "98%", icon: Clock, color: "text-primary" },
    { label: "Response Time", value: "2.1h", icon: TrendingUp, color: "text-accent" },
    { label: "Communication", value: "4.8/5", icon: Mail, color: "text-warning" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={supplier.name}
        description={`${supplier.code} · ${supplier.category}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Suppliers", href: "/procurement/suppliers" },
          { label: supplier.name },
        ]}
        icon={<Building2 className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/procurement/suppliers")}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() =>
                router.push("/procurement/purchase-orders/new")
              }
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Purchase Order
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(supplier.stats).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-xs text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-xl font-bold mt-1">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="text-center p-4 rounded-xl bg-muted/50">
                    <Icon className={`h-6 w-6 ${metric.color} mx-auto mb-2`} />
                    <p className="text-xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <button
                onClick={() =>
                  router.push("/procurement/purchase-orders")
                }
                className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View All
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No orders found for this supplier
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                        Order ID
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                        Date
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                        Items
                      </th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                        Total
                      </th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-muted/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-primary">
                            {order.id}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {order.date
                              ? new Date(order.date).toLocaleDateString()
                              : ""}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {order.items} items
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-semibold">
                            {order.total}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Key Contacts</h3>
            {supplier.contact.name && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {supplier.contact.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {supplier.contact.name}
                  </p>
                  {supplier.contact.title && (
                    <p className="text-xs text-muted-foreground">
                      {supplier.contact.title}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-3">
              {supplier.contact.phone && (
                <a
                  href={`tel:${supplier.contact.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.contact.phone}</span>
                </a>
              )}
              {supplier.contact.email && (
                <a
                  href={`mailto:${supplier.contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.contact.email}</span>
                </a>
              )}
              {supplier.contact.address && (
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{supplier.contact.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() =>
                  router.push("/procurement/purchase-orders/new")
                }
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Create Purchase Order
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Message
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Vendor Score</h3>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary">
                {supplier.rating}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(supplier.rating)
                      ? "text-warning fill-warning"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {supplier.stats.totalOrders} orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
