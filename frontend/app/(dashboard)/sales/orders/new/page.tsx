"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ShoppingCart, Plus, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { DatePicker } from "@/components/ui/date-picker";

interface OrderItemInput {
  item_id: number;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

const STATUS_OPTIONS = ["draft", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const emptyItem = (): OrderItemInput => ({
  item_id: 0,
  qty: 1,
  price: 0,
  tax: 0,
  total: 0,
});

export default function CreateSalesOrderPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");
  const [customerId, setCustomerId] = useState<number>(0);
  const [status, setStatus] = useState("draft");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [items, setItems] = useState<OrderItemInput[]>([emptyItem()]);

  function updateItem(index: number, field: keyof OrderItemInput, value: number) {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "qty" || field === "price") {
        updated[index].total = updated[index].qty * updated[index].price;
      }
      return updated;
    });
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiPost("/sales/orders", {
        order_number: orderNumber,
        customer_id: customerId,
        status,
        delivery_date: deliveryDate || null,
        shipping_address: shippingAddress || null,
        items: items.map((item) => ({
          item_id: item.item_id,
          qty: item.qty,
          price: item.price,
          tax: item.tax,
          total: item.total,
        })),
      });
      router.push("/sales/orders");
    } catch (err) {
      console.error("Failed to create order:", err);
    } finally {
      setSubmitting(false);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = items.reduce((sum, item) => sum + item.tax, 0);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <PageHeader
        title="Create Sales Order"
        description="Fill in the details to create a new sales order."
        icon={<ShoppingCart className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Orders", href: "/sales/orders" },
          { label: "Create" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Order Number
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. SO-2024-001"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Customer ID
              </label>
              <input
                type="number"
                required
                min={1}
                value={customerId || ""}
                onChange={(e) => setCustomerId(Number(e.target.value))}
                placeholder="Customer ID"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Delivery Date
              </label>
              <DatePicker
                value={deliveryDate}
                onChange={setDeliveryDate}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Shipping Address
              </label>
              <textarea
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Full shipping address"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Line Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 rounded-xl border border-border bg-muted/30"
              >
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Item ID</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={item.item_id || ""}
                    onChange={(e) => updateItem(index, "item_id", Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Qty</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateItem(index, "qty", Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Price</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={0.01}
                    value={item.price || ""}
                    onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Tax</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.tax || ""}
                    onChange={(e) => updateItem(index, "tax", Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Total</label>
                    <div className="px-2 py-1.5 bg-muted/50 border border-border rounded-lg text-sm font-semibold">
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger mb-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-border flex justify-end gap-8 text-sm">
            <div>
              <span className="text-muted-foreground">Subtotal: </span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tax: </span>
              <span className="font-semibold">${taxTotal.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total: </span>
              <span className="font-bold text-primary">${(subtotal + taxTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/sales/orders")}
            className="border border-border bg-muted text-foreground px-6 py-2 rounded-lg font-medium transition-all hover:bg-muted/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
