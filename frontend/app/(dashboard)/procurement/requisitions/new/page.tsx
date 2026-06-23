"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiPost } from "@/lib/api";
import { Save, X, Plus, Trash2, Package, FileText, Loader2 } from "lucide-react";

interface LineItem {
  item_id: number;
  qty: number;
  estimated_price: number;
  notes: string;
}

export default function NewRequisitionPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pr_number: "",
    department_id: "",
    priority: "normal",
    total_estimated: 0,
    notes: "",
  });

  const [items, setItems] = useState<LineItem[]>([
    { item_id: 0, qty: 1, estimated_price: 0, notes: "" },
  ]);

  const addItem = () => {
    setItems([...items, { item_id: 0, qty: 1, estimated_price: 0, notes: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const totalEstimated = items.reduce((sum, item) => sum + item.qty * item.estimated_price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiPost("/procurement/requisitions", {
        pr_number: formData.pr_number,
        department_id: formData.department_id ? Number(formData.department_id) : null,
        priority: formData.priority,
        total_estimated: totalEstimated,
        notes: formData.notes,
        status: "draft",
        items: items.map((item) => ({
          item_id: item.item_id,
          qty: item.qty,
          estimated_price: item.estimated_price,
          notes: item.notes,
        })),
      });
      router.push("/procurement/requisitions");
    } catch {
      alert("Failed to create requisition.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Purchase Requisition"
        description="Create a new purchase request for approval"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Requisitions", href: "/procurement/requisitions" },
          { label: "New Requisition" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/procurement/requisitions")}
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
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Submit for Approval
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Requisition Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PR Number *
              </label>
              <input
                type="text"
                required
                value={formData.pr_number}
                onChange={(e) => setFormData({ ...formData, pr_number: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. PR-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department ID
              </label>
              <input
                type="number"
                min="0"
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Department ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter any notes or justification..."
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Package className="h-5 w-5" />
              Requested Items
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
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Item ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-24">Qty</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-36">Est. Price</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Notes</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-36">Total</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={item.item_id}
                        onChange={(e) => updateItem(index, "item_id", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                        value={item.estimated_price}
                        onChange={(e) => updateItem(index, "estimated_price", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateItem(index, "notes", e.target.value)}
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Notes"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      ${(item.qty * item.estimated_price).toFixed(2)}
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
                    Total Estimated Cost:
                  </td>
                  <td className="py-3 px-4 font-bold text-lg text-foreground">
                    ${totalEstimated.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
