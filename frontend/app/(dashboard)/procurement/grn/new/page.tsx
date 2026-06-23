"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { Package, ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";

interface POOption {
  id: number;
  po_number: string;
  supplier_id?: number;
}

interface GRNItemRow {
  po_item_id: number;
  received_qty: number;
  accepted_qty: number;
  rejected_qty: number;
  reason: string;
}

export default function NewGRNPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [pos, setPOs] = useState<POOption[]>([]);

  const [formData, setFormData] = useState({
    grn_number: "",
    po_id: "",
    status: "draft",
    warehouse_id: "",
    notes: "",
  });

  const [items, setItems] = useState<GRNItemRow[]>([
    { po_item_id: 0, received_qty: 0, accepted_qty: 0, rejected_qty: 0, reason: "" },
  ]);

  useEffect(() => {
    apiGet<{ items: POOption[] }>("/procurement/orders")
      .then((res) => setPOs(res.items || []))
      .catch(() => {});
  }, []);

  function updateItem(index: number, field: keyof GRNItemRow, value: string | number) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { po_item_id: 0, received_qty: 0, accepted_qty: 0, rejected_qty: 0, reason: "" }]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiPost("/procurement/grn", {
        grn_number: formData.grn_number,
        po_id: formData.po_id ? Number(formData.po_id) : null,
        status: formData.status,
        warehouse_id: formData.warehouse_id ? Number(formData.warehouse_id) : null,
        notes: formData.notes || null,
        items: items.filter((i) => i.po_item_id > 0).map((i) => ({
          po_item_id: i.po_item_id,
          received_qty: i.received_qty,
          accepted_qty: i.accepted_qty,
          rejected_qty: i.rejected_qty,
          reason: i.reason || null,
        })),
      });
      router.push("/procurement/grn");
    } catch {
      alert("Failed to create GRN");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/procurement/grn")}>GRN</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">New GRN</span>
      </div>

      <PageHeader
        title="Create Goods Received Note"
        description="Record goods received against a purchase order."
        icon={<Package className="h-6 w-6 text-primary" />}
        actions={
          <button onClick={() => router.push("/procurement/grn")} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">GRN Number *</label>
              <input required type="text" value={formData.grn_number} onChange={(e) => setFormData({ ...formData, grn_number: e.target.value })} placeholder="GRN-001" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Order</label>
              <select value={formData.po_id} onChange={(e) => setFormData({ ...formData, po_id: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select PO...</option>
                {pos.map((po) => (
                  <option key={po.id} value={po.id}>{po.po_number}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="draft">Draft</option>
                <option value="received">Received</option>
                <option value="partial">Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Warehouse ID</label>
              <input type="number" value={formData.warehouse_id} onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })} placeholder="Warehouse ID" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Items</h3>
            <button type="button" onClick={addItem} className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"><Plus className="h-4 w-4" /> Add Item</button>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-muted rounded-xl items-end">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">PO Item ID</label>
                <input type="number" value={item.po_item_id || ""} onChange={(e) => updateItem(idx, "po_item_id", Number(e.target.value))} className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Received</label>
                <input type="number" value={item.received_qty} onChange={(e) => updateItem(idx, "received_qty", Number(e.target.value))} className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Accepted</label>
                <input type="number" value={item.accepted_qty} onChange={(e) => updateItem(idx, "accepted_qty", Number(e.target.value))} className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Rejected</label>
                <input type="number" value={item.rejected_qty} onChange={(e) => updateItem(idx, "rejected_qty", Number(e.target.value))} className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm" />
              </div>
              <div className="flex items-end gap-1">
                <input type="text" value={item.reason} onChange={(e) => updateItem(idx, "reason", e.target.value)} placeholder="Reason" className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm" />
                {items.length > 1 && <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => router.push("/procurement/grn")} className="border border-border bg-muted text-foreground px-6 py-2 rounded-lg font-medium hover:bg-muted/80">Cancel</button>
          <button type="submit" disabled={submitting} className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover active:scale-95 disabled:opacity-50 flex items-center gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Creating..." : "Create GRN"}
          </button>
        </div>
      </form>
    </div>
  );
}
