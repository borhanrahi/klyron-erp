"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Send,
  ArrowLeft,
  Calculator,
} from "lucide-react";

const customers = [
  { id: "C001", name: "Acme Corp" },
  { id: "C002", name: "TechStart Inc" },
  { id: "C003", name: "Global Industries" },
  { id: "C004", name: "Creative Solutions" },
  { id: "C005", name: "DataFlow Systems" },
  { id: "C006", name: "Innovate Labs" },
  { id: "C007", name: "Quantum Enterprises" },
];

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function NewInvoicePage() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("2024-03-25");
  const [dueDate, setDueDate] = useState("2024-04-24");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(10);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "Website Development - Phase 1", quantity: 1, rate: 5000, amount: 5000 },
    { id: 2, description: "UI/UX Design Consultation", quantity: 16, rate: 150, amount: 2400 },
    { id: 3, description: "Project Management", quantity: 1, rate: 1200, amount: 1200 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const addItem = () => {
    const newId = Math.max(...items.map((i) => i.id)) + 1;
    setItems([
      ...items,
      { id: newId, description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span>Invoices</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Invoice
        </span>
      </div>

      <PageHeader
        title="Create Invoice"
        description="Generate a new sales invoice for your customer."
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Invoices
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Customer *
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Select customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Reference / PO Number
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. PO-2024-001"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Invoice Date *
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Line Items</h3>
              <button
                onClick={addItem}
                className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2">
                      Description
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-20">
                      Qty
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-28">
                      Rate
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-28">
                      Amount
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Item description..."
                          className="w-full px-2 py-1.5 bg-transparent border border-border rounded text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1.5 bg-transparent border border-border rounded text-sm text-right focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1.5 bg-transparent border border-border rounded text-sm text-right focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span className="text-sm font-medium px-2">
                          ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-2 px-1">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 hover:bg-danger/10 rounded-lg transition-colors text-muted-foreground hover:text-danger"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or terms..."
              rows={3}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Tax Rate</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 bg-transparent border border-border rounded text-sm text-right focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax Amount</span>
                <span className="font-medium">
                  ${taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full bg-primary text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />
                Save as Draft
              </button>
              <button className="w-full bg-success text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                Save & Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
