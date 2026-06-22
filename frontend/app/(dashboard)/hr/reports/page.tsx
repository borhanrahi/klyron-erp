"use client";

import { PageHeader } from "@/components/common/PageHeader";
import {
  BarChart3,
  Users,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const reportCategories = [
  {
    title: "Workforce Reports",
    icon: <Users className="h-5 w-5" />,
    color: "bg-primary/10 text-primary",
    reports: [
      { name: "Headcount Summary", href: "/hr/reports", description: "Total employees by department, location, and type" },
      { name: "Employee Turnover", href: "/hr/reports", description: "Attrition rates and retention analysis" },
      { name: "New Hires Report", href: "/hr/reports", description: "Recent hires and onboarding status" },
      { name: "Demographics Report", href: "/hr/reports", description: "Workforce diversity and demographics" },
    ],
  },
  {
    title: "Attendance Reports",
    icon: <Clock className="h-5 w-5" />,
    color: "bg-success/10 text-success",
    reports: [
      { name: "Daily Attendance", href: "/hr/attendance/reports", description: "Daily check-in/out summary" },
      { name: "Late Arrivals", href: "/hr/attendance/reports", description: "Late arrival patterns and trends" },
      { name: "Overtime Report", href: "/hr/attendance/reports", description: "Overtime hours and costs" },
      { name: "Absenteeism Report", href: "/hr/attendance/reports", description: "Absenteeism patterns and analysis" },
    ],
  },
  {
    title: "Leave Reports",
    icon: <Calendar className="h-5 w-5" />,
    color: "bg-info/10 text-info",
    reports: [
      { name: "Leave Balance", href: "/hr/leave/balances", description: "Current leave balances by employee" },
      { name: "Leave Utilization", href: "/hr/reports", description: "Leave usage trends and patterns" },
      { name: "Pending Approvals", href: "/hr/leaves", description: "Outstanding leave requests" },
      { name: "Leave Calendar", href: "/hr/leave/calendar", description: "Upcoming leave schedule" },
    ],
  },
  {
    title: "Payroll Reports",
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-warning/10 text-warning",
    reports: [
      { name: "Payroll Summary", href: "/hr/payroll", description: "Monthly payroll overview" },
      { name: "Salary Register", href: "/hr/payroll/payslips", description: "Complete salary register" },
      { name: "Deduction Report", href: "/hr/payroll", description: "Deduction breakdown and analysis" },
      { name: "Loan Summary", href: "/hr/payroll/loans", description: "Outstanding loans and repayments" },
    ],
  },
  {
    title: "Performance Reports",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "bg-accent/10 text-accent",
    reports: [
      { name: "Performance Overview", href: "/hr/performance", description: "Overall performance metrics" },
      { name: "KPI Dashboard", href: "/hr/performance/kpis", description: "KPI tracking and analysis" },
      { name: "Review Completion", href: "/hr/performance/reviews", description: "Review cycle progress" },
      { name: "Appraisal Summary", href: "/hr/performance/appraisals", description: "Appraisal outcomes and salary changes" },
    ],
  },
  {
    title: "Training Reports",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-danger/10 text-danger",
    reports: [
      { name: "Training Summary", href: "/hr/training", description: "Training programs overview" },
      { name: "Certification Status", href: "/hr/training/certifications", description: "Certification tracking" },
      { name: "Training Costs", href: "/hr/training", description: "Training budget utilization" },
      { name: "Skills Matrix", href: "/hr/reports", description: "Employee skills and competencies" },
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="HR Reports"
        description="Comprehensive reporting hub for all HR metrics and analytics."
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCategories.map((category) => (
          <div key={category.title} className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${category.color}`}>{category.icon}</div>
                <h3 className="text-sm font-semibold">{category.title}</h3>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {category.reports.map((report) => (
                <Link
                  key={report.name}
                  href={report.href}
                  className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
