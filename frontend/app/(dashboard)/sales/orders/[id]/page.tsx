"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ArrowLeft,
  Download,
  Printer,
  Send,
  Truck,
  MapPin,
  CreditCard,
  FileText,
  Clock,
  Package,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const order = {
  id: "SO-2024-001",
  status: "Confirmed",
  statusVariant: "success" as const,
  date: "Mar 24, 2024",
  customer: {
    name: "Acme Corp",
    email: "orders@acme.com",
    phone: "+1 (555) 987-6543",
    address: "456 Business Ave, Suite 100, New York, NY 10001",
  },
  shipping: {
    method: "Express Shipping",
    address: "456 Business Ave, Suite 100, New York, NY 10001",
    estimatedDelivery: "Mar 27, 2024",
    trackingNumber: "1Z999AA10123456784",
  },
  payment: {
    method: "Credit Card",
    last4: "4242",
    subtotal: "$11,750.00",
    tax: "$750.00",
    shipping: "$0.00",
    total: "$12,500.00",
  },
  items: [
    {
      id: 1,
      name: "Enterprise License",
      sku: "LIC-ENT-001",
      quantity: 5,
      price: "$2,000.00",
      total: "$10,000.00",
    },
    {
      id: 2,
      name: "Priority Support (12 months)",
      sku: "SUP-PRI-012",
      quantity: 5,
      price: "$350.00",
      total: "$1,750.00",
    },
  ],
  timeline: [
    {
      date: "Mar 24, 2024 10:30 AM",
      event: "Order confirmed",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      date: "Mar 24, 2024 10:15 AM",
      event: "Payment received",
      icon: CreditCard,
      color: "text-primary",
    },
    {
      date: "Mar 24, 2024 10:00 AM",
      event: "Order created",
      icon: FileText,
      color: "text-muted-foreground",
    },
  ],
};

export default function SalesOrderDetailsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/sales/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sales Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{order.id}</h1>
            <StatusBadge
              status={order.status}
              variant={order.statusVariant}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Created on {order.date}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Ship Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Items
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                      Item
                    </th>
                    <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                      Qty
                    </th>
                    <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                      Price
                    </th>
                    <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm">{item.quantity}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm">{item.price}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold">{item.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="py-3 px-4 text-right text-sm text-muted-foreground">
                      Subtotal
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold">
                      {order.payment.subtotal}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-right text-sm text-muted-foreground">
                      Tax
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold">
                      {order.payment.tax}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-right text-sm text-muted-foreground">
                      Shipping
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold">
                      {order.payment.shipping}
                    </td>
                  </tr>
                  <tr className="border-t border-border bg-muted/30">
                    <td colSpan={3} className="py-3 px-4 text-right text-sm font-bold">
                      Total
                    </td>
                    <td className="py-3 px-4 text-right text-lg font-bold text-primary">
                      {order.payment.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Order Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {order.timeline.map((event, i) => {
                  const Icon = event.icon;
                  return (
                    <div key={i} className="relative pl-12">
                      <div className={`absolute left-3.5 top-1 w-3 h-3 rounded-full bg-card border-2 border-border`} />
                      <div className="p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Customer</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">{order.customer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {order.customer.email}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {order.customer.address}
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipping
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Method</p>
                <p className="text-sm font-medium">{order.shipping.method}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Estimated Delivery
                </p>
                <p className="text-sm font-medium">
                  {order.shipping.estimatedDelivery}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tracking</p>
                <p className="text-sm font-medium text-primary">
                  {order.shipping.trackingNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Method</p>
                <p className="text-sm font-medium">
                  {order.payment.method} ending in {order.payment.last4}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge status="Paid" variant="success" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
