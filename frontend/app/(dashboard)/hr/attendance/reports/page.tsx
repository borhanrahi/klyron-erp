"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  BarChart3,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const attendanceSummary = [
  { month: "January", workingDays: 22, present: 20, absent: 1, leave: 1, attendance: "90.9%" },
  { month: "February", workingDays: 20, present: 18, absent: 1, leave: 1, attendance: "90.0%" },
  { month: "March", workingDays: 21, present: 19, absent: 1, leave: 1, attendance: "90.5%" },
  { month: "April", workingDays: 22, present: 20, absent: 0, leave: 2, attendance: "90.9%" },
  { month: "May", workingDays: 21, present: 19, absent: 1, leave: 1, attendance: "90.5%" },
  { month: "June", workingDays: 20, present: 18, absent: 1, leave: 1, attendance: "90.0%" },
];

const departmentAttendance = [
  { department: "Engineering", avgHours: "8.6h", attendance: "92.3%", trend: "up" as const },
  { department: "Marketing", avgHours: "8.2h", attendance: "88.5%", trend: "down" as const },
  { department: "Product", avgHours: "8.4h", attendance: "91.0%", trend: "up" as const },
  { department: "Design", avgHours: "8.3h", attendance: "89.7%", trend: "up" as const },
  { department: "HR", avgHours: "8.1h", attendance: "93.2%", trend: "up" as const },
  { department: "Finance", avgHours: "8.5h", attendance: "90.8%", trend: "down" as const },
  { department: "Sales", avgHours: "8.0h", attendance: "87.4%", trend: "up" as const },
  { department: "DevOps", avgHours: "8.7h", attendance: "94.1%", trend: "up" as const },
];

const lateArrivals = [
  { employee: "Lisa Thompson", department: "Design", lateCount: 4, avgLate: "15 min" },
  { employee: "Omar Hassan", department: "Engineering", lateCount: 3, avgLate: "12 min" },
  { employee: "Priya Patel", department: "Sales", lateCount: 2, avgLate: "10 min" },
  { employee: "David Park", department: "Engineering", lateCount: 2, avgLate: "8 min" },
  { employee: "James Wilson", department: "Finance", lateCount: 1, avgLate: "5 min" },
];

export default function AttendanceReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("June 2024");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Attendance Reports"
        description="Analyze attendance patterns and trends across the organization."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Attendance", href: "/hr/attendance" },
          { label: "Reports" },
        ]}
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option>June 2024</option>
              <option>May 2024</option>
              <option>April 2024</option>
              <option>March 2024</option>
            </select>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Overall Attendance</p>
          <p className="text-2xl font-bold mt-1">90.2%</p>
          <div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-success" /><span className="text-xs text-success">+1.2% vs last month</span></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Avg. Work Hours</p>
          <p className="text-2xl font-bold mt-1">8.4h</p>
          <div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-success" /><span className="text-xs text-success">+0.2h vs last month</span></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Late Arrivals</p>
          <p className="text-2xl font-bold mt-1">24</p>
          <div className="flex items-center gap-1 mt-1"><TrendingDown className="h-3 w-3 text-danger" /><span className="text-xs text-danger">-8 vs last month</span></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Absent Days</p>
          <p className="text-2xl font-bold mt-1">6</p>
          <div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-success" /><span className="text-xs text-success">-3 vs last month</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Monthly Attendance Trend</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Month</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Working Days</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Present</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Absent</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Leave</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {attendanceSummary.map((row) => (
                  <tr key={row.month} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{row.month}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{row.workingDays}</td>
                    <td className="py-3 px-4 text-sm text-success">{row.present}</td>
                    <td className="py-3 px-4 text-sm text-danger">{row.absent}</td>
                    <td className="py-3 px-4 text-sm text-info">{row.leave}</td>
                    <td className="py-3 px-4 text-sm font-medium">{row.attendance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Department Attendance</h3>
          </div>
          <div className="p-4 space-y-4">
            {departmentAttendance.map((dept) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{dept.avgHours} avg</span>
                    <span className="text-sm font-semibold">{dept.attendance}</span>
                    {dept.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-danger" />
                    )}
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: dept.attendance }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Late Arrivals This Month</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Late Count</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Avg. Late</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {lateArrivals.map((item) => (
                <tr key={item.employee} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{item.employee}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{item.department}</td>
                  <td className="py-3 px-4 text-sm text-warning font-medium">{item.lateCount}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{item.avgLate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
