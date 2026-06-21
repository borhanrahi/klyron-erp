"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Warehouse,
  Save,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Users,
  Settings,
} from "lucide-react";

export default function NewWarehousePage() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "China",
    phone: "",
    email: "",
    manager: "",
    managerPhone: "",
    totalBins: "",
    operatingHours: "Mon-Sat 8:00 AM - 6:00 PM",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Add New Warehouse"
        description="Create a new warehouse location with details and settings."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Warehouses", href: "/inventory/warehouses" },
          { label: "New Warehouse" },
        ]}
        icon={<Warehouse className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/inventory/warehouses"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Warehouses
          </a>
        }
      />

      <form className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-primary" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Warehouse Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Shanghai Main Warehouse"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Warehouse Code *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SH-01"
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description of this warehouse..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="No. 88 Zhangyang Road"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Shanghai"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                State / Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Shanghai"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Zip / Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="e.g. 200120"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              >
                <option value="China">China</option>
                <option value="USA">United States</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Warehouse Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+86 21 5888 9999"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Warehouse Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="warehouse@klyron.com"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Manager */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Warehouse Manager
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Manager Name *
              </label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                placeholder="e.g. Zhang Wei"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Manager Phone
              </label>
              <input
                type="tel"
                name="managerPhone"
                value={formData.managerPhone}
                onChange={handleChange}
                placeholder="+86 138 0000 0000"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Warehouse Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Total Storage Bins
              </label>
              <input
                type="number"
                name="totalBins"
                value={formData.totalBins}
                onChange={handleChange}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Operating Hours
              </label>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <a
            href="/inventory/warehouses"
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Warehouse
          </button>
        </div>
      </form>
    </div>
  );
}
