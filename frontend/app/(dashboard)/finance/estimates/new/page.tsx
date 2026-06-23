"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { FileText, Plus, Trash2, Save, ArrowLeft, Calculator, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface LineItem { id: number; description: string; qty: number; price: number; total: number; }
interface Customer { id: number; name?: string; company_name?: string; [key: string]: unknown; }

export default function NewEstimatePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [estimateNumber] = useState(`EST-${Date.now()}`);
  const [expiryDate, setExpiryDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", qty: 1, price: 0, total: 0 },
  ]);

  useEffect(() => {
    apiGet<{ items: Customer[] }>("/sales/customers").then((res) => setCustomers(res.items || [])).catch(() => {});
    const d = new Date(); d.setDate(d.getDate() + 30);
    setExpiryDate(d.toISOString().split("T")[0]);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  function addItem() {
    setItems([...items, { id: Date.now(), description: "", qty: 1, price: 0, total: 0 }]);
  }

  function removeItem(id: number) {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  }

  function updateItem(id: number, field: string, value: string | number) {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "qty" || field === "price") updated.total = updated.qty * updated.price;
      return updated;
    }));
  }

  async function handleSubmit() {
    if (!selectedCustomer) return alert("Please select a customer");
    setSaving(true);
    try {
      await apiPost("/finance/estimates", {
        customer_id: parseInt(selectedCustomer),
        estimate_number: estimateNumber,
        expiry_date: expiryDate || undefined,
        status: "draft",
        subtotal,
        tax: taxAmount,
        total,
        items: items.filter((i) => i.description).map((i) => ({
          qty: i.qty, price: i.price, total: i.total,
        })),
      });
      router.push("/finance/estimates");
    } catch { alert("Failed to create estimate"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/finance/estimates")}>Estimates</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">New Estimate</span>
      </div>

      <PageHeader
        title="Create Estimate"
        description="Generate a new estimate for your customer."
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={<button onClick={() => router.push("/finance/estimates")} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Back</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Estimate Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Customer *</label>
                <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select customer...</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name || c.company_name || `Customer #${c.id}`}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Estimate Number</label>
                <input type="text" value={estimateNumber} readOnly className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Expiry Date</label>
                <DatePicker value={expiryDate} onChange={setExpiryDate} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Line Items</h3>
              <button onClick={addItem} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2">Description</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-16">Qty</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">Price</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">Total</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-2"><input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Item description..." className="w-full px-2 py-1.5 bg-transparent border border-border rounded text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" /></td>
                      <td className="py-2 px-2"><input type="number" value={item.qty} onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 bg-transparent border border-border rounded text-sm text-right focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" /></td>
                      <td className="py-2 px-2"><input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 bg-transparent border border-border rounded text-sm text-right focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" /></td>
                      <td className="py-2 px-2 text-right"><span className="text-sm font-medium px-2">{(item.qty * item.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></td>
                      <td className="py-2 px-2">
                        <button onClick={() => removeItem(item.id)} disabled={items.length <= 1} className="p-1 text-muted-foreground hover:text-danger disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{subtotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Tax Rate</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-16 px-2 py-1 bg-transparent border border-border rounded text-sm text-right focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax Amount</span><span className="font-medium">{taxAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between"><span className="text-base font-semibold">Total</span><span className="text-xl font-bold text-primary">{total.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleSubmit} disabled={saving} className="w-full bg-primary text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Estimate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
