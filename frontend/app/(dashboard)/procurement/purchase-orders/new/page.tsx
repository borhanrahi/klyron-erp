"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import {
  Save,
  X,
  Plus,
  Trash2,
  Package,
  Building2,
  Truck,
  CreditCard,
} from "lucide-react";

interface Supplier {
  id: number;
  name: string;
}

interface POItem {
  item_id: number;
  qty: number;
  unit_price: number;
  tax: number;
  total: number;
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  const [formData, setFormData] = useState({
    po_number: "",
    supplier_id: "",
    pr_id: "",
    delivery_date: "",
    terms: "Net 30",
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const [items, setItems] = useState<POItem[]>([
    { item_id: 0, qty: 1, unit_price: 0, tax: 0, total: 0 },
  ]);

  useEffect(() => {
    setLoadingSuppliers(true);
    apiGet<{ items: Supplier[] }>("/procurement/suppliers")
      .then((res) => setSuppliers(res.items))
      .catch(() => setSuppliers([]))
      .finally(() => setLoadingSuppliers(false));
  }, []);

  const addItem = () => {
    setItems([...items, { item_id: 0, qty: 1, unit_price: 0, tax: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof POItem, value: number) => {
    setItems(
      items.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.qty * updated.unit_price + updated.tax;
        return updated;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unit_price, 0);
    const tax = items.reduce((sum, item) => sum + item.tax, 0);
    return { subtotal, tax, total: subtotal + tax };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.po_number || !formData.supplier_id) {
      alert("PO Number and Supplier are required.");
      return;
    }
    setSubmitting(true);
    try {
      await apiPost("/procurement/orders", {
        po_number: formData.po_number,
        supplier_id: Number(formData.supplier_id),
        pr_id: formData.pr_id ? Number(formData.pr_id) : null,
        status: "draft",
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        delivery_date: formData.delivery_date,
        terms: formData.terms,
        items: items.map((item) => ({
          item_id: item.item_id,
          qty: item.qty,
          unit_price: item.unit_price,
          tax: item.tax,
          total: item.total,
        })),
      });
      router.push("/procurement/purchase-orders");
    } catch {
      alert("Failed to create purchase order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Purchase Order"
        description="Generate a new purchase order"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders", href: "/procurement/purchase-orders" },
          { label: "New PO" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/procurement/purchase-orders")}
              className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {submitting ? "Creating..." : "Create PO"}
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Purchase Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PO Number *
              </label>
              <input
                type="text"
                required
                value={formData.po_number}
                onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., PO-2026-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Supplier *
              </label>
              <select
                required
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{loadingSuppliers ? "Loading..." : "Select supplier"}</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PR Reference
              </label>
              <input
                type="number"
                value={formData.pr_id}
                onChange={(e) => setFormData({ ...formData, pr_id: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="PR ID"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Terms
              </label>
              <select
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="bg-primary text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                    Item ID
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-24">
                    Qty
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-32">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-32">
                    Tax
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-32">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="1"
                        value={item.item_id || ""}
                        onChange={(e) => updateItem(index, "item_id", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Item ID"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(index, "qty", parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.tax}
                        onChange={(e) => updateItem(index, "tax", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      ${item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td colSpan={4} className="py-3 px-4 text-right font-medium text-foreground">
                    Subtotal:
                  </td>
                  <td className="py-3 px-4 font-bold text-lg text-foreground">
                    ${totals.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
                <tr className="border-t border-border">
                  <td colSpan={4} className="py-3 px-4 text-right font-medium text-foreground">
                    Tax:
                  </td>
                  <td className="py-3 px-4 font-bold text-lg text-foreground">
                    ${totals.tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
                <tr className="border-t border-border">
                  <td colSpan={4} className="py-3 px-4 text-right font-bold text-foreground">
                    Total:
                  </td>
                  <td className="py-3 px-4 font-bold text-xl text-foreground">
                    ${totals.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}
