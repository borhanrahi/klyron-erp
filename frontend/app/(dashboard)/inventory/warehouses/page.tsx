"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Warehouse,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MapPin,
  Users,
  Package,
} from "lucide-react";

const warehouses = [
  {
    id: "WH-SH-01",
    code: "SH-01",
    name: "Shanghai Main Warehouse",
    address: "No. 88 Zhangyang Road, Pudong, Shanghai",
    manager: "Zhang Wei",
    phone: "+86 21 5888 9999",
    totalItems: 456,
    totalStock: 2340,
    bins: 120,
    utilization: 78,
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    id: "WH-SH-02",
    code: "SH-02",
    name: "Shanghai Warehouse 2",
    address: "No. 156 Huqingping Road, Qingpu, Shanghai",
    manager: "Wang Fang",
    phone: "+86 21 6777 8888",
    totalItems: 312,
    totalStock: 1580,
    bins: 80,
    utilization: 65,
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    id: "WH-BJ-01",
    code: "BJ-01",
    name: "Beijing Warehouse",
    address: "No. 200 Jinggang'ao Road, Daxing, Beijing",
    manager: "Chen Jie",
    phone: "+86 10 8999 7777",
    totalItems: 284,
    totalStock: 1220,
    bins: 60,
    utilization: 52,
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    id: "WH-GZ-01",
    code: "GZ-01",
    name: "Guangzhou Warehouse",
    address: "No. 88 Huangpu Avenue, Tianhe, Guangzhou",
    manager: "Liu Yang",
    phone: "+86 20 3666 5555",
    totalItems: 198,
    totalStock: 860,
    bins: 40,
    utilization: 42,
    status: "Active",
    statusVariant: "success" as const,
  },
];

const warehouseStats = [
  { label: "Total Warehouses", value: "4", change: "All operational" },
  { label: "Total Stock Items", value: "1,250", change: "+124 this month" },
  { label: "Total Stock Value", value: "$2.4M", change: "+8.5% from last month" },
  { label: "Avg Utilization", value: "59%", change: "Healthy" },
];

export default function WarehousesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWarehouses = warehouses.filter((wh) => {
    return (
      wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations, stock bins, and storage."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Warehouses" },
        ]}
        icon={<Warehouse className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <a
              href="/inventory/warehouses/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Warehouse
            </a>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {warehouseStats.map((stat) => (
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

      {/* Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Warehouse
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Address
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Manager
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Items
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Utilization
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredWarehouses.map((wh) => (
                <tr key={wh.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Warehouse className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{wh.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{wh.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">{wh.address}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {wh.manager}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-sm">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{wh.totalStock.toLocaleString()}</span>
                      <span className="text-muted-foreground">({wh.totalItems} items)</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            wh.utilization > 80 ? 'bg-danger' : wh.utilization > 60 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${wh.utilization}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{wh.utilization}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={wh.status} variant={wh.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/inventory/warehouses/${wh.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
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

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredWarehouses.length} of {warehouses.length} warehouses
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
    </div>
  );
}
