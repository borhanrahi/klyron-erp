"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  ShoppingCart,
  FileText,
  MessageSquare,
  ExternalLink,
  Edit,
  Plus,
} from "lucide-react";
import Link from "next/link";

const customer = {
  id: "C-001",
  name: "Acme Corp",
  contact: "Robert Anderson",
  title: "VP of Engineering",
  email: "robert@acme.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, New York, NY 10001",
  website: "https://acme.com",
  industry: "Manufacturing",
  status: "Active",
  statusVariant: "success" as const,
  since: "Jan 2022",
  totalSpent: "$285,000",
  avgOrderValue: "$23,750",
  totalOrders: 12,
  lastOrder: "Mar 20, 2024",
};

const recentOrders = [
  {
    id: "SO-2024-001",
    date: "Mar 20, 2024",
    amount: "$12,500",
    status: "Delivered",
    statusVariant: "success" as const,
  },
  {
    id: "SO-2024-002",
    date: "Mar 5, 2024",
    amount: "$28,000",
    status: "Processing",
    statusVariant: "info" as const,
  },
  {
    id: "SO-2024-003",
    date: "Feb 15, 2024",
    amount: "$8,500",
    status: "Delivered",
    statusVariant: "success" as const,
  },
  {
    id: "SO-2024-004",
    date: "Jan 28, 2024",
    amount: "$45,000",
    status: "Delivered",
    statusVariant: "success" as const,
  },
];

const invoices = [
  {
    id: "INV-2024-001",
    date: "Mar 20, 2024",
    amount: "$12,500",
    dueDate: "Apr 19, 2024",
    status: "Pending",
    statusVariant: "warning" as const,
  },
  {
    id: "INV-2024-002",
    date: "Mar 5, 2024",
    amount: "$28,000",
    dueDate: "Apr 4, 2024",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "INV-2024-003",
    date: "Feb 15, 2024",
    amount: "$8,500",
    dueDate: "Mar 17, 2024",
    status: "Paid",
    statusVariant: "success" as const,
  },
];

const tickets = [
  {
    id: "TK-001",
    subject: "Integration API timeout issue",
    date: "Mar 22, 2024",
    status: "Open",
    statusVariant: "warning" as const,
    priority: "High",
  },
  {
    id: "TK-002",
    subject: "Training session scheduling",
    date: "Mar 18, 2024",
    status: "Resolved",
    statusVariant: "success" as const,
    priority: "Low",
  },
];

export default function CustomerDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      <Link
        href="/sales/customers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              AC
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <StatusBadge
                  status={customer.status}
                  variant={customer.statusVariant}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {customer.contact} • {customer.title}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <a
                  href={`mailto:${customer.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </a>
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </a>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {customer.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <Link
            href="/sales/quotations/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            New Quote
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold mt-1">{customer.totalSpent}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{customer.totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="text-2xl font-bold mt-1">{customer.avgOrderValue}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Last Order</p>
          <p className="text-2xl font-bold mt-1">{customer.lastOrder}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Link
                href="/sales/orders"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Order ID
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/sales/orders/${order.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {order.date}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">
                          {order.amount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={order.status}
                          variant={order.statusVariant}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoices</h3>
              <button className="text-sm text-primary hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Invoice
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Due Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-primary">
                          {invoice.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {invoice.date}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">
                          {invoice.amount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {invoice.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={invoice.status}
                          variant={invoice.statusVariant}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Industry
                </span>
                <span className="text-sm font-medium">
                  {customer.industry}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Customer Since
                </span>
                <span className="text-sm font-medium">{customer.since}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Website</span>
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Visit
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Support Tickets</h3>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{ticket.subject}</span>
                    <StatusBadge
                      status={ticket.status}
                      variant={ticket.statusVariant}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{ticket.id}</span>
                    <span>{ticket.date}</span>
                    <span
                      className={
                        ticket.priority === "High"
                          ? "text-danger"
                          : "text-muted-foreground"
                      }
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/sales/orders/new"
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Create Order
              </Link>
              <Link
                href="/sales/quotations/new"
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Create Quotation
              </Link>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Log Communication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
