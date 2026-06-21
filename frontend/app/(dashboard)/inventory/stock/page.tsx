"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { KPICard } from "@/components/common/KPICard";
import {
  BarChart3,
  Search,
  Filter,
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  Warehouse,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const stockOverview = [
  {
    id: "ITM-001",
    sku: "ELC-LPT-001",
    name: "MacBook Pro 16-inch M3 Max",
    category: "Electronics",
    warehouses: { "WH-SH-01": 12, "WH-SH-02": 6, "WH-BJ-01": 4, "WH-GZ-01": 2 },
    totalStock: 24,
    reorderLevel: 10,
    status: "OK",
    statusVariant: "success" as const,
    trend: "up",
    value: 67200,
  },
  {
    id: "ITM-002",
    sku: "ELC-MON-002",
    name: 'Dell UltraSharp 27" 4K Monitor',
    category: "Electronics",
    warehouses: { "WH-SH-01": 32, "WH-SH-02": 14, "WH-BJ-01": 6, "WH-GZ-01": 4 },
    totalStock: 56,
    reorderLevel: 20,
    status: "OK",
    statusVariant: "success" as const,
    trend: "up",
    value: 23520,
  },
  {
    id: "ITM-003",
    sku: "ELC-KB-003",
    name: "Logitech MX Keys Keyboard",
    category: "Electronics",
    warehouses: { "WH-SH-01": 3, "WH-SH-02": 2, "WH-BJ-01": 2, "WH-GZ-01": 1 },
    totalStock: 8,
    reorderLevel: 15,
    status: "Low Stock",
    statusVariant: "warning" as const,
    trend: "down",
    value: 576,
  },
  {
    id: "ITM-004",
    sku: "ELC-MS-004",
    name: "Logitech MX Master 3S Mouse",
    category: "Electronics",
    warehouses: { "WH-SH-01": 20, "WH-SH-02": 12, "WH-BJ-01": 6, "WH-GZ-01": 4 },
    totalStock: 42,
    reorderLevel: 15,
    status: "OK",
    statusVariant: "success" as const,
    trend: "up",
    value: 2436,
  },
  {
    id: "ITM-005",
    sku: "OFS-CHR-005",
    name: "Herman Miller Aeron Chair",
    category: "Office Furniture",
    warehouses: { "WH-SH-01": 0, "WH-SH-02": 0, "WH-BJ-01": 2, "WH-GZ-01": 1 },
    totalStock: 3,
    reorderLevel: 5,
    status: "Low Stock",
    statusVariant: "warning" as const,
    trend: "down",
    value: 2670,
  },
  {
    id: "ITM-007",
    sku: "ELC-USB-007",
    name: "USB-C Hub 7-in-1 Adapter",
    category: "Electronics",
    warehouses: { "WH-SH-01": 0, "WH-SH-02": 0, "WH-BJ-01": 0, "WH-GZ-01": 0 },
    totalStock: 0,
    reorderLevel: 20,
    status: "Out of Stock",
    statusVariant: "danger" as const,
    trend: "down",
    value: 0,
  },
  {
    id: "ITM-008",
    sku: "SPL-PAP-008",
    name: "A4 Copy Paper 80gsm (5 reams)",
    category: "Office Supplies",
    warehouses: { "WH-SH-01": 180, "WH-SH-02": 80, "WH-BJ-01": 40, "WH-GZ-01": 20 },
    totalStock: 320,
    reorderLevel: 100,
    status: "OK",
    statusVariant: "success" as const,
    trend: "up",
    value: 8000,
  },
  {
    id: "ITM-009",
    sku: "SPL-PEN-009",
    name: "Ballpoint Pen Box (50 pcs)",
    category: "Office Supplies",
    warehouses: { "WH-SH-01": 35, "WH-SH-02": 25, "WH-BJ-01": 15, "WH-GZ-01": 10 },
    totalStock: 85,
    reorderLevel: 30,
    status: "OK",
    statusVariant: "success" as const,
    trend: "up",
    value: 1572,
  },
  {
    id: "ITM-010",
    sku: "ELC-HDM-010",
    name: "HDMI Cable 2.1 2m Premium",
    category: "Electronics",
    warehouses: { "WH-SH-01": 50, "WH-SH-02": 30, "WH-BJ-01": 25, "WH-GZ-01": 15 },
    totalStock: 120,
    reorderLevel: 50,
    status: "OK",
    statusVariant: "success" as const,
    trend: "up",
    value: 3600,
  },
  {
    id: "ITM-012",
    sku: "SPL-FOL-012",
    name: "Lever Arch File (12 pack)",
    category: "Office Supplies",
    warehouses: { "WH-SH-01": 0, "WH-SH-02": 0, "WH-BJ-01": 0, "WH-GZ-01": 0 },
    totalStock: 0,
    reorderLevel: 25,
    status: "Out of Stock",
    statusVariant: "danger" as const,
    trend: "down",
    value: 0,
  },
];

const alerts = [
  { id: "ITM-007", name: "USB-C Hub 7-in-1 Adapter", status: "Out of Stock", severity: "danger" as const, daysEmpty: 14 },
  { id: "ITM-012", name: "Lever Arch File (12 pack)", status: "Out of Stock", severity: "danger" as const, daysEmpty: 7 },
  { id: "ITM-003", name: "Logitech MX Keys Keyboard", status: "Low Stock", severity: "warning" as const, daysEmpty: 0 },
  { id: "ITM-005", name: "Herman Miller Aeron Chair", status: "Low Stock", severity: "warning" as const, daysEmpty: 0 },
];

export default function StockOverviewPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredStock = stockOverview.filter((item) => {
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
        title="Stock Overview"
        description="Monitor stock levels across all warehouses and receive alerts."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Stock" },
        ]}
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Stock Report
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          label="Total Stock Value"
          value="$109,574"
          change="+8.2% from last month"
          changeType="up"
          icon={<Package className="h-5 w-5" />}
          color="primary"
        />
        <KPICard
          label="Total Items"
          value="1,248"
          change="+24 this month"
          changeType="up"
          icon={<Package className="h-5 w-5" />}
          color="success"
        />
        <KPICard
          label="Low Stock Alerts"
          value="4"
          change="+2 new alerts"
          changeType="down"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="warning"
        />
        <KPICard
          label="Warehouses"
          value="4"
          change="All operational"
          changeType="neutral"
          icon={<Warehouse className="h-5 w-5" />}
          color="accent"
        />
      </div>

      {/* Low Stock Alerts */}
      <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-warning">
          <AlertTriangle className="h-5 w-5" />
          Stock Alerts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">{alert.id}</span>
                <StatusBadge status={alert.status} variant={alert.severity} />
              </div>
              <p className="text-sm font-medium truncate">{alert.name}</p>
              {alert.daysEmpty > 0 && (
                <p className="text-xs text-danger mt-1">
                  Empty for {alert.daysEmpty} days
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stock items..."
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
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
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
                  Category
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  WH-SH-01
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  WH-SH-02
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  WH-BJ-01
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  WH-GZ-01
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Total
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell text-right">
                    <span className={`text-sm font-medium ${item.warehouses["WH-SH-01"] === 0 ? 'text-danger' : ''}`}>
                      {item.warehouses["WH-SH-01"]}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell text-right">
                    <span className={`text-sm font-medium ${item.warehouses["WH-SH-02"] === 0 ? 'text-danger' : ''}`}>
                      {item.warehouses["WH-SH-02"]}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell text-right">
                    <span className={`text-sm font-medium ${item.warehouses["WH-BJ-01"] === 0 ? 'text-danger' : ''}`}>
                      {item.warehouses["WH-BJ-01"]}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell text-right">
                    <span className={`text-sm font-medium ${item.warehouses["WH-GZ-01"] === 0 ? 'text-danger' : ''}`}>
                      {item.warehouses["WH-GZ-01"]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-semibold ${item.totalStock <= item.reorderLevel ? 'text-warning' : ''}`}>
                      {item.totalStock}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      / {item.reorderLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} variant={item.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right hidden xl:table-cell">
                    <span className="text-sm font-medium">
                      ${item.value.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredStock.length} of {stockOverview.length} items
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
