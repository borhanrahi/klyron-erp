"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KPICard } from "@/components/common/KPICard";
import { apiGet } from "@/lib/api";
import {
  Users,
  UserCheck,
  CalendarOff,
  Clock,
  UserPlus,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  Briefcase,
  DollarSign,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  total_employees: number;
  active_employees: number;
  on_leave: number;
  today_attendance: number;
  pending_approvals: number;
  new_hires: number;
  resignations: number;
}

const recentActivity = [
  { employee: "Sarah Chen", action: "Checked in", time: "09:02 AM", type: "attendance" },
  { employee: "Mike Johnson", action: "Leave request approved", time: "08:45 AM", type: "leave" },
  { employee: "Emily Davis", action: "Payslip generated", time: "08:30 AM", type: "payroll" },
  { employee: "David Park", action: "Training completed", time: "08:15 AM", type: "training" },
  { employee: "Alex Kim", action: "On leave today", time: "08:00 AM", type: "leave" },
  { employee: "Rachel Martinez", action: "Checked in", time: "07:58 AM", type: "attendance" },
  { employee: "James Wilson", action: "Performance review due", time: "Yesterday", type: "performance" },
  { employee: "Lisa Thompson", action: "Asset assigned", time: "Yesterday", type: "asset" },
];

const upcomingEvents = [
  { title: "Payroll Processing", date: "Jun 30, 2024", type: "payroll" },
  { title: "Q2 Performance Reviews", date: "Jul 1 - Jul 15", type: "performance" },
  { title: "Team Building Event", date: "Jul 5, 2024", type: "event" },
  { title: "Annual Leave Deadline", date: "Jul 10, 2024", type: "deadline" },
];

const departmentDistribution = [
  { name: "Engineering", count: 42, percentage: 28 },
  { name: "Marketing", count: 18, percentage: 12 },
  { name: "Product", count: 14, percentage: 9 },
  { name: "Design", count: 12, percentage: 8 },
  { name: "HR", count: 8, percentage: 5 },
  { name: "Finance", count: 16, percentage: 11 },
  { name: "Sales", count: 22, percentage: 15 },
  { name: "Operations", count: 16, percentage: 10 },
];

const quickLinks = [
  { label: "Employee Directory", href: "/hr/employees", icon: <Users className="h-5 w-5" /> },
  { label: "Attendance", href: "/hr/attendance", icon: <Clock className="h-5 w-5" /> },
  { label: "Leave Requests", href: "/hr/leave", icon: <CalendarOff className="h-5 w-5" /> },
  { label: "Payroll", href: "/hr/payroll", icon: <DollarSign className="h-5 w-5" /> },
  { label: "Recruitment", href: "/hr/recruitment", icon: <Briefcase className="h-5 w-5" /> },
  { label: "Training", href: "/hr/training", icon: <GraduationCap className="h-5 w-5" /> },
  { label: "Performance", href: "/hr/performance", icon: <TrendingUp className="h-5 w-5" /> },
  { label: "Reports", href: "/hr/reports", icon: <AlertTriangle className="h-5 w-5" /> },
];

export default function HRDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: DashboardData }>("/hr/dashboard")
      .then((res) => setDashboard(res.data))
      .catch(() => setDashboard({ total_employees: 0, active_employees: 0, on_leave: 0, today_attendance: 0, pending_approvals: 0, new_hires: 0, resignations: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const d = dashboard || { total_employees: 0, active_employees: 0, on_leave: 0, today_attendance: 0, pending_approvals: 0, new_hires: 0, resignations: 0 };

  const kpis = [
    { label: "Total Employees", value: String(d.total_employees), change: "All time", changeType: "up" as const, icon: <Users className="h-5 w-5" />, color: "primary" as const },
    { label: "Active Employees", value: String(d.active_employees), change: "Currently active", changeType: "up" as const, icon: <UserCheck className="h-5 w-5" />, color: "success" as const },
    { label: "On Leave", value: String(d.on_leave), change: "Today", changeType: d.on_leave > 0 ? "down" as const : "up" as const, icon: <CalendarOff className="h-5 w-5" />, color: "warning" as const },
    { label: "Today Attendance", value: `${d.today_attendance}%`, change: "Present today", changeType: "up" as const, icon: <Clock className="h-5 w-5" />, color: "accent" as const },
    { label: "New Hires", value: String(d.new_hires), change: "This period", changeType: "up" as const, icon: <UserPlus className="h-5 w-5" />, color: "success" as const },
    { label: "Pending Approvals", value: String(d.pending_approvals), change: "Needs attention", changeType: d.pending_approvals > 0 ? "down" as const : "up" as const, icon: <ClipboardCheck className="h-5 w-5" />, color: "warning" as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="HR Dashboard"
        description="Overview of your workforce metrics and activities."
        icon={<Users className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
            <Link href="/hr/reports" className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {recentActivity.map((activity, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-muted/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {activity.employee.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.employee}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">Upcoming Events</h3>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CalendarOff className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">Department Distribution</h3>
            </div>
            <div className="p-4 space-y-3">
              {departmentDistribution.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{dept.name}</span>
                    <span className="text-sm font-medium">{dept.count}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
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
