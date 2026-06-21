"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Users,
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  FileText,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function NewCustomerPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    taxId: "",
    paymentTerms: "",
    creditLimit: "",
    notes: "",
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
          href="/sales/customers"
          className="hover:text-foreground transition-colors"
        >
          Customers
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Customer
        </span>
      </div>

      <PageHeader
        title="Add New Customer"
        description="Register a new customer in your system."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/customers"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Company Information
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Basic company details
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Primary Contact *
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
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="email@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="https://company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Industry *
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tax ID / VAT Number
            </label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Tax identification number"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Billing and shipping address
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Street address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              State / Province
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="ZIP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select country</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="de">Germany</option>
              <option value="au">Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Billing Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Payment and credit information
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option value="net15">Net 15</option>
              <option value="net30">Net 30</option>
              <option value="net45">Net 45</option>
              <option value="net60">Net 60</option>
              <option value="due-receipt">Due on Receipt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Credit Limit
            </label>
            <input
              type="text"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="$0.00"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Additional Notes
          </h3>
        </div>
        <div className="p-6">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            placeholder="Add notes about this customer..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/sales/customers"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Create Customer
        </button>
      </div>
    </div>
  );
}
