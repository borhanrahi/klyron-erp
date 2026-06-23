"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Warehouse,
  Search,
  ArrowLeft,
  ArrowUpDown,
  Package,
  Loader2,
} from "lucide-react";

interface WarehouseData {
  id: number;
  code: string;
  name: string;
  address: string;
  is_active: boolean;
}

interface StockRecord {
  item_id: number;
  warehouse_id: number;
  quantity: number;
  reserved_qty: number;
  reorder_level: number;
  reorder_qty: number;
}

interface ItemData {
  id: number;
  sku: string;
  name: string;
}

function getStockStatus(qty: number, reorderLevel: number) {
  if (qty === 0) return { label: "Out of Stock", variant: "danger" as const };
  if (qty <= reorderLevel) return { label: "Low Stock", variant: "warning" as const };
  return { label: "OK", variant: "success" as const };
}

export default function WarehouseStockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<WarehouseData | null>(null);
  const [stock, setStock] = useState<StockRecord[]>([]);
  const [items, setItems] = useState<Map<number, ItemData>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const warehouseId = params.warehouseId as string;

  useEffect(() => {
    if (!warehouseId) return;

    Promise.all([
      apiGet<{ data: WarehouseData }>(`/inventory/warehouses/${warehouseId}`),
      apiGet<{ items: StockRecord[] }>(`/inventory/stock`, { warehouse_id: warehouseId }),
      apiGet<{ items: ItemData[] }>("/inventory/items"),
    ])
      .then(([whRes, stockRes, itemsRes]) => {
        setWarehouse(whRes.data);
        setStock(stockRes.items);
        const itemMap = new Map<number, ItemData>();
        for (const item of itemsRes.items) itemMap.set(item.id, item);
        setItems(itemMap);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [warehouseId]);

  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);

  const filteredStock = stock.filter((s) => {
    const item = items.get(s.item_id);
    if (!item) return false;
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
        title={warehouse?.name ?? "Warehouse"}
        description={warehouse?.address ?? ""}
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Stock", href: "/inventory/stock" },
          { label: warehouse?.name ?? "Warehouse" },
        ]}
        icon={<Warehouse className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/inventory/stock"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </div>
          <p className="text-2xl font-bold">{stock.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-xl">
              <Package className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Total Stock</p>
          </div>
          <p className="text-2xl font-bold">{totalStock.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-info/10 rounded-xl">
              <Warehouse className="h-5 w-5 text-info" />
            </div>
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
          <StatusBadge
            status={warehouse?.is_active ? "Active" : "Inactive"}
            variant={warehouse?.is_active ? "success" : "muted"}
          />
        </div>
      </div>

      {/* Stock Items Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stock by item name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Stock
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Reserved
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Reorder Level
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                    No stock records found
                  </td>
                </tr>
              ) : (
                filteredStock.map((s) => {
                  const item = items.get(s.item_id);
                  const status = getStockStatus(s.quantity, s.reorder_level);
                  return (
                    <tr key={s.item_id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{item?.name ?? `Item ${s.item_id}`}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item?.sku ?? "—"}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">{s.quantity}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{s.reserved_qty}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{s.reorder_level}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={status.label} variant={status.variant} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredStock.length} items
          </p>
        </div>
      </div>
    </div>
  );
}
