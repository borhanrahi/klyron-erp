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
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface GRNItem {
  id: number;
  poItemId: number;
  description: string;
  orderedQty: number;
  receivedQty: number;
  inspectedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  condition: string;
  notes: string;
}

export default function NewGRNPage() {
  const [formData, setFormData] = useState({
    poReference: "",
    supplier: "",
    deliveryNoteNumber: "",
    receivedDate: "",
    receivedBy: "",
    warehouse: "",
    inspectionNotes: "",
  });

  const [items, setItems] = useState<GRNItem[]>([
    {
      id: 1,
      poItemId: 1,
      description: "",
      orderedQty: 0,
      receivedQty: 0,
      inspectedQty: 0,
      acceptedQty: 0,
      rejectedQty: 0,
      condition: "Good",
      notes: "",
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        poItemId: items.length + 1,
        description: "",
        orderedQty: 0,
        receivedQty: 0,
        inspectedQty: 0,
        acceptedQty: 0,
        rejectedQty: 0,
        condition: "Good",
        notes: "",
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
    field: keyof GRNItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalOrdered = items.reduce((sum, item) => sum + item.orderedQty, 0);
  const totalReceived = items.reduce((sum, item) => sum + item.receivedQty, 0);
  const totalAccepted = items.reduce((sum, item) => sum + item.acceptedQty, 0);
  const totalRejected = items.reduce((sum, item) => sum + item.rejectedQty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, items });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Goods Receipt Note"
        description="Record received goods from supplier delivery"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "GRN", href: "/procurement/grn" },
          { label: "New GRN" },
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
              Save GRN
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Delivery Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PO Reference *
              </label>
              <select
                required
                value={formData.poReference}
                onChange={(e) =>
                  setFormData({ ...formData, poReference: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select PO</option>
                <option value="PO-2024-001">PO-2024-001 - TechParts International</option>
                <option value="PO-2024-002">PO-2024-002 - Global Materials Co</option>
                <option value="PO-2024-003">PO-2024-003 - Packaging Solutions Ltd</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Supplier *
              </label>
              <input
                type="text"
                required
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Supplier name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Delivery Note Number
              </label>
              <input
                type="text"
                value={formData.deliveryNoteNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryNoteNumber: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Supplier's delivery note number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Received Date *
              </label>
              <input
                type="date"
                required
                value={formData.receivedDate}
                onChange={(e) =>
                  setFormData({ ...formData, receivedDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Received By *
              </label>
              <select
                required
                value={formData.receivedBy}
                onChange={(e) =>
                  setFormData({ ...formData, receivedBy: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select receiver</option>
                <option value="Alice Johnson">Alice Johnson</option>
                <option value="Bob Smith">Bob Smith</option>
                <option value="Carol Williams">Carol Williams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Warehouse Location
              </label>
              <select
                value={formData.warehouse}
                onChange={(e) =>
                  setFormData({ ...formData, warehouse: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select warehouse</option>
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="East Wing Storage">East Wing Storage</option>
                <option value="Cold Storage">Cold Storage</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Package className="h-5 w-5" />
              Received Items
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
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium text-sm">
                    Description
                  </th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium text-sm">
                    Ordered
                  </th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium text-sm">
                    Received
                  </th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium text-sm">
                    Accepted
                  </th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium text-sm">
                    Rejected
                  </th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium text-sm">
                    Condition
                  </th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium text-sm">
                    Notes
                  </th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium text-sm w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Item description"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="0"
                        value={item.orderedQty}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "orderedQty",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm text-right"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="0"
                        value={item.receivedQty}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "receivedQty",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm text-right"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="0"
                        value={item.acceptedQty}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "acceptedQty",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm text-right"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="0"
                        value={item.rejectedQty}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "rejectedQty",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm text-right"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={item.condition}
                        onChange={(e) =>
                          updateItem(item.id, "condition", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        <option value="Good">Good</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Partial">Partial</option>
                        <option value="Missing">Missing</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) =>
                          updateItem(item.id, "notes", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Notes"
                      />
                    </td>
                    <td className="py-3 px-3">
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
                  <td className="py-3 px-3 font-medium text-foreground text-sm">
                    Totals:
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-foreground text-sm">
                    {totalOrdered}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-foreground text-sm">
                    {totalReceived}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-success text-sm">
                    {totalAccepted}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-danger text-sm">
                    {totalRejected}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Acceptance Rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {totalReceived > 0
                  ? Math.round((totalAccepted / totalReceived) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm">Total Received</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {totalReceived}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Rejected Items</span>
              </div>
              <p className="text-2xl font-bold text-danger">{totalRejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Inspection Notes
          </h2>
          <textarea
            value={formData.inspectionNotes}
            onChange={(e) =>
              setFormData({ ...formData, inspectionNotes: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Add any inspection notes, discrepancies, or quality observations..."
          />
        </div>
      </form>
    </div>
  );
}