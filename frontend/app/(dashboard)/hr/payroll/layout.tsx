"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calculator,
  FileText,
  HandCoins,
  Layers,
  Upload,
  Settings,
  TrendingUp,
} from "lucide-react";

const payrollTabs = [
  { name: "Overview", href: "/hr/payroll", icon: LayoutDashboard },
  { name: "Run Payroll", href: "/hr/payroll/run", icon: Calculator },
  { name: "Payslips", href: "/hr/payroll/payslips", icon: FileText },
  { name: "Bulk Upload", href: "/hr/payroll/bulk-upload", icon: Upload },
  { name: "Salary Structures", href: "/hr/payroll/salary-structures", icon: Layers },
  { name: "Loans & Advances", href: "/hr/payroll/loans", icon: HandCoins },
  { name: "Reports", href: "/hr/payroll/reports", icon: TrendingUp },
  { name: "Settings", href: "/hr/payroll/settings", icon: Settings },
];

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="animate-in fade-in-0 duration-200">
      {/* Sub-navigation tabs */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <nav className="flex items-center gap-1 p-1.5 min-w-max">
            {payrollTabs.map((tab) => {
              const isActive =
                pathname === tab.href ||
                (tab.href !== "/hr/payroll" && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
