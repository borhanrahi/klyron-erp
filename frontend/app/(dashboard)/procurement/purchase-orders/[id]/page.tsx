"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Save,
  X,
  Check,
  Clock,
  User,
  Building2,
  Calendar,
  FileText,
  MessageSquare,
  History,
  Send,
  XCircle,
  Truck,
  Package,
  MapPin,
  Phone,
  Mail,
  Download,
  Printer,
} from "lucide-react";

const purchaseOrderData = {
  id: "PO-2024-001",
  supplier: {
    name: "TechParts International",
    contact: "John Mitchell",
    email: "john@techparts.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, New York, NY 10001",
  },
  prReference: "PR-2024-001",
  date: "2024-01-15",
  deliveryDate: "2024-01-25",
  status: "Shipped",
  amount: 24500.0,
  paymentTerms: "Net 30",
  shippingMethod: "Express",
  shippingAddress: "456 Warehouse Blvd, Los Angeles, CA 90001",
  items: [
    {
      id: 1,
      description: "Dell XPS 15 Developer Edition Laptop",
      quantity: 5,
      unit: "pcs",
      unitPrice: 2400.0,
      total: 12000.0,
    },
    {
      id: 2,
      description: '27" 4K Monitor - LG UltraFine',
      quantity: 5,
      unit: "pcs",
      unitPrice: 600.0,
      total: 3000.0,
    },
    {
      id: 3,
      description: "Ergonomic Keyboard and Mouse Combo",
      quantity: 5,
      unit: "sets",
      unitPrice: 160.0,
      total: 800.0,
    },
    {
      id: 4,
      description: "USB-C Docking Station",
      quantity: 5,
      unit: "pcs",
      unitPrice: 180.0,
      total: 900.0,
    },
  ],
  deliveryTracking: [
    {
      status: "Order Placed",
      date: "2024-01-15 10:30",
      location: "Online",
      description: "Purchase order created and submitted",
    },
    {
      status: "Order Confirmed",
      date: "2024-01-15 14:45",
      location: "TechParts International, NY",
      description: "Supplier confirmed order and stock availability",
    },
    {
      status: "Processing",
      date: "2024-01-16 09:00",
      location: "TechParts International Warehouse, NY",
      description: "Items being picked and packed",
    },
    {
      status: "Shipped",
      date: "2024-01-18 16:30",
      location: "FedEx Facility, Newark, NJ",
      description: "Package shipped via FedEx Express. Tracking: FX123456789",
    },
    {
      status: "In Transit",
      date: "2024-01-20 08:15",
      location: "FedEx Hub, Memphis, TN",
      description: "Package in transit to destination",
    },
  ],
  orderHistory: [
    {
      action: "PO Created",
      user: "Alice Johnson",
      date: "2024-01-15 10:30",
      comments: "Created from PR-2024-001",
    },
    {
      action: "Submitted to Supplier",
      user: "Alice Johnson",
      date: "2024-01-15 10:35",
      comments: "PO sent to TechParts International",
    },
    {
      action: "Supplier Confirmed",
      user: "John Mitchell",
      date: "2024-01-15 14:45",
      comments: "All items in stock, delivery confirmed for Jan 25",
    },
    {
      action: "Shipment Notification",
      user: "System",
      date: "2024-01-18 16:30",
      comments: "Tracking number FX123456789 provided",
    },
  ],
};

export default function PurchaseOrderDetailPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [comment, setComment] = useState("");

  const tabs = [
    { id: "details", label: "Details" },
    { id: "tracking", label: "Delivery Tracking" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={purchaseOrderData.id}
        description={`Order to ${purchaseOrderData.supplier.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders", href: "/procurement/purchase-orders" },
          { label: purchaseOrderData.id },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {purchaseOrderData.status === "Delivered" && (
              <button className="px-4 py-2 bg-success text-white rounded-lg flex items-center gap-2 hover:bg-success/90 transition-colors">
                <Check className="h-4 w-4" />
                Mark as Received
              </button>
            )}
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
                      <StatusBadge status={purchaseOrderData.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        PR Reference
                      </p>
                      <span className="text-primary">
                        {purchaseOrderData.prReference}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Date
                      </p>
                      <p className="text-foreground">
                        {purchaseOrderData.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Expected Delivery
                      </p>
                      <p className="text-foreground">
                        {purchaseOrderData.deliveryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Terms
                      </p>
                      <p className="text-foreground">
                        {purchaseOrderData.paymentTerms}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Shipping Method
                      </p>
                      <p className="text-foreground">
                        {purchaseOrderData.shippingMethod}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Order Items
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">
                              Description
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Qty
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Unit Price
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseOrderData.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-border"
                            >
                              <td className="py-3 px-3 text-foreground">
                                {item.description}
                              </td>
                              <td className="py-3 px-3 text-right text-foreground">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="py-3 px-3 text-right text-foreground">
                                ${item.unitPrice.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-foreground">
                                ${item.total.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-border">
                            <td
                              colSpan={3}
                              className="py-3 px-3 text-right font-medium text-foreground"
                            >
                              Total:
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-foreground">
                              ${purchaseOrderData.amount.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Delivery Address
                      </p>
                      <p className="text-foreground bg-muted p-4 rounded-lg">
                        {purchaseOrderData.shippingAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Supplier Contact
                      </p>
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <p className="text-foreground font-medium">
                          {purchaseOrderData.supplier.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {purchaseOrderData.supplier.contact}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {purchaseOrderData.supplier.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {purchaseOrderData.supplier.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tracking" && (
                <div className="space-y-4">
                  {purchaseOrderData.deliveryTracking.map((track, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          index ===
                          purchaseOrderData.deliveryTracking.length - 1
                            ? "bg-primary/20 text-primary"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        <Truck className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">
                            {track.status}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {track.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {track.location}
                        </p>
                        <p className="text-sm text-foreground mt-2">
                          {track.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  {purchaseOrderData.orderHistory.map((history, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                    >
                      <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">
                          {history.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {history.user} • {history.date}
                        </p>
                        {history.comments && (
                          <p className="text-sm text-foreground mt-1">
                            {history.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
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
                  ${purchaseOrderData.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">$0.00</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">
                  ${purchaseOrderData.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-left">
                View Requisition
              </button>
              <button className="w-full px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-left">
                Create GRN
              </button>
              <button className="w-full px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-left">
                Request Amendment
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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