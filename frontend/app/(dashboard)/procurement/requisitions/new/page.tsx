"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  Package,
  FileText,
} from "lucide-react";

interface RequisitionItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export default function NewRequisitionPage() {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    priority: "Normal",
    justification: "",
    deliveryDate: "",
    specialInstructions: "",
  });

  const [items, setItems] = useState<RequisitionItem[]>([
    { id: 1, description: "", quantity: 1, unit: "pcs", estimatedCost: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        description: "",
        quantity: 1,
        unit: "pcs",
        estimatedCost: 0,
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
    field: keyof RequisitionItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalEstimated = items.reduce(
    (sum, item) => sum + item.quantity * item.estimatedCost,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, items });
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
            <button className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter requisition title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select department</option>
                <option value="Administration">Administration</option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Production">Production</option>
                <option value="Marketing">Marketing</option>
                <option value="Logistics">Logistics</option>
                <option value="Research & Development">
                  Research & Development
                </option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Required Delivery Date
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Justification *
              </label>
              <textarea
                required
                value={formData.justification}
                onChange={(e) =>
                  setFormData({ ...formData, justification: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Explain why this purchase is needed..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Special Instructions
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialInstructions: e.target.value,
                  })
                }
                rows={2}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Any special delivery or packaging instructions..."
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
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-8"></th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-24">
                    Qty
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-28">
                    Unit
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-36">
                    Est. Cost
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-36">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-3 px-4">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    </td>
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
                        value={item.estimatedCost}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "estimatedCost",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      ${(item.quantity * item.estimatedCost).toFixed(2)}
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
                    colSpan={5}
                    className="py-3 px-4 text-right font-medium text-foreground"
                  >
                    Total Estimated Cost:
                  </td>
                  <td className="py-3 px-4 font-bold text-lg text-foreground">
                    ${totalEstimated.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
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