"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { KPICard } from "@/components/common/KPICard";
import { apiGet } from "@/lib/api";
import {
  BarChart3,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Package,
  Warehouse,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface StockRecord {
  item_id: number;
  warehouse_id: number;
  quantity: number;
  reserved_qty: number;
  reorder_level: number;
  reorder_qty: number;
  id: number;
  company_id: number;
  created_at: string;
}

interface Item {
  id: number;
  sku: string;
  name: string;
  category_id: number | null;
  cost_price: number;
  sell_price: number;
}

interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string;
  is_active: boolean;
}

interface StockRow {
  stock: StockRecord;
  item: Item | undefined;
  warehouse: Warehouse | undefined;
  available: number;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
  value: number;
}

const statusVariantMap: Record<string, StockRow["statusVariant"]> = {
  OK: "success",
  "Low Stock": "warning",
  "Out of Stock": "danger",
};

function computeStatus(quantity: number, reorderLevel: number): string {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= (reorderLevel || 0)) return "Low Stock";
  return "OK";
}

export default function StockOverviewPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<{ items: StockRecord[] }>("/inventory/stock"),
      apiGet<{ items: Item[] }>("/inventory/items"),
      apiGet<{ items: Warehouse[] }>("/inventory/warehouses"),
    ])
      .then(([stockRes, itemsRes, warehousesRes]) => {
        const itemsMap = new Map((itemsRes.items || []).map((i) => [i.id, i]));
        const warehousesMap = new Map((warehousesRes.items || []).map((w) => [w.id, w]));

        const mapped: StockRow[] = (stockRes.items || []).map((s) => {
          const item = itemsMap.get(s.item_id);
          const warehouse = warehousesMap.get(s.warehouse_id);
          const available = (s.quantity || 0) - (s.reserved_qty || 0);
          const status = computeStatus(s.quantity || 0, s.reorder_level || 0);
          const value = (s.quantity || 0) * ((item?.sell_price) || 0);

          return {
            stock: s,
            item,
            warehouse,
            available,
            status,
            statusVariant: statusVariantMap[status] || "info",
            value,
          };
        });

        setRows(mapped);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredRows = rows.filter((r) => {
    const itemName = r.item?.name || "";
    const itemSku = r.item?.sku || "";
    const matchesSearch =
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemSku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalValue = rows.reduce((a, r) => a + (r.value || 0), 0);
  const totalStockQty = rows.reduce((a, r) => a + (r.stock.quantity || 0), 0);
  const uniqueItems = new Set(rows.map((r) => r.stock.item_id)).size;
  const alerts = rows.filter((r) => r.status === "Out of Stock" || r.status === "Low Stock");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          value={`$${totalValue.toLocaleString()}`}
          icon={<Package className="h-5 w-5" />}
          color="primary"
        />
        <KPICard
          label="Total Stock Qty"
          value={totalStockQty.toLocaleString()}
          icon={<Package className="h-5 w-5" />}
          color="success"
        />
        <KPICard
          label="Low Stock Alerts"
          value={String(alerts.length)}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="warning"
        />
        <KPICard
          label="Unique Items"
          value={String(uniqueItems)}
          icon={<Warehouse className="h-5 w-5" />}
          color="accent"
        />
      </div>

      {/* Low Stock Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Stock Alerts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {alerts.map((r) => (
              <div
                key={r.stock.id}
                className="p-3 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{r.item?.sku || "N/A"}</span>
                  <StatusBadge status={r.status} variant={r.statusVariant} />
                </div>
                <p className="text-sm font-medium truncate">{r.item?.name || "Unknown Item"}</p>
                {r.status === "Out of Stock" && (
                  <p className="text-xs text-danger mt-1">Out of stock</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
                  Warehouse
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Qty
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden sm:table-cell">
                  Reserved
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Reorder
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Available
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredRows.map((r) => (
                <tr key={r.stock.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{r.item?.name || "Unknown Item"}</p>
                      <p className="text-xs text-muted-foreground font-mono">{r.item?.sku || "N/A"}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{r.warehouse?.name || "N/A"}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${r.stock.quantity === 0 ? 'text-danger' : ''}`}>
                      {(r.stock.quantity || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {(r.stock.reserved_qty || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {(r.stock.reorder_level || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-semibold ${r.available <= 0 ? 'text-danger' : r.stock.quantity <= (r.stock.reorder_level || 0) ? 'text-warning' : ''}`}>
                      {r.available.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={r.status} variant={r.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <span className="text-sm font-medium">
                      ${(r.value || 0).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRows.length} of {rows.length} items
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
