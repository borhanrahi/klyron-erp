"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Package,
  ArrowLeft,
  Edit,
  Trash2,
  Barcode,
  DollarSign,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

const item = {
  id: "ITM-001",
  sku: "ELC-LPT-001",
  name: "MacBook Pro 16-inch M3 Max",
  category: "Electronics",
  description: "Apple MacBook Pro 16-inch with M3 Max chip, 36GB unified memory, 1TB SSD storage. Ideal for engineering and design work.",
  barcode: "8901234567890",
  costPrice: 2800.00,
  sellPrice: 3499.00,
  taxRate: 10,
  unit: "pcs",
  weight: 2.14,
  dimensions: "35.5 × 24.8 × 1.7 cm",
  status: "Active",
  statusVariant: "success" as const,
  totalStock: 24,
  reorderLevel: 10,
  reorderQty: 50,
  createdAt: "Jan 15, 2024",
  updatedAt: "Jun 18, 2026",
};

const warehouseStock = [
  { warehouse: "WH-SH-01", name: "Shanghai Main Warehouse", stock: 12, bin: "A3-12-B4", lastReceived: "Jun 15, 2026" },
  { warehouse: "WH-SH-02", name: "Shanghai Warehouse 2", stock: 6, bin: "C1-08-A2", lastReceived: "Jun 12, 2026" },
  { warehouse: "WH-BJ-01", name: "Beijing Warehouse", stock: 4, bin: "B2-05-C1", lastReceived: "Jun 10, 2026" },
  { warehouse: "WH-GZ-01", name: "Guangzhou Warehouse", stock: 2, bin: "D1-15-A3", lastReceived: "Jun 8, 2026" },
];

const transactions = [
  { id: "TXN-001", type: "Receipt", quantity: 50, date: "Jun 15, 2026", reference: "PO-2026-089", warehouse: "WH-SH-01", by: "Zhang Wei", notes: "Purchase order received" },
  { id: "TXN-002", type: "Issue", quantity: -8, date: "Jun 14, 2026", reference: "SO-2026-142", warehouse: "WH-SH-01", by: "Li Ming", notes: "Sales order fulfillment" },
  { id: "TXN-003", type: "Transfer", quantity: 6, date: "Jun 12, 2026", reference: "TR-2026-023", warehouse: "WH-SH-02", by: "Wang Fang", notes: "Transfer from SH-01 to SH-02" },
  { id: "TXN-004", type: "Adjustment", quantity: -2, date: "Jun 10, 2026", reference: "ADJ-2026-011", warehouse: "WH-BJ-01", by: "Chen Jie", notes: "Damaged in transit" },
  { id: "TXN-005", type: "Issue", quantity: -12, date: "Jun 8, 2026", reference: "SO-2026-138", warehouse: "WH-GZ-01", by: "Liu Yang", notes: "Bulk sales order" },
  { id: "TXN-006", type: "Receipt", quantity: 30, date: "Jun 5, 2026", reference: "PO-2026-085", warehouse: "WH-BJ-01", by: "Zhang Wei", notes: "Restocking" },
  { id: "TXN-007", type: "Issue", quantity: -4, date: "Jun 3, 2026", reference: "SO-2026-135", warehouse: "WH-SH-01", by: "Li Ming", notes: "Customer order" },
  { id: "TXN-008", type: "Adjustment", quantity: 1, date: "Jun 1, 2026", reference: "ADJ-2026-009", warehouse: "WH-SH-02", by: "Wang Fang", notes: "Found during cycle count" },
];

const transactionTypeColor = {
  Receipt: "success",
  Issue: "danger",
  Transfer: "info",
  Adjustment: "warning",
};

export default function ItemDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={item.name}
        description={`SKU: ${item.sku} · ${item.category}`}
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
          <p className="text-2xl font-bold mt-1">{item.totalStock}</p>
          <p className="text-xs text-success mt-1">Across 4 warehouses</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Cost Price</p>
          <p className="text-2xl font-bold mt-1">${item.costPrice.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Per {item.unit}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Selling Price</p>
          <p className="text-2xl font-bold mt-1">${item.sellPrice.toLocaleString()}</p>
          <p className="text-xs text-success mt-1">
            Margin: {((item.sellPrice - item.costPrice) / item.sellPrice * 100).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Stock Value</p>
          <p className="text-2xl font-bold mt-1">
            ${(item.totalStock * item.costPrice).toLocaleString()}
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
                <StatusBadge status={item.status} variant={item.statusVariant} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-mono">{item.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Barcode</span>
                <span className="font-mono flex items-center gap-1">
                  <Barcode className="h-3 w-3" />
                  {item.barcode}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span>{item.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unit</span>
                <span>{item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax Rate</span>
                <span>{item.taxRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weight</span>
                <span>{item.weight} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dimensions</span>
                <span>{item.dimensions}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Reorder Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reorder Level</span>
                <span>{item.reorderLevel} {item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reorder Quantity</span>
                <span>{item.reorderQty} {item.unit}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {item.totalStock <= item.reorderLevel ? (
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
        </div>

        {/* Warehouse Stock & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock by Warehouse */}
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
                      Bin Location
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Stock
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Last Received
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {warehouseStock.map((ws) => (
                    <tr key={ws.warehouse} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{ws.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{ws.warehouse}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{ws.bin}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-semibold ${ws.stock <= 5 ? 'text-danger' : 'text-foreground'}`}>
                          {ws.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{ws.lastReceived}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction History */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Transaction History
              </h3>
              <button className="text-sm text-primary hover:underline flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Type
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Qty
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Reference
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Warehouse
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-sm">{txn.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={txn.type}
                          variant={transactionTypeColor[txn.type as keyof typeof transactionTypeColor] as "success" | "danger" | "info" | "warning"}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium flex items-center gap-1 ${txn.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                          {txn.quantity > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {txn.quantity > 0 ? '+' : ''}{txn.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm font-mono text-muted-foreground">{txn.reference}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground font-mono">{txn.warehouse}</span>
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <span className="text-sm text-muted-foreground">{txn.by}</span>
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
