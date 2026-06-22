"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KPICard } from "@/components/common/KPICard";
import { apiGet } from "@/lib/api";
import {
  LayoutDashboard,
  Clock,
  CalendarOff,
  DollarSign,
  Package,
  GraduationCap,
  Megaphone,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

interface AttendanceData {
  check_in: string | null;
  check_out: string | null;
  status: string;
  work_hours: number | null;
}

interface Payslip {
  month: string;
  year: number;
  net_pay: number;
  status: string;
}

interface Holiday {
  name: string;
  date: string;
}

interface DashboardData {
  today_attendance: AttendanceData | null;
  leave_balance_total: number;
  pending_leaves: number;
  upcoming_holidays: Holiday[];
  recent_payslips: Payslip[];
  assigned_assets_count: number;
  pending_trainings: number;
  unread_announcements: number;
}

const quickLinks = [
  { label: "My Profile", href: "/ess/profile", icon: <UserCheck className="h-5 w-5" /> },
  { label: "Attendance", href: "/ess/attendance", icon: <Clock className="h-5 w-5" /> },
  { label: "Leave", href: "/ess/leave", icon: <CalendarOff className="h-5 w-5" /> },
  { label: "Payroll", href: "/ess/payroll", icon: <DollarSign className="h-5 w-5" /> },
  { label: "Benefits", href: "/ess/benefits", icon: <Package className="h-5 w-5" /> },
  { label: "Documents", href: "/ess/documents", icon: <Package className="h-5 w-5" /> },
  { label: "Training", href: "/ess/training", icon: <GraduationCap className="h-5 w-5" /> },
  { label: "Support", href: "/ess/support", icon: <Megaphone className="h-5 w-5" /> },
];

export default function ESSDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: DashboardData }>("/ess/dashboard")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const d = data || {
    today_attendance: null,
    leave_balance_total: 0,
    pending_leaves: 0,
    upcoming_holidays: [],
    recent_payslips: [],
    assigned_assets_count: 0,
    pending_trainings: 0,
    unread_announcements: 0,
  };

  const att = d.today_attendance;
  const kpis = [
    { label: "Today Status", value: att?.status || "N/A", change: att?.check_in ? `In: ${att.check_in.substring(11, 16)}` : "Not checked in", changeType: "up" as const, icon: <Clock className="h-5 w-5" />, color: "primary" as const },
    { label: "Leave Balance", value: String(d.leave_balance_total), change: "Days remaining", changeType: "up" as const, icon: <CalendarOff className="h-5 w-5" />, color: "success" as const },
    { label: "Pending Leaves", value: String(d.pending_leaves), change: "Awaiting approval", changeType: d.pending_leaves > 0 ? "down" as const : "up" as const, icon: <CalendarOff className="h-5 w-5" />, color: "warning" as const },
    { label: "Assigned Assets", value: String(d.assigned_assets_count), change: "Items assigned", changeType: "up" as const, icon: <Package className="h-5 w-5" />, color: "accent" as const },
    { label: "Pending Trainings", value: String(d.pending_trainings), change: "In progress", changeType: d.pending_trainings > 0 ? "down" as const : "up" as const, icon: <GraduationCap className="h-5 w-5" />, color: "warning" as const },
    { label: "Announcements", value: String(d.unread_announcements), change: "Unread", changeType: "up" as const, icon: <Megaphone className="h-5 w-5" />, color: "primary" as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Employee Dashboard"
        description="Your personal HR portal overview."
        icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Upcoming Holidays</h3>
          </div>
          <div className="p-4">
            {d.upcoming_holidays.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming holidays</p>
            ) : (
              <div className="space-y-2">
                {d.upcoming_holidays.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <span className="text-sm font-medium">{h.name}</span>
                    <span className="text-xs text-muted-foreground">{h.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">Recent Payslips</h3>
            </div>
            <div className="p-4">
              {d.recent_payslips.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No payslips yet</p>
              ) : (
                <div className="space-y-2">
                  {d.recent_payslips.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                      <div>
                        <p className="text-sm font-medium">{p.month} {p.year}</p>
                        <p className="text-xs text-muted-foreground">{p.status}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-500">৳{p.net_pay?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {att?.work_hours != null && (
            <div className="rounded-2xl border border-border bg-card shadow-sm p-4">
              <h3 className="text-sm font-semibold mb-2">Today&apos;s Work</h3>
              <div className="text-2xl font-bold text-primary">{att.work_hours}h</div>
              <p className="text-xs text-muted-foreground">Hours worked today</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors active:scale-95"
            >
              <div className="text-primary">{link.icon}</div>
              <span className="text-xs font-medium text-center">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
