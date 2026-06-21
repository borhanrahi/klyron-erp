"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  UserPlus,
  Save,
  ArrowLeft,
  Upload,
  Calendar,
  DollarSign,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const departments = [
  "Engineering",
  "Marketing",
  "Product",
  "Design",
  "HR",
  "Finance",
  "Sales",
  "DevOps",
  "Operations",
];

const designations = [
  "Junior Developer",
  "Mid-Level Developer",
  "Senior Developer",
  "Lead Developer",
  "Manager",
  "Senior Manager",
  "Director",
  "VP",
  "Specialist",
  "Analyst",
  "Coordinator",
];

export default function NewEmployeePage() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Add New Employee"
        description="Fill in the details to onboard a new team member."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Employees", href: "/hr/employees" },
          { label: "New Employee" },
        ]}
        icon={<UserPlus className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/hr/employees"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </a>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "personal", label: "Personal Information" },
          { id: "employment", label: "Employment Details" },
          { id: "salary", label: "Salary & Benefits" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Personal Information */}
      {activeTab === "personal" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                First Name *
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Last Name *
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="employee@klyron.com"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Date of Birth *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Gender
              </label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  rows={2}
                  placeholder="Enter full address"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                placeholder="Contact name"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Profile Photo
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employment Details */}
      {activeTab === "employment" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Employee ID *
              </label>
              <input
                type="text"
                value="EMP-011"
                readOnly
                className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Department *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Designation *
              </label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select designation</option>
                {designations.map((des) => (
                  <option key={des} value={des}>
                    {des}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Employment Type *
              </label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Joining Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Reporting Manager
              </label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select manager</option>
                <option value="sarah">Sarah Chen</option>
                <option value="mike">Mike Johnson</option>
                <option value="emily">Emily Davis</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Work Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="office">Office - New York</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary & Benefits */}
      {activeTab === "salary" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Salary & Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Base Salary (Annual) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Pay Frequency
              </label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                placeholder="Enter account number"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                Benefits
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "Health Insurance",
                  "Dental Insurance",
                  "Vision Insurance",
                  "401(k) Match",
                  "Life Insurance",
                  "Paid Time Off",
                  "Remote Work",
                  "Learning Budget",
                ].map((benefit) => (
                  <label
                    key={benefit}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/hr/employees"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </a>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Employee
        </button>
      </div>
    </div>
  );
}
