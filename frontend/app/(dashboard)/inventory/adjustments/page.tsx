"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiPost } from "@/lib/api";
import {
  RotateCcw,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from "lucide-react";

interface StockAdjustment {
  id: number;
  item_id: number;
  warehouse_id: number;
  type: string | null;
  qty_change: number;
  reason: string | null;
  date: string;
  created_by: number | null;
  created_at: string;
}

interface AdjustmentListResponse {
  items: StockAdjustment[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

interface Item {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
}

const adjustmentTypes = [
  "Damaged",
  "Expired",
  "Lost",
  "Found",
  "Returned",
  "Correction",
  "Counted",
  "Other",
];

function formatAdjustmentType(type: string | null): string {
  if (!type) return "-";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function getAdjustmentVariant(type: string | null) {
  if (!type)   return "info" as const;
  const t = type.toLowerCase();
  if (["returned", "found", "counted"].includes(t)) return "success" as const;
  if (["damaged", "expired", "lost"].includes(t)) return "danger" as const;
  return "warning" as const;
}

export default function InventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [createForm, setCreateForm] = useState({
    item_id: "",
    warehouse_id: "",
    type: "Correction",
    qty_change: "",
    reason: "",
  });
  const [creating, setCreating] = useState(false);

  const fetchAdjustments = async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: p.toString(),
        per_page: "15",
      });
      if (searchTerm) params.append("search", searchTerm);
      const res = await apiGet<AdjustmentListResponse>(
        `/inventory/adjustments?${params}`
      );
      setAdjustments(res.items || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch {
      setAdjustments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const [itemsRes, warehousesRes] = await Promise.all([
        apiGet<{ items: Item[] }>("/inventory/items?per_page=200"),
        apiGet<{ items: Warehouse[] }>("/inventory/warehouses?per_page=200"),
      ]);
      setItems(itemsRes.items || []);
      setWarehouses(warehousesRes.items || []);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchAdjustments(page);
  }, [page]);

  useEffect(() => {
    fetchFormData();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchAdjustments(1);
  };

  const handleCreate = async () => {
    if (!createForm.item_id || !createForm.warehouse_id || !createForm.qty_change) return;
    setCreating(true);
    try {
      await apiPost("/inventory/adjustments", {
        item_id: parseInt(createForm.item_id),
        warehouse_id: parseInt(createForm.warehouse_id),
        type: createForm.type,
        qty_change: parseInt(createForm.qty_change),
        reason: createForm.reason || null,
        date: new Date().toISOString(),
      });
      setShowCreateModal(false);
      setCreateForm({ item_id: "", warehouse_id: "", type: "Correction", qty_change: "", reason: "" });
      fetchAdjustments(page);
    } catch {
      // silent
    } finally {
      setCreating(false);
    }
  };

  const filteredByType =
    selectedType === "All"
      ? adjustments
      : adjustments.filter(
          (a) => (a.type || "").toLowerCase() === selectedType.toLowerCase()
        );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Stock Adjustments"
        description="Track and manage all inventory adjustments, corrections, and write-offs."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Adjustments" },
        ]}
        icon={<RotateCcw className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Adjustment
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Adjustments",
            value: total.toLocaleString(),
            color: "text-foreground",
          },
          {
            label: "Positive",
            value: adjustments.filter((a) => a.qty_change > 0).length.toString(),
            color: "text-green-500",
          },
          {
            label: "Negative",
            value: adjustments.filter((a) => a.qty_change < 0).length.toString(),
            color: "text-red-500",
          },
          {
            label: "This Month",
            value: adjustments.filter((a) => {
              const d = new Date(a.date || a.created_at);
              const now = new Date();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            }).length.toString(),
            color: "text-blue-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search adjustments by reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Type: All</option>
                {adjustmentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Item
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Warehouse
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Qty Change
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Reason
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    Loading adjustments...
                  </td>
                </tr>
              ) : filteredByType.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No adjustments found.
                  </td>
                </tr>
              ) : (
                filteredByType.map((adj) => (
                  <tr
                    key={adj.id}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-muted-foreground">
                        ADJ-{String(adj.id).padStart(4, "0")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">
                        {items.find((i) => i.id === adj.item_id)?.name ||
                          `Item #${adj.item_id}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {warehouses.find((w) => w.id === adj.warehouse_id)
                          ?.name || `WH #${adj.warehouse_id}`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={formatAdjustmentType(adj.type)}
                        variant={getAdjustmentVariant(adj.type)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-semibold ${
                          adj.qty_change > 0
                            ? "text-green-500"
                            : adj.qty_change < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {adj.qty_change > 0 ? "+" : ""}
                        {adj.qty_change}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                        {adj.reason || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(adj.date || adj.created_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredByType.length} of {total} adjustments
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-primary text-white"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Stock Adjustment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Item *
                </label>
                <select
                  value={createForm.item_id}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, item_id: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Select item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Warehouse *
                </label>
                <select
                  value={createForm.warehouse_id}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      warehouse_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({wh.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Type
                </label>
                <select
                  value={createForm.type}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, type: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  {adjustmentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Qty Change *
                </label>
                <input
                  type="number"
                  value={createForm.qty_change}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, qty_change: e.target.value })
                  }
                  placeholder="e.g. -5 or +10"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use negative for decrease, positive for increase
                </p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Reason
                </label>
                <textarea
                  value={createForm.reason}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, reason: e.target.value })
                  }
                  placeholder="Explain why this adjustment is needed..."
                  rows={3}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={
                  creating ||
                  !createForm.item_id ||
                  !createForm.warehouse_id ||
                  !createForm.qty_change
                }
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Adjustment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
