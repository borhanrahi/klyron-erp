"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileSignature,
  ArrowLeft,
  Download,
  Edit,
  Printer,
  Send,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  Check,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const contract = {
  id: "CTR-2024-001",
  title: "Enterprise Platform License Agreement",
  customer: "Acme Corp",
  contact: "Robert Anderson",
  contactTitle: "VP of Engineering",
  email: "robert@acme.com",
  phone: "+1 (555) 123-4567",
  value: "$150,000",
  type: "Annual",
  startDate: "Jan 1, 2024",
  endDate: "Dec 31, 2024",
  paymentTerms: "Quarterly",
  autoRenew: true,
  renewalNotice: "30 days",
  status: "Active",
  statusVariant: "success" as const,
  signedDate: "Dec 28, 2023",
  description:
    "Enterprise platform license for up to 500 users. Includes all premium features, dedicated support, and quarterly business reviews.",
};

const milestones = [
  {
    id: 1,
    title: "Contract Signed",
    date: "Dec 28, 2023",
    completed: true,
  },
  {
    id: 2,
    title: "Onboarding Complete",
    date: "Jan 15, 2024",
    completed: true,
  },
  {
    id: 3,
    title: "Q1 Business Review",
    date: "Apr 1, 2024",
    completed: false,
  },
  {
    id: 4,
    title: "Mid-Term Review",
    date: "Jul 1, 2024",
    completed: false,
  },
  {
    id: 5,
    title: "Renewal Discussion",
    date: "Nov 1, 2024",
    completed: false,
  },
];

const payments = [
  {
    id: 1,
    period: "Q1 2024",
    amount: "$37,500",
    dueDate: "Jan 1, 2024",
    paidDate: "Dec 28, 2023",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: 2,
    period: "Q2 2024",
    amount: "$37,500",
    dueDate: "Apr 1, 2024",
    paidDate: null,
    status: "Pending",
    statusVariant: "warning" as const,
  },
  {
    id: 3,
    period: "Q3 2024",
    amount: "$37,500",
    dueDate: "Jul 1, 2024",
    paidDate: null,
    status: "Upcoming",
    statusVariant: "info" as const,
  },
  {
    id: 4,
    period: "Q4 2024",
    amount: "$37,500",
    dueDate: "Oct 1, 2024",
    paidDate: null,
    status: "Upcoming",
    statusVariant: "muted" as const,
  },
];

export default function ContractDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      <Link
        href="/sales/contracts"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contracts
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{contract.title}</h1>
            <StatusBadge
              status={contract.status}
              variant={contract.statusVariant}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {contract.id} • {contract.customer}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Renew Contract
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Contract Value</p>
          <p className="text-2xl font-bold mt-1">{contract.value}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Contract Type</p>
          <p className="text-2xl font-bold mt-1">{contract.type}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Payment Terms</p>
          <p className="text-2xl font-bold mt-1">{contract.paymentTerms}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Auto-Renew</p>
          <p className="text-2xl font-bold mt-1">
            {contract.autoRenew ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Contract Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-xs text-muted-foreground">
                    {contract.customer} • {contract.contact} ({contract.contactTitle})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contract Period</p>
                  <p className="text-xs text-muted-foreground">
                    {contract.startDate} — {contract.endDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Payment Schedule</p>
                  <p className="text-xs text-muted-foreground">
                    {contract.paymentTerms} payments, {contract.renewalNotice} renewal notice
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {contract.description}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Payment Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Period
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Due Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Paid Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium">
                          {payment.period}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">
                          {payment.amount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {payment.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {payment.paidDate || "—"}
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
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Milestones</h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="relative pl-12">
                    <div
                      className={`absolute left-3.5 top-1 w-3 h-3 rounded-full border-2 ${
                        milestone.completed
                          ? "bg-success border-success"
                          : "bg-card border-border"
                      }`}
                    />
                    <div className="p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {milestone.title}
                        </p>
                        {milestone.completed && (
                          <Check className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {milestone.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Renewal Reminder
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Review Meeting
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <FileSignature className="h-4 w-4" />
                Generate Amendment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
