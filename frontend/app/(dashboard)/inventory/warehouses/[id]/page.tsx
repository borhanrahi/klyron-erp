"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Warehouse,
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Package,
  Clock,
  Loader2,
} from "lucide-react";

interface WarehouseData {
  id: number;
  code: string;
  name: string;
  address: string;
  manager_id: number | null;
  is_active: boolean;
  company_id: number;
  created_at: string;
}

interface StockRecord {
  item_id: number;
  warehouse_id: number;
  quantity: number;
}

interface ItemData {
  id: number;
  sku: string;
  name: string;
}

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<WarehouseData | null>(null);
  const [stock, setStock] = useState<StockRecord[]>([]);
  const [items, setItems] = useState<Map<number, ItemData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = params.id as string;

  useEffect(() => {
    if (!id) return;

    Promise.all([
      apiGet<{ data: WarehouseData }>(`/inventory/warehouses/${id}`),
      apiGet<{ items: StockRecord[] }>(`/inventory/stock`, { warehouse_id: id }),
      apiGet<{ items: ItemData[] }>("/inventory/items"),
    ])
      .then(([whRes, stockRes, itemsRes]) => {
        setWarehouse(whRes.data);
        setStock(stockRes.items);
        const itemMap = new Map<number, ItemData>();
        for (const item of itemsRes.items) itemMap.set(item.id, item);
        setItems(itemMap);
      })
      .catch(() => setError("Failed to load warehouse"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">{error || "Warehouse not found"}</p>
        <button
          onClick={() => router.push("/inventory/warehouses")}
          className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Warehouses
        </button>
      </div>
    );
  }

  const totalItems = stock.length;
  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);

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
          <p className="text-2xl font-bold">{totalItems}</p>
          <p className="text-xs text-success mt-1">{totalStock.toLocaleString()} units</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-xl">
              <Warehouse className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
          <StatusBadge
            status={warehouse.is_active ? "Active" : "Inactive"}
            variant={warehouse.is_active ? "success" : "muted"}
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-info/10 rounded-xl">
              <MapPin className="h-5 w-5 text-info" />
            </div>
            <p className="text-sm text-muted-foreground">Location</p>
          </div>
          <p className="text-sm font-medium truncate">{warehouse.address}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-warning/10 rounded-xl">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <p className="text-sm text-muted-foreground">Created</p>
          </div>
          <p className="text-sm font-medium">{new Date(warehouse.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Info */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Warehouse Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{warehouse.address}</span>
              </div>
              {warehouse.manager_id && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">Manager ID:</span>
                  <span>{warehouse.manager_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock Items */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Stock Items
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Item
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {stock.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-6 text-center text-sm text-muted-foreground">
                        No stock records
                      </td>
                    </tr>
                  ) : (
                    stock.map((s) => {
                      const item = items.get(s.item_id);
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
