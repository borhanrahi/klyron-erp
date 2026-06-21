"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  Briefcase,
  FolderKanban,
  HeadphonesIcon,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "CRM", href: "/sales", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "HRM", href: "/hr", icon: Briefcase },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Support", href: "/support", icon: HeadphonesIcon },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card/80 backdrop-blur-md w-[280px] h-screen sticky left-0 top-0 border-r border-border shadow-lg flex flex-col p-4 z-40 hidden md:flex shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">
          K
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary">Klyron ERP</h1>
          <p className="text-xs text-muted-foreground">Enterprise Resource Planning</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? "text-primary bg-primary/10 font-semibold border-r-2 border-primary"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="mt-4">
        <button className="w-full bg-primary text-white font-medium text-sm py-2 rounded-lg hover:bg-primary-hover transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>
    </aside>
  );
}
