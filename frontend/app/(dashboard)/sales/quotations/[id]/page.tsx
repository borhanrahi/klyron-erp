"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  ArrowLeft,
  Send,
  Download,
  Edit,
  Printer,
  Building2,
  Calendar,
  Clock,
  ShoppingCart,
  Check,
  Copy,
} from "lucide-react";
import Link from "next/link";

const quotation = {
  id: "QT-2024-001",
  customer: "Acme Corp",
  contact: "Robert Anderson",
  title: "VP of Engineering",
  email: "robert.anderson@acme.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, New York, NY 10001",
  date: "Mar 24, 2024",
  validUntil: "Apr 23, 2024",
  paymentTerms: "Net 30",
  status: "Sent",
  statusVariant: "info" as const,
  salesRep: "Mike Johnson",
  notes:
    "This quotation includes a 10% discount for annual commitment. Implementation support and training are included in the first 90 days.",
};

const items = [
  {
    id: 1,
    description: "Enterprise Platform License (Annual)",
    quantity: 1,
    unitPrice: 75000,
    total: 75000,
  },
  {
    id: 2,
    description: "Data Migration Service",
    quantity: 1,
    unitPrice: 25000,
    total: 25000,
  },
  {
    id: 3,
    description: "Custom Integration Development",
    quantity: 40,
    unitPrice: 150,
    total: 6000,
  },
  {
    id: 4,
    description: "Training Sessions (2 hours each)",
    quantity: 10,
    unitPrice: 500,
    total: 5000,
  },
  {
    id: 5,
    description: "Premium Support Package (12 months)",
    quantity: 1,
    unitPrice: 12000,
    total: 12000,
  },
  {
    id: 6,
    description: "Additional Storage (500GB)",
    quantity: 2,
    unitPrice: 1000,
    total: 2000,
  },
  {
    id: 7,
    description: "Security Audit & Compliance Check",
    quantity: 1,
    unitPrice: 8000,
    total: 8000,
  },
  {
    id: 8,
    description: "Documentation & Knowledge Base Setup",
    quantity: 1,
    unitPrice: 3000,
    total: 3000,
  },
];

const subtotal = items.reduce((sum, item) => sum + item.total, 0);
const discountPercent = 10;
const discountAmount = subtotal * (discountPercent / 100);
const total = subtotal - discountAmount;

export default function QuotationDetailPage() {
  const [showConvertModal, setShowConvertModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      <Link
        href="/sales/quotations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Quotations
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{quotation.id}</h1>
            <StatusBadge
              status={quotation.status}
              variant={quotation.statusVariant}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Created on {quotation.date} • Valid until {quotation.validUntil}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setShowConvertModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Convert to Order
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                From
              </h3>
              <div className="space-y-1">
                <p className="font-semibold">Klyron ERP Solutions</p>
                <p className="text-sm text-muted-foreground">
                  456 Tech Park, San Francisco, CA 94102
                </p>
                <p className="text-sm text-muted-foreground">
                  billing@klyron-erp.com
                </p>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 999-0000
                </p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Bill To
              </h3>
              <div className="space-y-1">
                <p className="font-semibold">{quotation.customer}</p>
                <p className="text-sm text-muted-foreground">
                  {quotation.contact} • {quotation.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {quotation.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {quotation.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {quotation.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Item
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 w-20">
                  Qty
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 w-32">
                  Unit Price
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 w-32">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <span className="text-sm">{item.description}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      ${item.unitPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-medium">
                      ${item.total.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-72 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Discount ({discountPercent}%)
                </span>
                <span className="text-sm text-danger">
                  -${discountAmount.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-base font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Terms & Notes</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Payment Terms</p>
                <p className="text-xs text-muted-foreground">
                  {quotation.paymentTerms}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Valid Until</p>
                <p className="text-xs text-muted-foreground">
                  {quotation.validUntil}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-sm font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">
                {quotation.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Quotation created</p>
                <p className="text-xs text-muted-foreground">
                  Mar 24, 2024 at 10:30 AM
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                <Send className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium">Sent to customer</p>
                <p className="text-xs text-muted-foreground">
                  Mar 24, 2024 at 11:15 AM
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Copy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Customer viewed quote</p>
                <p className="text-xs text-muted-foreground">
                  Mar 25, 2024 at 2:45 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">
              Convert to Sales Order?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will create a new sales order from this quotation. The
              quotation will be marked as converted.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConvertModal(false)}
                className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80"
              >
                Cancel
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Convert to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
