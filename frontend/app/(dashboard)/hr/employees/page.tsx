"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

const employees = [
  {
    id: "EMP-001",
    name: "Sarah Chen",
    avatar: "SC",
    email: "sarah.chen@klyron.com",
    department: "Engineering",
    designation: "Senior Developer",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Jan 15, 2022",
    phone: "+1 (555) 234-5678",
  },
  {
    id: "EMP-002",
    name: "Mike Johnson",
    avatar: "MJ",
    email: "mike.j@klyron.com",
    department: "Marketing",
    designation: "Marketing Manager",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Mar 8, 2021",
    phone: "+1 (555) 345-6789",
  },
  {
    id: "EMP-003",
    name: "Emily Davis",
    avatar: "ED",
    email: "emily.d@klyron.com",
    department: "Product",
    designation: "Product Manager",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Jun 22, 2020",
    phone: "+1 (555) 456-7890",
  },
  {
    id: "EMP-004",
    name: "David Park",
    avatar: "DP",
    email: "david.p@klyron.com",
    department: "Engineering",
    designation: "Full Stack Developer",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Sep 5, 2023",
    phone: "+1 (555) 567-8901",
  },
  {
    id: "EMP-005",
    name: "Alex Kim",
    avatar: "AK",
    email: "alex.k@klyron.com",
    department: "DevOps",
    designation: "DevOps Engineer",
    status: "On Leave",
    statusVariant: "warning" as const,
    joinDate: "Feb 14, 2022",
    phone: "+1 (555) 678-9012",
  },
  {
    id: "EMP-006",
    name: "Rachel Martinez",
    avatar: "RM",
    email: "rachel.m@klyron.com",
    department: "HR",
    designation: "HR Specialist",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Nov 3, 2021",
    phone: "+1 (555) 789-0123",
  },
  {
    id: "EMP-007",
    name: "James Wilson",
    avatar: "JW",
    email: "james.w@klyron.com",
    department: "Finance",
    designation: "Financial Analyst",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Aug 19, 2023",
    phone: "+1 (555) 890-1234",
  },
  {
    id: "EMP-008",
    name: "Lisa Thompson",
    avatar: "LT",
    email: "lisa.t@klyron.com",
    department: "Design",
    designation: "UI/UX Designer",
    status: "Inactive",
    statusVariant: "muted" as const,
    joinDate: "Apr 11, 2020",
    phone: "+1 (555) 901-2345",
  },
  {
    id: "EMP-009",
    name: "Omar Hassan",
    avatar: "OH",
    email: "omar.h@klyron.com",
    department: "Engineering",
    designation: "Backend Developer",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Jul 7, 2022",
    phone: "+1 (555) 012-3456",
  },
  {
    id: "EMP-010",
    name: "Priya Patel",
    avatar: "PP",
    email: "priya.p@klyron.com",
    department: "Sales",
    designation: "Sales Executive",
    status: "Active",
    statusVariant: "success" as const,
    joinDate: "Oct 28, 2023",
    phone: "+1 (555) 123-4567",
  },
];

const employeeStats = [
  { label: "Total Employees", value: "148", change: "+6 this month" },
  { label: "Active", value: "132", change: "89.2%" },
  { label: "On Leave", value: "8", change: "5.4%" },
  { label: "New Hires", value: "12", change: "Q1 2024" },
];

export default function EmployeeDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDepartment === "All" || emp.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "All" || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Employee Directory"
        description="Manage your team members and their information."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Employees" },
        ]}
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <a
              href="/hr/employees/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </a>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {employeeStats.map((stat) => (
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

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
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
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Department: All</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="DevOps">DevOps</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Employee
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Department
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Designation
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Join Date
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {emp.designation}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={emp.status}
                      variant={emp.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {emp.joinDate}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/hr/employees/${emp.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              2
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
