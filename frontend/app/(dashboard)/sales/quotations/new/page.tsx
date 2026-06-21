"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FileText,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Building2,
  Calendar,
  User,
  Send,
  Download,
} from "lucide-react";
import Link from "next/link";

interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function NewQuotationPage() {
  const [formData, setFormData] = useState({
    customer: "",
    contact: "",
    email: "",
    quoteDate: "",
    validUntil: "",
    paymentTerms: "",
    notes: "",
    discount: "",
  });

  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: number,
    field: keyof QuoteItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.total = updated.quantity * updated.unitPrice;
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (parseFloat(formData.discount || "0") / 100);
  const total = subtotal - discountAmount;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link
          href="/sales"
          className="hover:text-foreground transition-colors"
        >
          Sales
        </Link>
        <span>/</span>
        <Link
          href="/sales/quotations"
          className="hover:text-foreground transition-colors"
        >
          Quotations
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Quotation
        </span>
      </div>

      <PageHeader
        title="Create Quotation"
        description="Create a new quotation for your customer."
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/quotations"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quotations
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Customer Details
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Customer *
            </label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select customer</option>
              <option value="acme">Acme Corp</option>
              <option value="techstart">TechStart Inc</option>
              <option value="global">Global Industries</option>
              <option value="creative">Creative Solutions</option>
              <option value="dataflow">DataFlow Systems</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Contact name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="email@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Terms
            </label>
            <select
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select terms</option>
              <option value="net15">Net 15</option>
              <option value="net30">Net 30</option>
              <option value="net45">Net 45</option>
              <option value="net60">Net 60</option>
              <option value="due-receipt">Due on Receipt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Quote Date *
            </label>
            <input
              type="date"
              name="quoteDate"
              value={formData.quoteDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Valid Until *
            </label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3 w-10">
                    #
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3">
                    Description
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3 w-24">
                    Qty
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3 w-32">
                    Unit Price
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3 w-32">
                    Total
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-2 px-3 text-sm text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Item description"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        min="0"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-sm font-medium">
                        ${item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"
                      >
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Notes</h3>
            </div>
            <div className="p-6">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                placeholder="Add any additional notes or terms..."
              />
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium">
                  ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discount</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-20 px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-right"
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/sales/quotations"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Save as Draft
        </button>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Send className="h-4 w-4" />
          Send Quotation
        </button>
      </div>
    </div>
  );
}
