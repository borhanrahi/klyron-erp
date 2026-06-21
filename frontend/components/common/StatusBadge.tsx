"use client";

import { ReactNode } from "react";

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "danger" | "info" | "primary" | "muted";
}

const variantMap = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  info: "bg-info/10 text-info border-info/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, variant = "info" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantMap[variant]}`}
    >
      {status}
    </span>
  );
}
