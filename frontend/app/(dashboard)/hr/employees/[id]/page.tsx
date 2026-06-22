"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Edit,
  ArrowLeft,
  FileText,
  Laptop,
  Clock,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Star,
  CheckCircle,
} from "lucide-react";

const employeeData = {
  id: "EMP-001",
  name: "Sarah Chen",
  avatar: "SC",
  email: "sarah.chen@klyron.com",
  phone: "+1 (555) 234-5678",
  address: "123 Tech Street, San Francisco, CA 94105",
  dateOfBirth: "Mar 15, 1992",
  gender: "Female",
  emergencyContact: "John Chen - +1 (555) 234-5679",
  department: "Engineering",
  designation: "Senior Developer",
  reportingManager: "Emily Davis",
  joinDate: "Jan 15, 2022",
  employmentType: "Full-Time",
  workLocation: "Remote",
  status: "Active",
  statusVariant: "success" as const,
  salary: "$85,000",
  bankAccount: "****4567",
  taxId: "***-**-1234",
  benefits: ["Health Insurance", "401(k)", "Dental"],
};

const attendanceData = [
  { date: "Jun 17, 2024", checkIn: "09:02 AM", checkOut: "06:15 PM", hours: "9h 13m", status: "Present", statusVariant: "success" as const },
  { date: "Jun 16, 2024", checkIn: "08:58 AM", checkOut: "05:45 PM", hours: "8h 47m", status: "Present", statusVariant: "success" as const },
  { date: "Jun 15, 2024", checkIn: "09:30 AM", checkOut: "04:00 PM", hours: "6h 30m", status: "Half Day", statusVariant: "warning" as const },
  { date: "Jun 14, 2024", checkIn: "-", checkOut: "-", hours: "-", status: "Leave", statusVariant: "danger" as const },
  { date: "Jun 13, 2024", checkIn: "09:05 AM", checkOut: "06:30 PM", hours: "9h 25m", status: "Present", statusVariant: "success" as const },
];

const documents = [
  { name: "Employment Contract", type: "PDF", date: "Jan 15, 2022", size: "245 KB" },
  { name: "ID Proof", type: "PDF", date: "Jan 15, 2022", size: "1.2 MB" },
  { name: "Tax Form W-4", type: "PDF", date: "Jan 15, 2022", size: "89 KB" },
  { name: "Resume", type: "PDF", date: "Jan 10, 2022", size: "156 KB" },
  { name: "NDA Agreement", type: "PDF", date: "Jan 15, 2022", size: "312 KB" },
];

const leaveHistory = [
  { type: "Annual Leave", startDate: "Jun 14, 2024", endDate: "Jun 14, 2024", days: 1, status: "Approved", statusVariant: "success" as const },
  { type: "Sick Leave", startDate: "May 20, 2024", endDate: "May 21, 2024", days: 2, status: "Approved", statusVariant: "success" as const },
  { type: "Annual Leave", startDate: "Apr 1, 2024", endDate: "Apr 5, 2024", days: 5, status: "Approved", statusVariant: "success" as const },
];

const trainingRecords = [
  { name: "React Advanced Patterns", completionDate: "Jun 10, 2024", score: "95%", status: "Completed", statusVariant: "success" as const },
  { name: "AWS Certification Prep", completionDate: "May 15, 2024", score: "88%", status: "Completed", statusVariant: "success" as const },
  { name: "Leadership Essentials", completionDate: "-", score: "-", status: "Upcoming", statusVariant: "info" as const },
];

