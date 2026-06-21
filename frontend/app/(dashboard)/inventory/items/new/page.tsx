"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Package,
  Save,
  ArrowLeft,
  Upload,
  Barcode,
  DollarSign,
  Hash,
  Tag,
  Warehouse,
} from "lucide-react";

export default function NewItemPage() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    description: "",
    costPrice: "",
    sellPrice: "",
    taxRate: "",
    initialStock: "",
    reorderLevel: "",
    reorderQuantity: "",
    warehouse: "",
    unit: "pcs",
    weight: "",
    dimensions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Add New Item"
        description="Create a new inventory item with details and stock information."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Items", href: "/inventory/items" },
          { label: "New Item" },
        ]}
        icon={<Package className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/inventory/items"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </a>
        }
      />

      <form className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. MacBook Pro 16-inch M3 Max"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                SKU *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. ELC-LPT-001"
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Barcode / UPC
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="e.g. 8901234567890"
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors flex items-center gap-1"
                >
                  <Barcode className="h-4 w-4" />
                  Scan
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Office Furniture">Office Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="IT Accessories">IT Accessories</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Item description..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Cost Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Selling Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  name="sellPrice"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                placeholder="0"
                step="0.1"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          {formData.costPrice && formData.sellPrice && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Margin:{" "}
                <span className="text-success font-medium">
                  {((Number(formData.sellPrice) - Number(formData.costPrice)) / Number(formData.sellPrice) * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Stock & Warehouse */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-primary" />
            Stock & Warehouse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Initial Stock Quantity
              </label>
              <input
                type="number"
                name="initialStock"
                value={formData.initialStock}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Default Warehouse *
              </label>
              <select
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              >
                <option value="">Select warehouse</option>
                <option value="WH-SH-01">Shanghai Warehouse</option>
                <option value="WH-SH-02">Shanghai Warehouse 2</option>
                <option value="WH-BJ-01">Beijing Warehouse</option>
                <option value="WH-GZ-01">Guangzhou Warehouse</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Reorder Level
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                placeholder="Minimum stock before reorder"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Reorder Quantity
              </label>
              <input
                type="number"
                name="reorderQuantity"
                value={formData.reorderQuantity}
                onChange={handleChange}
                placeholder="Quantity to reorder"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="box">Boxes (box)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="set">Sets (set)</option>
                <option value="pack">Packs (pack)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Physical Attributes */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" />
            Physical Attributes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Dimensions (L × W × H cm)
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g. 40 × 30 × 5"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Product Image
              </label>
              <div className="flex items-center justify-center w-full h-[42px] bg-muted border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <a
            href="/inventory/items"
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}
