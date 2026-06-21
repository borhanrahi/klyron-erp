"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Layout,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Phone,
  FileText,
  CheckSquare,
  List,
  Calendar,
  Upload,
} from "lucide-react";

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "textarea", label: "Text Area", icon: FileText },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "select", label: "Dropdown", icon: List },
  { type: "date", label: "Date Picker", icon: Calendar },
  { type: "file", label: "File Upload", icon: Upload },
];

export default function NewFormPage() {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<{ id: number; type: string; label: string; required: boolean }[]>([]);

  const addField = (type: string) => {
    setFields((prev) => [
      ...prev,
      { id: Date.now(), type, label: "", required: false },
    ]);
  };

  const removeField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Create Form"
        description="Build a custom form with drag-and-drop fields."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Form Builder", href: "/admin/form-builder" },
          { label: "New Form" },
        ]}
        icon={<Layout className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/admin/form-builder"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </a>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Settings */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Form Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Form Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Contact Form"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Submit Button Text</label>
                <input type="text" defaultValue="Submit" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Success Message</label>
                <input type="text" defaultValue="Thank you for your submission!" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layout className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No fields added yet. Click a field type to add it.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <span className="text-sm font-mono text-muted-foreground w-8">{index + 1}</span>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        setFields((prev) =>
                          prev.map((f) =>
                            f.id === field.id ? { ...f, label: e.target.value } : f
                          )
                        );
                      }}
                      placeholder="Field label"
                      className="flex-1 px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-background rounded">{field.type}</span>
                    <label className="flex items-center gap-1 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          setFields((prev) =>
                            prev.map((f) =>
                              f.id === field.id ? { ...f, required: e.target.checked } : f
                            )
                          );
                        }}
                        className="accent-primary"
                      />
                      Required
                    </label>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Field Types */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Add Field</h3>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map((ft) => {
                const Icon = ft.icon;
                return (
                  <button
                    key={ft.type}
                    onClick={() => addField(ft.type)}
                    className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{ft.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Form Name</span>
                <span className="text-sm font-medium">{formName || "Not set"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Fields</span>
                <span className="text-sm font-medium">{fields.length}</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-2">
            <Save className="h-4 w-4" />
            Create Form
          </button>
        </div>
      </div>
    </div>
  );
}
