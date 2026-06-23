"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Package,
  ArrowLeft,
  Edit,
  Trash2,
  Barcode,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface ItemData {
  id: number;
  sku: string;
  name: string;
  category_id: number | null;
  unit: string;
  cost_price: number;
  sell_price: number;
  tax_rate: number;
  barcode: string | null;
  weight: number | null;
  description: string | null;
  is_service: boolean;
  company_id: number;
  created_at: string;
}

interface StockRecord {
  item_id: number;
  warehouse_id: number;
  quantity: number;
  reserved_qty: number;
  reorder_level: number;
  reorder_qty: number;
}

interface WarehouseData {
  id: number;
  code: string;
  name: string;
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ItemData | null>(null);
  const [stock, setStock] = useState<StockRecord[]>([]);
  const [warehouses, setWarehouses] = useState<Map<number, WarehouseData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params.id as string;
    if (!id) return;

    Promise.all([
      apiGet<{ data: ItemData }>(`/inventory/items/${id}`),
      apiGet<{ items: StockRecord[] }>("/inventory/stock"),
      apiGet<{ items: WarehouseData[] }>("/inventory/warehouses"),
    ])
      .then(([itemRes, stockRes, whRes]) => {
        setItem(itemRes.data);
        setStock(stockRes.items.filter((s) => s.item_id === Number(id)));
        const whMap = new Map<number, WarehouseData>();
        for (const wh of whRes.items) whMap.set(wh.id, wh);
        setWarehouses(whMap);
      })
      .catch(() => setError("Failed to load item"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">{error || "Item not found"}</p>
        <button
          onClick={() => router.push("/inventory/items")}
          className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </button>
      </div>
    );
  }

  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
  const reorderLevel = stock.reduce((sum, s) => sum + s.reorder_level, 0);
  const reorderQty = stock.reduce((sum, s) => sum + s.reorder_qty, 0);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={item.name}
        description={`SKU: ${item.sku}`}
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Items", href: "/inventory/items" },
          { label: item.name },
        ]}
        icon={<Package className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/inventory/items"
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
          <p className="text-sm text-muted-foreground">Total Stock</p>
          <p className="text-2xl font-bold mt-1">{totalStock}</p>
          <p className="text-xs text-success mt-1">Across {stock.length} warehouse{stock.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Cost Price</p>
          <p className="text-2xl font-bold mt-1">{fmt.format(item.cost_price)}</p>
          <p className="text-xs text-muted-foreground mt-1">Per {item.unit}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Selling Price</p>
          <p className="text-2xl font-bold mt-1">{fmt.format(item.sell_price)}</p>
          <p className="text-xs text-success mt-1">
            Margin: {item.sell_price > 0 ? ((item.sell_price - item.cost_price) / item.sell_price * 100).toFixed(1) : "0"}%
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Stock Value</p>
          <p className="text-2xl font-bold mt-1">
            {fmt.format(totalStock * item.cost_price)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">At cost</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Item Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={item.is_service ? "Service" : "Active"} variant="success" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-mono">{item.sku}</span>
              </div>
              {item.barcode && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Barcode</span>
                  <span className="font-mono flex items-center gap-1">
                    <Barcode className="h-3 w-3" />
                    {item.barcode}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span>{item.category_id ?? "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unit</span>
                <span>{item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax Rate</span>
                <span>{item.tax_rate}%</span>
              </div>
              {item.weight != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight</span>
                  <span>{item.weight} kg</span>
                </div>
              )}
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{item.description || "—"}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {stock.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Reorder Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reorder Level</span>
                  <span>{reorderLevel} {item.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reorder Quantity</span>
                  <span>{reorderQty} {item.unit}</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    {totalStock <= reorderLevel ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-danger" />
                        <span className="text-sm text-danger font-medium">
                          Stock below reorder level
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm text-success font-medium">
                          Stock level OK
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warehouse Stock */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-primary" />
                Stock by Warehouse
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Warehouse
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Stock
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Reserved
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {stock.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                        No stock records
                      </td>
                    </tr>
                  ) : (
                    stock.map((s) => {
                      const wh = warehouses.get(s.warehouse_id);
                      return (
                        <tr key={s.warehouse_id} className="hover:bg-muted/5 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm font-medium">{wh?.name ?? `Warehouse ${s.warehouse_id}`}</p>
                              <p className="text-xs text-muted-foreground font-mono">{wh?.code ?? `ID: ${s.warehouse_id}`}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-sm font-semibold ${s.quantity <= s.reorder_level ? "text-danger" : "text-foreground"}`}>
                              {s.quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-muted-foreground">{s.reserved_qty}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
