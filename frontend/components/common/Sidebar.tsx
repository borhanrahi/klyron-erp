"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  Briefcase,
  ShoppingCart,
  HeadphonesIcon,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  UserCheck,
  ClipboardList,
  Building2,
  FileText,
  CreditCard,
  BarChart3,
  MessageSquare,
  Target,
  Wrench,
  Shield,
  Globe,
  Bell,
  Palette,
  Receipt,
  Wallet,
  Banknote,
  PieChart,
  Truck,
  Box,
  Archive,
  RotateCcw,
  FileCheck,
  Handshake,
  Phone,
  Megaphone,
  Monitor,
  History,
  BarChart2,
  FolderKanban,
  Bug,
  Clock,
  Ticket,
  Calendar,
  BookOpen,
  HelpCircle,
  Heart,
  Award,
  ClipboardCheck,
  GraduationCap,
  GitBranch,
  ChartNetwork,
  UserCog,
  HandCoins,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      { name: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Team Dashboard", href: "/dashboard/team", icon: Users },
      { name: "Activity Feed", href: "/dashboard/activity", icon: ClipboardList },
    ],
  },
  {
    label: "Sales",
    items: [
      { name: "Orders", href: "/sales/orders", icon: ShoppingCart },
      { name: "Leads", href: "/sales/leads", icon: Target },
      { name: "Deals", href: "/sales/deals", icon: Handshake },
      { name: "Quotations", href: "/sales/quotations", icon: FileText },
      { name: "Customers", href: "/sales/customers", icon: Users },
      { name: "Contracts", href: "/sales/contracts", icon: FileCheck },
      { name: "Inquiries", href: "/sales/inquiries", icon: Phone },
      { name: "Campaigns", href: "/sales/campaigns", icon: Megaphone },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "General Ledger", href: "/finance/ledger", icon: BookOpen },
      { name: "Invoices", href: "/finance/invoices", icon: Receipt },
      { name: "Journal Entries", href: "/finance/journal", icon: FileText },
      { name: "Credit Notes", href: "/finance/credit-notes", icon: CreditCard },
      { name: "Debit Notes", href: "/finance/debit-notes", icon: Banknote },
      { name: "Estimates", href: "/finance/estimates", icon: PieChart },
      { name: "Banking", href: "/finance/banking", icon: Wallet },
      { name: "Reports", href: "/finance/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Procurement",
    items: [
      { name: "Purchase Requisitions", href: "/procurement/requisitions", icon: ClipboardList },
      { name: "RFQs", href: "/procurement/rfq", icon: FileText },
      { name: "Purchase Orders", href: "/procurement/purchase-orders", icon: ShoppingCart },
      { name: "GRN", href: "/procurement/grn", icon: Truck },
      { name: "Suppliers", href: "/procurement/suppliers", icon: Building2 },
    ],
  },
  {
    label: "Inventory",
    items: [
      { name: "Items", href: "/inventory/items", icon: Package },
      { name: "Stock", href: "/inventory/stock", icon: Box },
      { name: "Warehouses", href: "/inventory/warehouses", icon: Archive },
      { name: "Adjustments", href: "/inventory/adjustments", icon: RotateCcw },
    ],
  },
  {
    label: "HR",
    items: [
      { name: "Employees", href: "/hr/employees", icon: Users },
      { name: "Teams", href: "/hr/teams", icon: GitBranch },
      { name: "Org Chart", href: "/hr/org-chart", icon: ChartNetwork },
      { name: "Attendance", href: "/hr/attendance", icon: UserCheck },
      { name: "Leave Approvals", href: "/hr/leaves", icon: Calendar },
      { name: "Payroll", href: "/hr/payroll", icon: DollarSign },
      { name: "Recruitment", href: "/hr/recruitment", icon: Briefcase },
      { name: "Training", href: "/hr/training", icon: BookOpen },
      { name: "Performance", href: "/hr/performance", icon: TrendingUp },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Dashboard", href: "/management", icon: LayoutDashboard },
      { name: "My Team", href: "/management/my-team", icon: UserCog },
      { name: "Leave Approvals", href: "/management/leaves", icon: Calendar },
      { name: "Loan Approvals", href: "/management/loans", icon: HandCoins },
      { name: "Team Attendance", href: "/management/attendance", icon: UserCheck },
      { name: "Tasks", href: "/management/tasks", icon: ClipboardList },
      { name: "Performance", href: "/management/performance", icon: TrendingUp },
    ],
  },
  {
    label: "Employee",
    items: [
      { name: "My Dashboard", href: "/ess", icon: LayoutDashboard },
      { name: "My Profile", href: "/ess/profile", icon: UserCheck },
      { name: "Attendance", href: "/ess/attendance", icon: Clock },
      { name: "Leave", href: "/ess/leave", icon: Calendar },
      { name: "Apply for Leave", href: "/ess/leave/apply", icon: Calendar },
      { name: "Payroll", href: "/ess/payroll", icon: DollarSign },
      { name: "Benefits", href: "/ess/benefits", icon: Heart },
      { name: "Documents", href: "/ess/documents", icon: FileText },
      { name: "Assets", href: "/ess/assets", icon: Package },
      { name: "Training", href: "/ess/training", icon: GraduationCap },
      { name: "Performance", href: "/ess/performance", icon: TrendingUp },
      { name: "Apply for Loan", href: "/ess/loans", icon: HandCoins },
      { name: "My Approvals", href: "/ess/approvals", icon: ClipboardCheck },
      { name: "Requests", href: "/ess/requests", icon: ClipboardList },
      { name: "Support", href: "/ess/support", icon: HeadphonesIcon },
    ],
  },
  {
    label: "CRM",
    items: [
      { name: "Inquiries", href: "/crm/inquiries", icon: MessageSquare },
      { name: "Campaigns", href: "/crm/campaigns", icon: Megaphone },
    ],
  },
  {
    label: "POS",
    items: [
      { name: "Terminal", href: "/pos/terminal", icon: Monitor },
      { name: "History", href: "/pos/history", icon: History },
      { name: "Reports", href: "/pos/reports", icon: BarChart2 },
    ],
  },
  {
    label: "Projects",
    items: [
      { name: "Projects", href: "/projects/projects", icon: FolderKanban },
      { name: "Tasks", href: "/projects/tasks", icon: ClipboardList },
      { name: "Bugs", href: "/projects/bugs", icon: Bug },
      { name: "Timesheets", href: "/projects/timesheets", icon: Clock },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Tickets", href: "/support/tickets", icon: Ticket },
      { name: "Knowledge Base", href: "/support/knowledge", icon: BookOpen },
      { name: "Meetings", href: "/support/meetings", icon: Calendar },
    ],
  },
  {
    label: "Reports",
    items: [
      { name: "All Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Admin",
    items: [
      { name: "Company Profile", href: "/admin/company", icon: Building2 },
      { name: "Branches", href: "/admin/branches", icon: Globe },
      { name: "Roles & Permissions", href: "/admin/roles", icon: Shield },
      { name: "User Management", href: "/admin/users", icon: Users },
      { name: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
      { name: "Workflow Builder", href: "/admin/workflows", icon: GitBranch },
      { name: "Form Builder", href: "/admin/form-builder", icon: Wrench },
      { name: "Integrations", href: "/admin/integrations", icon: Globe },
      { name: "System Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Profile", href: "/settings/profile", icon: UserCheck },
      { name: "Billing", href: "/settings/billing", icon: CreditCard },
      { name: "Theme", href: "/settings/theme", icon: Palette },
      { name: "Notifications", href: "/settings/notifications", icon: Bell },
      { name: "Currencies", href: "/settings/currencies", icon: DollarSign },
    ],
  },
];

/** Module permissions prefix for each sidebar group */
const GROUP_PERMISSION_PREFIXES: Record<string, string[]> = {
  "Dashboard": ["dashboard.executive", "dashboard.team", "dashboard.reports"],
  "Sales": ["sales.orders", "sales.leads", "sales.deals", "sales.quotations", "sales.customers", "sales.contracts", "sales.campaigns"],
  "Finance": ["finance.ledger", "finance.invoices", "finance.journal", "finance.credit_notes", "finance.banking", "finance.estimates"],
  "Procurement": ["procurement.requisitions", "procurement.purchase_orders", "procurement.suppliers"],
  "Inventory": ["inventory.items", "inventory.stock", "inventory.warehouses", "inventory.adjustments"],
  "Management": ["mgmt.dashboard", "mgmt.my_team", "mgmt.leave_approvals", "mgmt.loan_approvals", "mgmt.attendance", "mgmt.tasks", "mgmt.performance"],
  "HR": ["hr.employees", "hr.payroll", "hr.recruitment", "hr.training", "hr.performance"],
  "Employee": ["ess.profile", "ess.attendance", "ess.leave", "ess.payroll", "ess.loans", "ess.benefits", "ess.documents", "ess.support"],
  "CRM": ["crm.inquiries", "crm.campaigns"],
  "POS": ["pos.terminal", "pos.history", "pos.reports"],
  "Projects": ["projects.projects", "projects.tasks", "projects.bugs", "projects.timesheets"],
  "Support": ["support.tickets", "support.knowledge_base"],
  // Reports is visible to all users; content filtering happens on the page itself
  //"Reports": ["dashboard.reports"],
  "Admin": ["admin.company", "admin.branches", "admin.roles", "admin.users", "admin.settings", "admin.workflows"],
  "Settings": ["settings.profile", "settings.billing", "settings.theme", "settings.notifications"],
};

function CollapsibleGroup({
  group,
  pathname,
  isOpen,
  onToggle,
}: {
  group: NavGroup;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasActive = group.items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
          hasActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {group.label}
        {isOpen ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </button>
      {isOpen && (
        <div className="mt-1 space-y-0.5">
          {group.items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm ${
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { canViewAny, loading } = usePermissions();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationGroups.forEach((group) => {
      const hasActive = group.items.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
      );
      initial[group.label] = hasActive;
    });
    if (!Object.values(initial).some(Boolean)) {
      initial["Dashboard"] = true;
    }
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Filter groups based on permissions (show empty during loading to avoid flash)
  const visibleGroups = loading
    ? []
    : navigationGroups.filter((group) => {
        const prefixes = GROUP_PERMISSION_PREFIXES[group.label];
        if (!prefixes) return true; // show groups without permission mappings
        return canViewAny(prefixes);
      });

  return (
    <aside className="bg-card/80 backdrop-blur-md w-[280px] h-screen sticky left-0 top-0 border-r border-border shadow-lg flex flex-col z-40 hidden md:flex shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 px-4 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
          K
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Klyron ERP</h1>
          <p className="text-xs text-muted-foreground">Enterprise Resource Planning</p>
        </div>
      </div>

      {/* Navigation - filtered by permissions */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {visibleGroups.map((group) => (
          <CollapsibleGroup
            key={group.label}
            group={group}
            pathname={pathname}
            isOpen={openGroups[group.label] ?? false}
            onToggle={() => toggleGroup(group.label)}
          />
        ))}
      </nav>

      {/* CTA */}
      <div className="p-4 border-t border-border">
        <button className="w-full bg-primary text-white font-medium text-sm py-2.5 rounded-lg hover:bg-primary-hover transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer">
          <Plus className="h-4 w-4" />
          Quick Create
        </button>
      </div>
    </aside>
  );
}
