"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Warehouse,
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Users,
  Package,
  AlertTriangle,
  ArrowUpDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

const warehouse = {
  id: "WH-SH-01",
  code: "SH-01",
  name: "Shanghai Main Warehouse",
  address: "No. 88 Zhangyang Road, Pudong New Area, Shanghai 200120",
  phone: "+86 21 5888 9999",
  email: "sh-warehouse@klyron.com",
  manager: "Zhang Wei",
  managerPhone: "+86 138 0001 2345",
  status: "Active",
  statusVariant: "success" as const,
  totalItems: 456,
  totalStock: 2340,
  bins: 120,
  utilizedBins: 94,
  utilization: 78,
  operatingHours: "Mon-Sat 8:00 AM - 6:00 PM",
  createdAt: "Jan 10, 2022",
};

const stockItems = [
  { id: "ITM-001", sku: "ELC-LPT-001", name: "MacBook Pro 16-inch M3 Max", bin: "A3-12-B4", stock: 12, status: "OK", statusVariant: "success" as const },
  { id: "ITM-002", sku: "ELC-MON-002", name: 'Dell UltraSharp 27" 4K Monitor', bin: "A3-12-B5", stock: 32, status: "OK", statusVariant: "success" as const },
  { id: "ITM-003", sku: "ELC-KB-003", name: "Logitech MX Keys Keyboard", bin: "A4-08-A1", stock: 3, status: "Low Stock", statusVariant: "warning" as const },
  { id: "ITM-004", sku: "ELC-MS-004", name: "Logitech MX Master 3S Mouse", bin: "A4-08-A2", stock: 20, status: "OK", statusVariant: "success" as const },
  { id: "ITM-008", sku: "SPL-PAP-008", name: "A4 Copy Paper 80gsm (5 reams)", bin: "B1-02-C3", stock: 180, status: "OK", statusVariant: "success" as const },
  { id: "ITM-011", sku: "ELC-HED-011", name: "Sony WH-1000XM5 Headphones", bin: "A5-03-B2", stock: 8, status: "OK", statusVariant: "success" as const },
];

const binZones = [
  { zone: "A", name: "Electronics", bins: 45, utilized: 38, items: 196 },
  { zone: "B", name: "Office Supplies", bins: 30, utilized: 24, items: 142 },
  { zone: "C", name: "Furniture", bins: 25, utilized: 18, items: 86 },
  { zone: "D", name: "Packaging", bins: 20, utilized: 14, items: 32 },
];

const recentActivity = [
  { id: "TXN-001", type: "Receipt", detail: "PO-2026-089 received", date: "Jun 18, 2026", by: "Zhang Wei" },
  { id: "TXN-002", type: "Issue", detail: "SO-2026-142 fulfilled", date: "Jun 17, 2026", by: "Li Ming" },
  { id: "TXN-003", type: "Transfer", detail: "Transfer to WH-BJ-01", date: "Jun 16, 2026", by: "Wang Fang" },
  { id: "TXN-004", type: "Adjustment", detail: "Cycle count adjustment", date: "Jun 15, 2026", by: "Chen Jie" },
  { id: "TXN-005", type: "Receipt", detail: "PO-2026-087 received", date: "Jun 14, 2026", by: "Zhang Wei" },
];

const activityTypeColor = {
  Receipt: "success",
  Issue: "danger",
  Transfer: "info",
  Adjustment: "warning",
};

export default function WarehouseDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={warehouse.name}
        description={`${warehouse.address} · Code: ${warehouse.code}`}
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Warehouses", href: "/inventory/warehouses" },
          { label: warehouse.name },
        ]}
        icon={<Warehouse className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/inventory/warehouses"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button className="bg-danger text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/90 active:scale-95 cursor-pointer flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </div>
          <p className="text-2xl font-bold">{warehouse.totalItems}</p>
          <p className="text-xs text-success mt-1">{warehouse.totalStock.toLocaleString()} units</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-xl">
              <Warehouse className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Storage Bins</p>
          </div>
          <p className="text-2xl font-bold">{warehouse.utilizedBins} / {warehouse.bins}</p>
          <p className="text-xs text-muted-foreground mt-1">Utilized</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-warning/10 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <p className="text-sm text-muted-foreground">Utilization</p>
          </div>
          <p className="text-2xl font-bold">{warehouse.utilization}%</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-warning rounded-full transition-all"
              style={{ width: `${warehouse.utilization}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-info/10 rounded-xl">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
          <StatusBadge status={warehouse.status} variant={warehouse.statusVariant} />
          <p className="text-xs text-muted-foreground mt-2">{warehouse.operatingHours}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Warehouse Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{warehouse.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{warehouse.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{warehouse.email}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{warehouse.manager}</p>
                    <p className="text-muted-foreground text-xs">{warehouse.managerPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bin Zones */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Bin Zones</h3>
            <div className="space-y-3">
              {binZones.map((zone) => (
                <div key={zone.zone} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-xs font-bold text-primary">
                        {zone.zone}
                      </span>
                      <span className="text-sm font-medium">{zone.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {zone.utilized}/{zone.bins} bins
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(zone.utilized / zone.bins) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{zone.items} items</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Items & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Items */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Stock Items
              </h3>
              <button className="text-sm text-primary hover:underline flex items-center gap-1">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Item
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Bin
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Stock
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {stockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{item.bin}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">{item.stock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} variant={item.statusVariant} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </h3>
              <button className="text-sm text-primary hover:underline flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
            <div className="divide-y divide-border/50">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-muted/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={activity.type}
                        variant={activityTypeColor[activity.type as keyof typeof activityTypeColor] as "success" | "danger" | "info" | "warning"}
                      />
                      <div>
                        <p className="text-sm font-medium">{activity.detail}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date} · by {activity.by}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{activity.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
