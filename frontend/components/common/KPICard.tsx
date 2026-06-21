"use client";

import { ReactNode } from "react";

interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: ReactNode;
  color?: "primary" | "success" | "warning" | "accent" | "danger";
}

export function KPICard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  color = "primary",
}: KPICardProps) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    accent: "bg-accent/10 text-accent",
    danger: "bg-danger/10 text-danger",
  };

  const changeColor = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-semibold ${changeColor[changeType]}`}>
            {changeType === "up" && "↑"}
            {changeType === "down" && "↓"}
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
