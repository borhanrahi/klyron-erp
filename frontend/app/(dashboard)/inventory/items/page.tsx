"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Package,
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
} from "lucide-react";

const items = [
  {
    id: "ITM-001",
    sku: "ELC-LPT-001",
    name: "MacBook Pro 16-inch M3 Max",
    category: "Electronics",
    stock: 24,
    minStock: 10,
    price: 3499.00,
    cost: 2800.00,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-SH-01",
    barcode: "8901234567890",
  },
  {
    id: "ITM-002",
    sku: "ELC-MON-002",
    name: 'Dell UltraSharp 27" 4K Monitor',
    category: "Electronics",
    stock: 56,
    minStock: 20,
    price: 649.99,
    cost: 420.00,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-SH-01",
    barcode: "8901234567891",
  },
  {
    id: "ITM-003",
    sku: "ELC-KB-003",
    name: "Logitech MX Keys Keyboard",
    category: "Electronics",
    stock: 8,
    minStock: 15,
    price: 119.99,
    cost: 72.00,
    status: "Low Stock",
    statusVariant: "warning" as const,
    warehouse: "WH-SH-02",
    barcode: "8901234567892",
  },
  {
    id: "ITM-004",
    sku: "ELC-MS-004",
    name: "Logitech MX Master 3S Mouse",
    category: "Electronics",
    stock: 42,
    minStock: 15,
    price: 99.99,
    cost: 58.00,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-SH-01",
    barcode: "8901234567893",
  },
  {
    id: "ITM-005",
    sku: "OFS-CHR-005",
    name: "Herman Miller Aeron Chair",
    category: "Office Furniture",
    stock: 3,
    minStock: 5,
    price: 1395.00,
    cost: 890.00,
    status: "Low Stock",
    statusVariant: "warning" as const,
    warehouse: "WH-BJ-01",
    barcode: "8901234567894",
  },
  {
    id: "ITM-006",
    sku: "OFS-DSK-006",
    name: "Standing Desk Electric Adjustable",
    category: "Office Furniture",
    stock: 15,
    minStock: 8,
    price: 599.00,
    cost: 320.00,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-BJ-01",
    barcode: "8901234567895",
  },
  {
    id: "ITM-007",
    sku: "ELC-USB-007",
    name: "USB-C Hub 7-in-1 Adapter",
    category: "Electronics",
    stock: 0,
    minStock: 20,
    price: 49.99,
    cost: 22.00,
    status: "Out of Stock",
    statusVariant: "danger" as const,
    warehouse: "WH-SH-02",
    barcode: "8901234567896",
  },
  {
    id: "ITM-008",
    sku: "SPL-PAP-008",
    name: "A4 Copy Paper 80gsm (5 reams)",
    category: "Office Supplies",
    stock: 320,
    minStock: 100,
    price: 24.99,
    cost: 15.00,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-SH-01",
    barcode: "8901234567897",
  },
  {
    id: "ITM-009",
    sku: "SPL-PEN-009",
    name: "Ballpoint Pen Box (50 pcs)",
    category: "Office Supplies",
    stock: 85,
    minStock: 30,
    price: 18.50,
    cost: 9.50,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-SH-02",
    barcode: "8901234567898",
  },
  {
    id: "ITM-010",
    sku: "ELC-HDM-010",
    name: "HDMI Cable 2.1 2m Premium",
    category: "Electronics",
    stock: 120,
    minStock: 50,
    price: 29.99,
    cost: 12.00,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-BJ-01",
    barcode: "8901234567899",
  },
  {
    id: "ITM-011",
    sku: "ELC-HED-011",
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    stock: 18,
    minStock: 10,
    price: 349.99,
    cost: 220.00,
    status: "In Stock",
    statusVariant: "success" as const,
    warehouse: "WH-SH-01",
    barcode: "8901234567900",
  },
  {
    id: "ITM-012",
    sku: "SPL-FOL-012",
    name: "Lever Arch File (12 pack)",
    category: "Office Supplies",
    stock: 0,
    minStock: 25,
    price: 32.00,
    cost: 18.00,
    status: "Out of Stock",
    statusVariant: "danger" as const,
    warehouse: "WH-BJ-01",
    barcode: "8901234567901",
  },
];

const itemStats = [
  { label: "Total Items", value: "1,248", change: "+24 this month" },
  { label: "In Stock", value: "1,186", change: "95.0%" },
  { label: "Low Stock", value: "42", change: "3.4%" },
  { label: "Out of Stock", value: "20", change: "1.6%" },
];

export default function InventoryItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Inventory Items"
        description="Manage all product items, stock levels, and pricing."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Items" },
        ]}
        icon={<Package className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <a
              href="/inventory/items/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </a>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {itemStats.map((stat) => (
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

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items by name, SKU, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Category: All</option>
                <option value="Electronics">Electronics</option>
                <option value="Office Furniture">Office Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
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
                    Item
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  SKU
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Stock
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Price
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
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm font-mono text-muted-foreground">
                      {item.sku}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{item.stock}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      / {item.minStock} min
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm font-medium">
                      ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={item.status}
                      variant={item.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/inventory/items/${item.id}`}
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

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {items.length} items
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              2
            </button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              3
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
