"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Palette,
  Save,
  Sun,
  Moon,
  Monitor,
  Sidebar,
  Layout,
  Check,
} from "lucide-react";

const colorPresets = [
  { name: "Indigo", primary: "#4F46E5", colors: ["#4F46E5", "#7C3AED", "#2563EB"] },
  { name: "Blue", primary: "#3B82F6", colors: ["#3B82F6", "#0EA5E9", "#1D4ED8"] },
  { name: "Green", primary: "#10B981", colors: ["#10B981", "#059669", "#047857"] },
  { name: "Red", primary: "#EF4444", colors: ["#EF4444", "#DC2626", "#B91C1C"] },
  { name: "Orange", primary: "#F59E0B", colors: ["#F59E0B", "#D97706", "#B45309"] },
  { name: "Pink", primary: "#EC4899", colors: ["#EC4899", "#DB2777", "#BE185D"] },
];

const sidebarStyles = [
  { id: "compact", label: "Compact", description: "Narrow sidebar with icons only" },
  { id: "expanded", label: "Expanded", description: "Full sidebar with labels" },
  { id: "floating", label: "Floating", description: "Floating sidebar panel" },
];

export default function ThemePage() {
  const [theme, setTheme] = useState("dark");
  const [selectedColor, setSelectedColor] = useState("#4F46E5");
  const [sidebarStyle, setSidebarStyle] = useState("expanded");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Theme Customization"
        description="Customize the appearance and feel of your ERP interface."
        icon={<Palette className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Theme" },
        ]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Theme
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Mode */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Appearance Mode</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Monitor },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setTheme(mode.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                    theme === mode.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${theme === mode.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${theme === mode.id ? "text-primary" : "text-muted-foreground"}`}>
                    {mode.label}
                  </span>
                  {theme === mode.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Color */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Primary Color</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setSelectedColor(preset.primary)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    selectedColor === preset.primary
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span className="text-sm font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Custom Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Style */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sidebar Style</h3>
          <div className="space-y-3">
            {sidebarStyles.map((style) => (
              <label
                key={style.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                  sidebarStyle === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <input
                  type="radio"
                  name="sidebar"
                  value={style.id}
                  checked={sidebarStyle === style.id}
                  onChange={(e) => setSidebarStyle(e.target.value)}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium">{style.label}</p>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="h-8 bg-muted flex items-center px-3 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
            </div>
            <div className="flex h-40">
              <div className="w-16 border-r border-border p-2 flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: selectedColor + "20" }}>
                  <div className="w-full h-full rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: selectedColor }} />
                  </div>
                </div>
                <div className="w-8 h-2 bg-muted rounded" />
                <div className="w-8 h-2 bg-muted rounded" />
                <div className="w-8 h-2 bg-muted rounded" />
              </div>
              <div className="flex-1 p-3 bg-background">
                <div className="h-4 w-32 bg-muted rounded mb-2" />
                <div className="h-2 w-48 bg-muted/50 rounded mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 bg-muted rounded" />
                  <div className="h-16 bg-muted rounded" />
                  <div className="h-16 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
