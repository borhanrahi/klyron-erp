"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Download,
  Send,
  Printer,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Mail,
  DollarSign,
  Calendar,
} from "lucide-react";

const invoice = {
  id: "INV-2024-045",
  customer: "Acme Corp",
  contact: "John Mitchell",
  email: "billing@acme.com",
  date: "Mar 24, 2024",
  dueDate: "Apr 23, 2024",
  status: "Paid",
  statusVariant: "success" as const,
  reference: "PO-2024-089",
  items: [
    { description: "Website Development - Phase 1", quantity: 1, rate: 5000, amount: 5000 },
    { description: "UI/UX Design Consultation", quantity: 16, rate: 150, amount: 2400 },
    { description: "Project Management", quantity: 1, rate: 1200, amount: 1200 },
    { description: "Quality Assurance Testing", quantity: 1, rate: 800, amount: 800 },
    { description: "Deployment & Launch Support", quantity: 1, rate: 600, amount: 600 },
  ],
  subtotal: 10000,
  taxRate: 10,
  tax: 1000,
  total: 11000,
  amountPaid: 11000,
  balance: 0,
};

const payments = [
  {
    id: "PAY-2024-112",
    date: "Mar 28, 2024",
    method: "Bank Transfer",
    amount: "$11,000.00",
    reference: "TXN-8923451",
    status: "Completed",
    statusVariant: "success" as const,
  },
];

const timeline = [
  {
    date: "Mar 28, 2024 2:15 PM",
    event: "Payment received",
    detail: "Full payment of $11,000.00 received via bank transfer",
    icon: CheckCircle,
    iconColor: "text-success",
  },
  {
    date: "Mar 27, 2024 9:00 AM",
    event: "Payment reminder sent",
    detail: "Automated payment reminder email sent to billing@acme.com",
    icon: Mail,
    iconColor: "text-info",
  },
  {
    date: "Mar 25, 2024 10:30 AM",
    event: "Invoice sent",
    detail: "Invoice emailed to billing@acme.com",
    icon: Send,
    iconColor: "text-info",
  },
  {
    date: "Mar 24, 2024 4:45 PM",
    event: "Invoice created",
    detail: "Invoice created by Sarah Johnson",
    icon: FileText,
    iconColor: "text-muted-foreground",
  },
];

export default function InvoiceDetailPage() {
  const [activeTab, setActiveTab] = useState<"details" | "payments" | "timeline">("details");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span>Invoices</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          {invoice.id}
        </span>
      </div>

      <PageHeader
        title={invoice.id}
        description={`Invoice for ${invoice.customer}`}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            {invoice.status !== "Paid" && (
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Reminder
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Amount</p>
          </div>
          <p className="text-2xl font-bold">${invoice.total.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Amount Paid</p>
          </div>
          <p className="text-2xl font-bold text-success">
            ${invoice.amountPaid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Balance Due</p>
          </div>
          <p className="text-2xl font-bold text-success">$0.00</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Due Date</p>
          </div>
          <p className="text-2xl font-bold">{invoice.dueDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-border">
        {(["details", "payments", "timeline"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2">
                        Description
                      </th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-16">
                        Qty
                      </th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">
                        Rate
                      </th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {invoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-3 px-2 text-sm">{item.description}</td>
                        <td className="py-3 px-2 text-sm text-right text-muted-foreground">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-2 text-sm text-right text-muted-foreground">
                          ${item.rate.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-medium">
                          ${item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border mt-4 pt-4 space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax ({invoice.taxRate}%)
                  </span>
                  <span>${invoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                  <span>Total</span>
                  <span className="text-primary">
                    ${invoice.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium">{invoice.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="text-sm font-medium">{invoice.contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{invoice.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="text-sm font-medium">{invoice.reference}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Invoice Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge
                    status={invoice.status}
                    variant={invoice.statusVariant}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Issue Date</span>
                  <span className="text-sm font-medium">{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="text-sm font-medium">{invoice.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Items</span>
                  <span className="text-sm font-medium">{invoice.items.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Payment ID
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Method
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                    Reference
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-primary">
                        {payment.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">
                        {payment.date}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{payment.method}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground font-mono">
                        {payment.reference}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-success">
                        {payment.amount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={payment.status}
                        variant={payment.statusVariant}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            {timeline.map((event, i) => {
              const Icon = event.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-muted rounded-full">
                      <Icon className={`h-4 w-4 ${event.iconColor}`} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-semibold">{event.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.date}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
