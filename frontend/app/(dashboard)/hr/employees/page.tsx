"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
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
import Link from "next/link";

interface Employee {
  id: number;
  company_id: number;
  employee_code: string;
  designation: string;
  salary: number;
  status: string;
  gender: string | null;
  phone: string | null;
  joining_date: string | null;
  created_at: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  department_name: string | null;
  department_id: number | null;
}

interface Team {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

const statusVariant = (s: string): "success" | "warning" | "muted" | "danger" => {
  if (s === "active") return "success";
  if (s === "on_leave") return "warning";
  if (s === "resigned" || s === "terminated") return "danger";
  return "muted";
};

export default function EmployeeDirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { confirm, state, handleClose } = useConfirm();

  const fetchEmployees = (p: number, search?: string) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "10" };
    if (search) params.search = search;
    if (selectedDepartment && selectedDepartment !== "All") params.department_id = selectedDepartment;
    if (selectedTeam && selectedTeam !== "All") params.team_id = selectedTeam;
    if (selectedStatus && selectedStatus !== "All") params.status = selectedStatus.toLowerCase();
    
    apiGet<{ items: Employee[]; total: number; page: number; per_page: number; pages: number }>("/hr/employee-directory", params)
      .then((res) => {
        setEmployees(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      })
      .catch(() => {
        setEmployees([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  const fetchFilters = async () => {
    try {
      const [deptRes, teamRes] = await Promise.all([
        apiGet<{ items: Department[] }>("/master-data/departments", { per_page: "100" }).catch(() => ({ items: [] })),
        apiGet<{ items: Team[] }>("/hr/teams", { per_page: "50" }).catch(() => ({ items: [] })),
      ]);
      setDepartments(deptRes.items || []);
      setTeams(teamRes.items || []);
    } catch {}
  };

  useEffect(() => {
    fetchEmployees(1);
    fetchFilters();
  }, []);

  const handleSearch = () => {
    fetchEmployees(1, searchTerm || undefined);
  };

  const applyFilters = () => {
    fetchEmployees(1, searchTerm || undefined);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm("Delete this employee?");
    if (!ok) return;
    await apiDelete(`/hr/employees/${id}`);
    fetchEmployees(page, searchTerm || undefined);
  };

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
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2 cursor-pointer">
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link
              href="/hr/employees/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, code, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors ${
                  showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  // Trigger fetch with new status on next render
                  setLoading(true);
                  const params: Record<string, string> = { page: "1", per_page: "10" };
                  if (searchTerm) params.search = searchTerm;
                  if (selectedDepartment && selectedDepartment !== "All") params.department_id = selectedDepartment;
                  if (selectedTeam && selectedTeam !== "All") params.team_id = selectedTeam;
                  const statusVal = e.target.value;
                  if (statusVal && statusVal !== "All") params.status = statusVal.toLowerCase();
                  apiGet<{ items: Employee[]; total: number; page: number; per_page: number; pages: number }>("/hr/employee-directory", params)
                    .then((res) => {
                      setEmployees(res.items); setTotal(res.total); setPage(res.page); setPages(res.pages);
                    })
                    .catch(() => { setEmployees([]); setTotal(0); })
                    .finally(() => setLoading(false));
                }}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white border border-primary rounded-lg text-sm hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t border-border">
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="All">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Team</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="All">All Teams</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

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
                  Code
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Department
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Designation
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Salary
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Joined
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground text-sm">
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/40" />
                      <p>No employees found. Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {(emp.full_name || emp.employee_code || "??").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{emp.full_name || emp.employee_code}</p>
                          <p className="text-xs text-muted-foreground">{emp.email || emp.phone || "No contact"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm font-mono text-muted-foreground">{emp.employee_code}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{emp.department_name || "—"}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{emp.designation || "—"}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{emp.salary?.toLocaleString() || "—"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={emp.status}
                        variant={statusVariant(emp.status)}
                      />
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/hr/employees/${emp.id}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {employees.length} of {total} employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchEmployees(page - 1, searchTerm || undefined)}
              disabled={page <= 1}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              {page}
            </span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button
              onClick={() => fetchEmployees(page + 1, searchTerm || undefined)}
              disabled={page >= pages}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
