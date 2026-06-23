"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { FileText, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { DatePicker } from "@/components/ui/date-picker";

interface QuotationItemDraft {
  item_id: number;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

export default function CreateQuotationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    quote_number: "",
    customer_id: 0,
    status: "draft",
    date: "",
    expiry: "",
  });
  const [items, setItems] = useState<QuotationItemDraft[]>([]);

  function addItem() {
    setItems((prev) => [...prev, { item_id: 0, qty: 1, price: 0, tax: 0, total: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof QuotationItemDraft, value: number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.qty * updated.price + updated.tax;
        return updated;
      })
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
  const total = subtotal + totalTax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/sales/quotations", {
        ...form,
        customer_id: Number(form.customer_id),
        subtotal,
        tax: totalTax,
        total,
        items,
      });
      router.push("/sales/quotations");
    } catch (err) {
      console.error("Failed to create quotation:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <Link
        href="/sales/quotations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Quotations
      </Link>

      <PageHeader
        title="Create Quotation"
        icon={<FileText className="h-6 w-6 text-primary" />}
      />

      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Quote Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={form.quote_number}
                onChange={(e) => setForm((f) => ({ ...f, quote_number: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Customer ID
              </label>
              <input
                type="number"
                value={form.customer_id || ""}
                onChange={(e) => setForm((f) => ({ ...f, customer_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Date
              </label>
              <DatePicker
                value={form.date}
                onChange={(d) => setForm((f) => ({ ...f, date: d }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Expiry Date
              </label>
              <DatePicker
                value={form.expiry}
                onChange={(d) => setForm((f) => ({ ...f, expiry: d }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No items added yet. Click &quot;Add Item&quot; to begin.
            </p>
          )}

          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end p-3 rounded-xl bg-muted/50">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Item ID</label>
                <input
                  type="number"
                  value={item.item_id || ""}
                  onChange={(e) => updateItem(i, "item_id", Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Qty</label>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => updateItem(i, "price", Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Tax</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.tax}
                  onChange={(e) => updateItem(i, "tax", Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-sm focus:border-primary outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Total</label>
                  <div className="px-2 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold">
                    ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-1.5 text-muted-foreground hover:text-danger transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className="border-t border-border pt-4 space-y-1 text-right">
              <p className="text-sm text-muted-foreground">
                Subtotal: <span className="font-semibold text-foreground">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Tax: <span className="font-semibold text-foreground">${totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </p>
              <p className="text-lg font-bold">
                Total: <span className="text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Link
            href="/sales/quotations"
            className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Creating..." : "Create Quotation"}
          </button>
        </div>
      </form>
    </div>
  );
}
