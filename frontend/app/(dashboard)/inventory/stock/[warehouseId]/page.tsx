"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Warehouse,
  Search,
  Filter,
  Download,
  ArrowLeft,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Users,
  Package,
  AlertTriangle,
} from "lucide-react";

const warehouse = {
  id: "WH-SH-01",
  name: "Shanghai Main Warehouse",
  address: "No. 88 Zhangyang Road, Pudong New Area, Shanghai",
  phone: "+86 21 5888 9999",
  email: "sh-warehouse@klyron.com",
  manager: "Zhang Wei",
  status: "Active",
  statusVariant: "success" as const,
  totalItems: 456,
  totalStock: 2340,
  bins: 120,
  utilization: 78,
};

const stockItems = [
  { id: "ITM-001", sku: "ELC-LPT-001", name: "MacBook Pro 16-inch M3 Max", bin: "A3-12-B4", stock: 12, minStock: 5, status: "OK", statusVariant: "success" as const },
  { id: "ITM-002", sku: "ELC-MON-002", name: 'Dell UltraSharp 27" 4K Monitor', bin: "A3-12-B5", stock: 32, minStock: 10, status: "OK", statusVariant: "success" as const },
  { id: "ITM-003", sku: "ELC-KB-003", name: "Logitech MX Keys Keyboard", bin: "A4-08-A1", stock: 3, minStock: 8, status: "Low Stock", statusVariant: "warning" as const },
  { id: "ITM-004", sku: "ELC-MS-004", name: "Logitech MX Master 3S Mouse", bin: "A4-08-A2", stock: 20, minStock: 10, status: "OK", statusVariant: "success" as const },
  { id: "ITM-008", sku: "SPL-PAP-008", name: "A4 Copy Paper 80gsm (5 reams)", bin: "B1-02-C3", stock: 180, minStock: 50, status: "OK", statusVariant: "success" as const },
  { id: "ITM-009", sku: "SPL-PEN-009", name: "Ballpoint Pen Box (50 pcs)", bin: "B1-02-C4", stock: 35, minStock: 15, status: "OK", statusVariant: "success" as const },
  { id: "ITM-010", sku: "ELC-HDM-010", name: "HDMI Cable 2.1 2m Premium", bin: "A5-03-B1", stock: 50, minStock: 25, status: "OK", statusVariant: "success" as const },
  { id: "ITM-011", sku: "ELC-HED-011", name: "Sony WH-1000XM5 Headphones", bin: "A5-03-B2", stock: 8, minStock: 5, status: "OK", statusVariant: "success" as const },
];

const recentTransfers = [
  { id: "TR-2026-025", from: "WH-SH-01", to: "WH-BJ-01", items: 5, date: "Jun 18, 2026", status: "In Transit", statusVariant: "info" as const },
  { id: "TR-2026-024", from: "WH-SH-02", to: "WH-SH-01", items: 3, date: "Jun 17, 2026", status: "Completed", statusVariant: "success" as const },
  { id: "TR-2026-023", from: "WH-SH-01", to: "WH-GZ-01", items: 8, date: "Jun 15, 2026", status: "Completed", statusVariant: "success" as const },
  { id: "TR-2026-022", from: "WH-BJ-01", to: "WH-SH-01", items: 2, date: "Jun 12, 2026", status: "Completed", statusVariant: "success" as const },
];

export default function WarehouseStockDetailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={warehouse.name}
        description={warehouse.address}
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Stock", href: "/inventory/stock" },
          { label: warehouse.name },
        ]}
        icon={<Warehouse className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/inventory/stock"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
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
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-xl">
              <Package className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Total Stock</p>
          </div>
          <p className="text-2xl font-bold">{warehouse.totalStock.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-info/10 rounded-xl">
              <MapPin className="h-5 w-5 text-info" />
            </div>
            <p className="text-sm text-muted-foreground">Storage Bins</p>
          </div>
          <p className="text-2xl font-bold">{warehouse.bins}</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Info */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Warehouse Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Manager:</span>
                <span className="font-medium">{warehouse.manager}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span>{warehouse.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span>{warehouse.email}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <StatusBadge status={warehouse.status} variant={warehouse.statusVariant} />
              </div>
            </div>
          </div>
        </div>

        {/* Stock Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search stock in this warehouse..."
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
                    <option value="OK">OK</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        Item
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
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
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{item.bin}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">{item.stock}</span>
                        <span className="text-xs text-muted-foreground ml-1">/ {item.minStock} min</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} variant={item.statusVariant} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredItems.length} items
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Recent Transfers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Transfer ID
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Route
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Items
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentTransfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono">{transfer.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {transfer.from} → {transfer.to}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm">{transfer.items} items</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">{transfer.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={transfer.status} variant={transfer.statusVariant} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
