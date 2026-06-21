"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Clock,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

const attendanceStats = [
  { label: "Present Today", value: "128", change: "86.5% attendance" },
  { label: "Absent Today", value: "8", change: "5.4% absence" },
  { label: "On Leave", value: "12", change: "8.1% on leave" },
  { label: "Avg. Work Hours", value: "8.4h", change: "+0.2h vs last week" },
];

const attendanceData = [
  { id: 1, employee: "Sarah Chen", avatar: "SC", department: "Engineering", checkIn: "09:02 AM", checkOut: "06:15 PM", hours: "9h 13m", status: "Present", statusVariant: "success" as const },
  { id: 2, employee: "Mike Johnson", avatar: "MJ", department: "Marketing", checkIn: "08:55 AM", checkOut: "05:30 PM", hours: "8h 35m", status: "Present", statusVariant: "success" as const },
  { id: 3, employee: "Emily Davis", avatar: "ED", department: "Product", checkIn: "09:30 AM", checkOut: "04:00 PM", hours: "6h 30m", status: "Half Day", statusVariant: "warning" as const },
  { id: 4, employee: "David Park", avatar: "DP", department: "Engineering", checkIn: "-", checkOut: "-", hours: "-", status: "Absent", statusVariant: "danger" as const },
  { id: 5, employee: "Alex Kim", avatar: "AK", department: "DevOps", checkIn: "-", checkOut: "-", hours: "-", status: "Leave", statusVariant: "info" as const },
  { id: 6, employee: "Rachel Martinez", avatar: "RM", department: "HR", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "9h 00m", status: "Present", statusVariant: "success" as const },
  { id: 7, employee: "James Wilson", avatar: "JW", department: "Finance", checkIn: "08:45 AM", checkOut: "05:45 PM", hours: "9h 00m", status: "Present", statusVariant: "success" as const },
  { id: 8, employee: "Lisa Thompson", avatar: "LT", department: "Design", checkIn: "10:00 AM", checkOut: "06:30 PM", hours: "8h 30m", status: "Late", statusVariant: "warning" as const },
  { id: 9, employee: "Omar Hassan", avatar: "OH", department: "Engineering", checkIn: "09:05 AM", checkOut: "06:20 PM", hours: "9h 15m", status: "Present", statusVariant: "success" as const },
  { id: 10, employee: "Priya Patel", avatar: "PP", department: "Sales", checkIn: "08:50 AM", checkOut: "05:50 PM", hours: "9h 00m", status: "Present", statusVariant: "success" as const },
];

const calendarDays = [
  { day: 1, status: "present" },
  { day: 2, status: "present" },
  { day: 3, status: "present" },
  { day: 4, status: "late" },
  { day: 5, status: "present" },
  { day: 6, status: "absent" },
  { day: 7, status: "weekend" },
  { day: 8, status: "present" },
  { day: 9, status: "present" },
  { day: 10, status: "leave" },
  { day: 11, status: "present" },
  { day: 12, status: "present" },
  { day: 13, status: "weekend" },
  { day: 14, status: "present" },
  { day: 15, status: "present" },
  { day: 16, status: "half-day" },
  { day: 17, status: "today" },
  { day: 18, status: "upcoming" },
  { day: 19, status: "upcoming" },
  { day: 20, status: "upcoming" },
  { day: 21, status: "weekend" },
  { day: 22, status: "upcoming" },
  { day: 23, status: "upcoming" },
  { day: 24, status: "upcoming" },
  { day: 25, status: "upcoming" },
  { day: 26, status: "upcoming" },
  { day: 27, status: "weekend" },
  { day: 28, status: "upcoming" },
  { day: 29, status: "upcoming" },
  { day: 30, status: "upcoming" },
];

const statusColors: Record<string, string> = {
  present: "bg-success",
  today: "bg-primary",
  late: "bg-warning",
  "half-day": "bg-warning/60",
  absent: "bg-danger",
  leave: "bg-info",
  weekend: "bg-muted",
  upcoming: "bg-muted/50",
};

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-06-17");

  const filteredData = attendanceData.filter(
    (record) =>
      record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Attendance Tracker"
        description="Track daily attendance, check-in/out times, and work hours."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Attendance" },
        ]}
        icon={<Clock className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {attendanceStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">June 2024</h3>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <button
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${
                  day.status === "weekend"
                    ? "text-muted-foreground"
                    : day.status === "upcoming"
                    ? "text-muted-foreground/50"
                    : "hover:ring-2 hover:ring-primary/50"
                }`}
              >
                <div className="relative">
                  {day.day}
                  {day.status !== "weekend" && day.status !== "upcoming" && (
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${statusColors[day.status]}`} />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Present", color: "bg-success" },
                { label: "Late", color: "bg-warning" },
                { label: "Absent", color: "bg-danger" },
                { label: "Leave", color: "bg-info" },
                { label: "Half Day", color: "bg-warning/60" },
                { label: "Today", color: "bg-primary" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Check In</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Check Out</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Hours</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {record.avatar}
                        </div>
                        <span className="text-sm font-medium">{record.employee}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{record.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${record.checkIn === "-" ? "text-muted-foreground" : ""}`}>
                        {record.checkIn}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${record.checkOut === "-" ? "text-muted-foreground" : ""}`}>
                        {record.checkOut}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{record.hours}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={record.status} variant={record.statusVariant} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