const performanceData = [
  { period: "Q1 2024", score: "4.5/5", rating: "Exceeds Expectations", reviewer: "Emily Davis", status: "Completed", statusVariant: "success" as const },
  { period: "Q4 2023", score: "4.2/5", rating: "Exceeds Expectations", reviewer: "Emily Davis", status: "Completed", statusVariant: "success" as const },
  { period: "Q3 2023", score: "3.8/5", rating: "Meets Expectations", reviewer: "Emily Davis", status: "Completed", statusVariant: "success" as const },
];

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave", icon: Calendar },
    { id: "training", label: "Training", icon: GraduationCap },
    { id: "performance", label: "Performance", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={employeeData.name}
        description={`${employeeData.designation} · ${employeeData.department}`}
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Employees", href: "/hr/employees" },
          { label: employeeData.name },
        ]}
        icon={<User className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a href="/hr/employees" className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit Profile
            </button>
          </div>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">{employeeData.avatar}</div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{employeeData.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{employeeData.phone}</span></div>
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{employeeData.department}</span></div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Joined {employeeData.joinDate}</span></div>
          </div>
          <StatusBadge status={employeeData.status} variant={employeeData.statusVariant} />
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {activeTab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: employeeData.name },
                { label: "Email", value: employeeData.email },
                { label: "Phone", value: employeeData.phone },
                { label: "Date of Birth", value: employeeData.dateOfBirth },
                { label: "Gender", value: employeeData.gender },
                { label: "Address", value: employeeData.address },
                { label: "Emergency Contact", value: employeeData.emergencyContact },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="space-y-4">
              {[
                { label: "Employee ID", value: employeeData.id },
                { label: "Status", value: employeeData.status },
                { label: "Work Location", value: employeeData.workLocation },
                { label: "Employment Type", value: employeeData.employmentType },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "employment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
            <div className="space-y-4">
              {[
                { label: "Department", value: employeeData.department },
                { label: "Designation", value: employeeData.designation },
                { label: "Reporting Manager", value: employeeData.reportingManager },
                { label: "Join Date", value: employeeData.joinDate },
                { label: "Employment Type", value: employeeData.employmentType },
                { label: "Work Location", value: employeeData.workLocation },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Assigned Assets</h3>
            <div className="space-y-3">
              {[
                { name: "MacBook Pro 16-inch", type: "Laptop", assigned: "Jan 16, 2022" },
                { name: "Dell 27\" Monitor", type: "Monitor", assigned: "Jan 16, 2022" },
                { name: "Apple Magic Keyboard", type: "Peripheral", assigned: "Jan 16, 2022" },
              ].map((asset) => (
                <div key={asset.name} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{asset.assigned}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "financial" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Salary Information</h3>
            <div className="space-y-4">
              {[
                { label: "Base Salary", value: employeeData.salary },
                { label: "Pay Frequency", value: "Monthly" },
                { label: "Bank Account", value: employeeData.bankAccount },
                { label: "Tax ID", value: employeeData.taxId },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Benefits</h3>
            <div className="space-y-2">
              {employeeData.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Documents</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> Upload Document
            </button>
          </div>
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type} · {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{doc.date}</span>
                  <button className="text-sm text-primary hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Recent Attendance</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Check In</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Check Out</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Hours</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {attendanceData.map((record, i) => (
                  <tr key={i} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{record.date}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.checkIn}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.checkOut}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.hours}</td>
                    <td className="py-3 px-4"><StatusBadge status={record.status} variant={record.statusVariant} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "leave" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Leave History</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Start Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">End Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Days</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {leaveHistory.map((leave, i) => (
                  <tr key={i} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{leave.type}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{leave.startDate}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{leave.endDate}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{leave.days}</td>
                    <td className="py-3 px-4"><StatusBadge status={leave.status} variant={leave.statusVariant} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "training" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Training Records</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Program</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Completion Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Score</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {trainingRecords.map((record, i) => (
                  <tr key={i} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{record.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.completionDate}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.score}</td>
                    <td className="py-3 px-4"><StatusBadge status={record.status} variant={record.statusVariant} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Performance History</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Period</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Score</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Rating</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Reviewer</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {performanceData.map((perf, i) => (
                  <tr key={i} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{perf.period}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning fill-warning" />
                        <span className="text-sm font-medium">{perf.score}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{perf.rating}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{perf.reviewer}</td>
                    <td className="py-3 px-4"><StatusBadge status={perf.status} variant={perf.statusVariant} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
