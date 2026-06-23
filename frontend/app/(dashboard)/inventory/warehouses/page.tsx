"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
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
  Loader2,
} from "lucide-react";

interface ApiWarehouse {
  id: number;
  code: string;
  name: string;
  address: string;
  manager_id: number | null;
  is_active: boolean;
  company_id: number;
  created_at: string;
  deleted_at: string | null;
}

interface StockRecord {
  item_id: number;
  warehouse_id: number;
  quantity: number;
  reserved_qty: number;
}

interface WarehouseRow extends ApiWarehouse {
  totalItems: number;
  totalStock: number;
}

export default function WarehousesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<{ items: ApiWarehouse[] }>("/inventory/warehouses"),
      apiGet<{ items: StockRecord[] }>("/inventory/stock"),
    ])
      .then(([whRes, stockRes]) => {
        const stock = stockRes.items || [];
        const rows: WarehouseRow[] = (whRes.items || []).map((wh) => {
          const whStock = stock.filter((s) => s.warehouse_id === wh.id);
          const totalItems = new Set(whStock.map((s) => s.item_id)).size;
          const totalStock = whStock.reduce((a, s) => a + (s.quantity || 0), 0);
          return { ...wh, totalItems, totalStock };
        });
        setWarehouses(rows);
      })
      .catch(() => setWarehouses([]))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = warehouses.filter((w) => w.is_active).length;
  const totalStockItems = warehouses.reduce((a, w) => a + (w.totalItems || 0), 0);
  const totalStockQty = warehouses.reduce((a, w) => a + (w.totalStock || 0), 0);

  const warehouseStats = [
    { label: "Total Warehouses", value: String(warehouses.length), change: "All operational" },
    { label: "Total Stock Items", value: totalStockItems.toLocaleString(), change: "Across all warehouses" },
    { label: "Total Stock Qty", value: totalStockQty.toLocaleString(), change: "Units in stock" },
    { label: "Active Warehouses", value: String(activeCount), change: `${warehouses.length - activeCount} inactive` },
  ];

  const filteredWarehouses = warehouses.filter((wh) => {
    const term = searchTerm.toLowerCase();
    return (
      wh.name.toLowerCase().includes(term) ||
      wh.code.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

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
                      <span className="truncate max-w-[200px]">{wh.address || "—"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {wh.manager_id ? `User #${wh.manager_id}` : "—"}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1 text-sm">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{(wh.totalStock || 0).toLocaleString()}</span>
                      <span className="text-muted-foreground">({wh.totalItems || 0} items)</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={wh.is_active ? "Active" : "Inactive"}
                      variant={wh.is_active ? "success" : "muted"}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/inventory/warehouses/${wh.id}`)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
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
