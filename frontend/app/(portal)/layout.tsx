"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  FolderOpen,
  LogOut,
} from "lucide-react";

const portalNavigation = [
  { name: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { name: "Invoices", href: "/portal/invoices", icon: FileText },
  { name: "Orders", href: "/portal/orders", icon: ShoppingCart },
  { name: "Payments", href: "/portal/payments", icon: CreditCard },
  { name: "Quotations", href: "/portal/quotations", icon: FileText },
  { name: "Documents", href: "/portal/documents", icon: FolderOpen },
  { name: "Support", href: "/portal/tickets", icon: MessageSquare },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="bg-card/80 backdrop-blur-md w-[280px] h-screen sticky left-0 top-0 border-r border-border shadow-lg flex flex-col p-4 z-40 hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">
            K
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">Klyron Portal</h1>
            <p className="text-xs text-muted-foreground">Customer Self-Service</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {portalNavigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
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

        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
