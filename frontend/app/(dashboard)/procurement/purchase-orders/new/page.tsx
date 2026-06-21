"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Save,
  X,
  Plus,
  Trash2,
  Package,
  FileText,
  Building2,
  Truck,
  CreditCard,
} from "lucide-react";

interface POItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export default function NewPurchaseOrderPage() {
  const [formData, setFormData] = useState({
    supplier: "",
    prReference: "",
    deliveryDate: "",
    paymentTerms: "",
    shippingMethod: "",
    shippingAddress: "",
    specialInstructions: "",
  });

  const [items, setItems] = useState<POItem[]>([
    { id: 1, description: "", quantity: 1, unit: "pcs", unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        description: "",
        quantity: 1,
        unit: "pcs",
        unitPrice: 0,
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
    field: keyof POItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, items });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Purchase Order"
        description="Generate a new purchase order from requisition"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders", href: "/procurement/purchase-orders" },
          { label: "New PO" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              Create PO
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Supplier Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Supplier *
              </label>
              <select
                required
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select supplier</option>
                <option value="TechParts International">
                  TechParts International
                </option>
                <option value="Global Materials Co">
                  Global Materials Co
                </option>
                <option value="Packaging Solutions Ltd">
                  Packaging Solutions Ltd
                </option>
                <option value="Office Supplies Direct">
                  Office Supplies Direct
                </option>
                <option value="GreenTech Solutions">GreenTech Solutions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PR Reference
              </label>
              <input
                type="text"
                value={formData.prReference}
                onChange={(e) =>
                  setFormData({ ...formData, prReference: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., PR-2024-001"
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
                Required Delivery Date *
              </label>
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Shipping Method
              </label>
              <select
                value={formData.shippingMethod}
                onChange={(e) =>
                  setFormData({ ...formData, shippingMethod: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select shipping method</option>
                <option value="Standard">Standard Shipping</option>
                <option value="Express">Express Shipping</option>
                <option value="Overnight">Overnight</option>
                <option value="Freight">Freight</option>
                <option value="Pickup">Supplier Pickup</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Delivery Address
              </label>
              <textarea
                value={formData.shippingAddress}
                onChange={(e) =>
                  setFormData({ ...formData, shippingAddress: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter delivery address..."
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Terms *
              </label>
              <select
                required
                value={formData.paymentTerms}
                onChange={(e) =>
                  setFormData({ ...formData, paymentTerms: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select payment terms</option>
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
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-24">
                    Qty
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-28">
                    Unit
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-32">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-32">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Item description"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(item.id, "unit", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pcs">Pieces</option>
                        <option value="kg">Kilograms</option>
                        <option value="ltr">Liters</option>
                        <option value="m">Meters</option>
                        <option value="box">Boxes</option>
                        <option value="set">Sets</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
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
                  <td
                    colSpan={4}
                    className="py-3 px-4 text-right font-medium text-foreground"
                  >
                    Total Amount:
                  </td>
                  <td className="py-3 px-4 font-bold text-lg text-foreground">
                    ${totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Special Instructions
          </h2>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) =>
              setFormData({ ...formData, specialInstructions: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Add any special instructions for the supplier..."
          />
        </div>
      </form>
    </div>
  );
}