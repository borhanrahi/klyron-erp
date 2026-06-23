"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Package,
  Truck,
  MessageSquare,
  Download,
  Printer,
} from "lucide-react";

interface POItem {
  id: number;
  po_id: number;
  item_id: number;
  qty: number;
  unit_price: number;
  tax: number;
  total: number;
  received_qty: number;
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  pr_id: number;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  delivery_date: string;
  terms: string;
  company_id: number;
  created_at: string;
  items: POItem[];
}

export default function PurchaseOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [po, setPo] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    setError("");
    apiGet<{ data: PurchaseOrder }>(`/procurement/orders/${params.id}`)
      .then((res) => setPo(res.data))
      .catch(() => setError("Failed to load purchase order."))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !po) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Purchase Order"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Procurement", href: "/procurement" },
            { label: "Purchase Orders", href: "/procurement/purchase-orders" },
            { label: "Not Found" },
          ]}
          actions={
            <button
              onClick={() => router.push("/procurement/purchase-orders")}
              className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </button>
          }
        />
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">{error || "Purchase order not found."}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "details", label: "Details" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={po.po_number}
        description={`PO #${po.po_number}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders", href: "/procurement/purchase-orders" },
          { label: po.po_number },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/procurement/purchase-orders")}
              className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border">
            <div className="border-b border-border">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <StatusBadge status={po.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">PR Reference</p>
                      <span className="text-primary">
                        {po.pr_id ? `PR-${po.pr_id}` : "—"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created At</p>
                      <p className="text-foreground">
                        {po.created_at ? new Date(po.created_at).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Delivery</p>
                      <p className="text-foreground">{po.delivery_date || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Terms</p>
                      <p className="text-foreground">{po.terms || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="text-foreground">Supplier #{po.supplier_id}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Order Items</p>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">
                              Item ID
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Qty
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Unit Price
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Tax
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Total
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Received
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {po.items.map((item) => (
                            <tr key={item.id} className="border-b border-border">
                              <td className="py-3 px-3 text-foreground">Item #{item.item_id}</td>
                              <td className="py-3 px-3 text-right text-foreground">{item.qty}</td>
                              <td className="py-3 px-3 text-right text-foreground">
                                ${Number(item.unit_price).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right text-foreground">
                                ${Number(item.tax).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-foreground">
                                ${Number(item.total).toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right text-foreground">
                                {item.received_qty}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
                    No history available.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  ${Number(po.subtotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">
                  ${Number(po.tax).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">
                  ${Number(po.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </h3>
            <textarea
              rows={3}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              placeholder="Add a comment..."
            />
            <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
