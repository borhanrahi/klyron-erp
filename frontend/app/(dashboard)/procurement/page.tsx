"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Truck,
  FileText,
  ShoppingCart,
  Package,
  MessageSquare,
  ArrowRight,
  Loader2,
  Plus,
} from "lucide-react";

interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
}

interface RecentItem {
  id: string;
  title: string;
  status: string;
  date: string;
  module: string;
}

export default function ProcurementPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [suppliersRes, requisitionsRes, ordersRes, grnRes, rfqRes] =
          await Promise.all([
            apiGet<{ items: unknown[]; total: number }>(
              "/procurement/suppliers"
            ).catch(() => ({ items: [], total: 0 })),
            apiGet<{ items: unknown[]; total: number }>(
              "/procurement/requisitions"
            ).catch(() => ({ items: [], total: 0 })),
            apiGet<{ items: unknown[]; total: number }>(
              "/procurement/orders"
            ).catch(() => ({ items: [], total: 0 })),
            apiGet<{ items: unknown[]; total: number }>(
              "/procurement/grn"
            ).catch(() => ({ items: [], total: 0 })),
            apiGet<{ items: unknown[]; total: number }>(
              "/procurement/rfqs"
            ).catch(() => ({ items: [], total: 0 })),
          ]);

        const activeReqs = requisitionsRes.items.filter(
          (r: any) => r.status && !["Cancelled", "Rejected", "Completed"].includes(r.status)
        ).length;
        const openPOs = ordersRes.items.filter(
          (o: any) => o.status && !["Cancelled", "Completed", "Closed"].includes(o.status)
        ).length;
        const pendingGRNs = grnRes.items.filter(
          (g: any) => g.status && !["Completed", "Received", "Cancelled"].includes(g.status)
        ).length;
        const openRFQs = rfqRes.items.filter(
          (r: any) => r.status && !["Closed", "Cancelled", "Awarded"].includes(r.status)
        ).length;

        setStats([
          {
            label: "Total Suppliers",
            value: suppliersRes.total,
            icon: Truck,
            color: "text-primary",
            href: "/procurement/suppliers",
          },
          {
            label: "Active Requisitions",
            value: activeReqs,
            icon: FileText,
            color: "text-info",
            href: "/procurement/requisitions",
          },
          {
            label: "Open Purchase Orders",
            value: openPOs,
            icon: ShoppingCart,
            color: "text-warning",
            href: "/procurement/purchase-orders",
          },
          {
            label: "Pending GRNs",
            value: pendingGRNs,
            icon: Package,
            color: "text-success",
            href: "/procurement/grn",
          },
          {
            label: "Open RFQs",
            value: openRFQs,
            icon: MessageSquare,
            color: "text-accent",
            href: "/procurement/rfq",
          },
        ]);

        const items: RecentItem[] = [];
        requisitionsRes.items.slice(0, 3).forEach((r: any) => {
          items.push({
            id: r.requisition_number || `PR-${r.id}`,
            title: r.title || r.description || "Requisition",
            status: r.status || "Draft",
            date: r.request_date || r.created_at || "",
            module: "requisitions",
          });
        });
        ordersRes.items.slice(0, 3).forEach((o: any) => {
          items.push({
            id: o.order_number || `PO-${o.id}`,
            title: o.title || o.supplier_name || "Purchase Order",
            status: o.status || "Draft",
            date: o.order_date || o.created_at || "",
            module: "purchase-orders",
          });
        });
        grnRes.items.slice(0, 2).forEach((g: any) => {
          items.push({
            id: g.grn_number || `GRN-${g.id}`,
            title: g.title || g.supplier_name || "GRN",
            status: g.status || "Draft",
            date: g.received_date || g.created_at || "",
            module: "grn",
          });
        });
        setRecentItems(items);
      } catch {
        setStats([
          { label: "Total Suppliers", value: 0, icon: Truck, color: "text-primary", href: "/procurement/suppliers" },
          { label: "Active Requisitions", value: 0, icon: FileText, color: "text-info", href: "/procurement/requisitions" },
          { label: "Open Purchase Orders", value: 0, icon: ShoppingCart, color: "text-warning", href: "/procurement/purchase-orders" },
          { label: "Pending GRNs", value: 0, icon: Package, color: "text-success", href: "/procurement/grn" },
          { label: "Open RFQs", value: 0, icon: MessageSquare, color: "text-accent", href: "/procurement/rfq" },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const modules = [
    { name: "Suppliers", href: "/procurement/suppliers", icon: Truck, description: "Manage supplier directory and relationships" },
    { name: "Purchase Requisitions", href: "/procurement/requisitions", icon: FileText, description: "Submit and manage purchase requests" },
    { name: "Purchase Orders", href: "/procurement/purchase-orders", icon: ShoppingCart, description: "Create and track purchase orders" },
    { name: "Goods Received Notes", href: "/procurement/grn", icon: Package, description: "Record and verify received goods" },
    { name: "RFQs", href: "/procurement/rfq", icon: MessageSquare, description: "Request quotes from suppliers" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement"
        description="Manage your procurement operations, suppliers, and purchase orders"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Procurement" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => router.push(stat.href)}
              className="bg-card rounded-xl border border-border p-5 hover:bg-muted/50 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          {recentItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentItems.map((item, i) => (
                <button
                  key={`${item.module}-${item.id}-${i}`}
                  onClick={() => router.push(`/procurement/${item.module}`)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-sm">{item.id}</p>
                    <p className="text-xs text-muted-foreground">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {item.date ? new Date(item.date).toLocaleDateString() : ""}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Modules</h2>
          </div>
          <div className="divide-y divide-border">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.name}
                  onClick={() => router.push(mod.href)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{mod.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {mod.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
