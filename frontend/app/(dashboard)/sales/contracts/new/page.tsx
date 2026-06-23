"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FileSignature,
  ArrowLeft,
  Save,
  Building2,
  Calendar,
  DollarSign,
  User,
  FileText,
  Send,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";

export default function NewContractPage() {
  const [formData, setFormData] = useState({
    customer: "",
    contactName: "",
    contactEmail: "",
    title: "",
    type: "",
    value: "",
    startDate: "",
    endDate: "",
    paymentTerms: "",
    autoRenew: "yes",
    renewalNotice: "30",
    description: "",
    terms: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link
          href="/sales"
          className="hover:text-foreground transition-colors"
        >
          Sales
        </Link>
        <span>/</span>
        <Link
          href="/sales/contracts"
          className="hover:text-foreground transition-colors"
        >
          Contracts
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Contract
        </span>
      </div>

      <PageHeader
        title="Create Contract"
        description="Draft a new contract for your customer."
        icon={<FileSignature className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/contracts"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contracts
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Customer Information
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Customer *
            </label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select customer</option>
              <option value="acme">Acme Corp</option>
              <option value="techstart">TechStart Inc</option>
              <option value="global">Global Industries</option>
              <option value="creative">Creative Solutions</option>
              <option value="dataflow">DataFlow Systems</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="email@company.com"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Contract Details
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Contract Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Enterprise Platform License Agreement"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Contract Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select type</option>
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
              <option value="project">Project-Based</option>
              <option value="perpetual">Perpetual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Contract Value *
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Start Date *
            </label>
            <DatePicker
              value={formData.startDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, startDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              End Date *
            </label>
            <DatePicker
              value={formData.endDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, endDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Terms
            </label>
            <select
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select terms</option>
              <option value="upfront">Full Upfront</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="milestone">Milestone-Based</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Auto-Renew
            </label>
            <select
              name="autoRenew"
              value={formData.autoRenew}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Renewal Notice (days)
            </label>
            <select
              name="renewalNotice"
              value={formData.renewalNotice}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="15">15 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Terms & Description
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Contract Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Describe the contract scope and deliverables..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Terms & Conditions
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Legal terms and conditions..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/sales/contracts"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save as Draft
        </button>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Send className="h-4 w-4" />
          Send for Signature
        </button>
      </div>
    </div>
  );
}
