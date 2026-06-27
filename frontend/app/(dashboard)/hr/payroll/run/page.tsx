"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calculator,
  Play,
  CheckCircle,
  ArrowRight,
  Search,
  Eye,
  Download,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react";
import { apiFetch, apiGet } from "@/lib/api";
import Link from "next/link";

interface Employee {
  id: number;
  employee_code: string;
  salary: number;
  full_name?: string;
  department_name?: string;
}

interface EmployeeListResponse {
  items: Employee[];
  total: number;
}

interface PayrollRecord {
  id: number;
  employee_id: number;
  employee_name: string | null;
  employee_code: string | null;
  base_salary: number;
  allowances: number;
  deductions: number;
  tax: number;
  bonus: number;
  net_pay: number;
  status: string;
  paid_at: string | null;
}

const processingSteps = [
  { step: 1, name: "Select Pay Period", description: "Choose month and year" },
  { step: 2, name: "Preview Employees", description: "Review affected employees" },
  { step: 3, name: "Generate Payroll", description: "Process salary calculations" },
  { step: 4, name: "Review Results", description: "Confirm generated records" },
];

export default function PayrollRunPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [paying, setPaying] = useState<number | null>(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await apiGet<EmployeeListResponse>("/hr/employees", { per_page: "100" });
      setEmployees(res.items);
      setSelectedEmployees(res.items.map((e) => e.id));
      setSelectAll(true);
      setCurrentStep(2);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      let url = `/hr/payroll-actions/generate?month=${month}&year=${year}`;
      if (!selectAll && selectedEmployees.length > 0) {
        url += `&employee_ids=${selectedEmployees.join(",")}`;
      }

      const res = await apiFetch<{ data: { created: number; updated: number } }>(url, { method: "POST" });
      setResult(res.data);

      const records = await apiGet<{ data: PayrollRecord[] }>(`/hr/payroll-actions/by-period?month=${month}&year=${year}`);
      setPayrollRecords(records.data);

      setCurrentStep(4);
    } catch (err) {
      console.error("Payroll generation failed", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkPaid = async (payrollId: number) => {
    setPaying(payrollId);
    try {
      await apiFetch(`/hr/payroll-actions/mark-paid?month=${month}&year=${year}&payroll_ids=${payrollId}`, { method: "POST" });
      setPayrollRecords((prev) =>
        prev.map((r) => (r.id === payrollId ? { ...r, status: "paid", paid_at: new Date().toISOString() } : r))
      );
    } catch (err) {
      console.error("Mark paid failed", err);
    } finally {
      setPaying(null);
    }
  };

  const handleMarkAllPaid = async () => {
    setPaying(-1);
    try {
      await apiFetch(`/hr/payroll-actions/mark-paid?month=${month}&year=${year}`, { method: "POST" });
      const now = new Date().toISOString();
      setPayrollRecords((prev) => prev.map((r) => ({ ...r, status: "paid", paid_at: now })));
    } catch (err) {
      console.error("Mark all paid failed", err);
    } finally {
      setPaying(null);
    }
  };

  const handleDownloadPDF = async (payrollId: number) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/hr/payroll-actions/${payrollId}/payslip-pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${payrollId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed", err);
    }
  };

  const toggleEmployee = (id: number) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(id)) return prev.filter((eid) => eid !== id);
      return [...prev, id];
    });
    setSelectAll(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
      setSelectAll(false);
    } else {
      setSelectedEmployees(filteredEmployees.map((e) => e.id));
      setSelectAll(true);
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      (e.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.employee_code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmt = (n: number | null) => (n != null ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Run Payroll"
        description="Generate payroll for selected employees."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Run Payroll" },
        ]}
        icon={<Calculator className="h-6 w-6 text-primary" />}
      />

      {/* Step Indicator */}
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <div className="flex items-center justify-between">
          {processingSteps.map((step, idx) => (
            <div key={step.step} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep > step.step
                      ? "bg-success text-white"
                      : currentStep === step.step
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.step ? <CheckCircle className="h-4 w-4" /> : step.step}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.step ? "" : "text-muted-foreground"}`}>{step.name}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {idx < processingSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 rounded ${currentStep > step.step ? "bg-success" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Period */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Select Pay Period</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1.5">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {monthNames.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={fetchEmployees}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preview Employees */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Select Employees</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedEmployees.length} of {employees.length} employees selected for {monthNames[month - 1]} {year}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-56 pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button
                  onClick={toggleSelectAll}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectAll ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  <th className="w-12 py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Base Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">Loading employees...</td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">No employees found.</td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(emp.id)}
                          onChange={() => toggleEmployee(emp.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {(emp.full_name || emp.employee_code || "NA").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{emp.full_name || `Employee #${emp.id}`}</p>
                            <p className="text-xs text-muted-foreground">{emp.employee_code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{emp.department_name || "—"}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium">{fmt(emp.salary)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={selectedEmployees.length === 0 || generating}
              className="bg-success text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Generate Payroll ({selectedEmployees.length} employees)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {currentStep === 4 && result && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Payroll Generated!</h3>
                  <p className="text-sm text-muted-foreground">
                    {monthNames[month - 1]} {year} — {result.created} created, {result.updated} updated
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {payrollRecords.some((r) => r.status !== "paid") && (
                  <button
                    onClick={handleMarkAllPaid}
                    disabled={paying === -1}
                    className="px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {paying === -1 ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CircleDollarSign className="h-4 w-4" />
                    )}
                    Mark All Paid
                  </button>
                )}
                <button
                  onClick={() => { setCurrentStep(1); setResult(null); setPayrollRecords([]); }}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Run Another
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">
                {monthNames[month - 1]} {year} Payroll Records ({payrollRecords.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Base Salary</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Allowances</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Deductions</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Net Pay</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payrollRecords.map((p) => {
                    const initials = (p.employee_name || `#${p.employee_id}`).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <tr key={p.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{initials}</div>
                            <div>
                              <p className="text-sm font-medium">{p.employee_name || `Employee #${p.employee_id}`}</p>
                              <p className="text-xs text-muted-foreground">{p.employee_code || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">{fmt(p.base_salary)}</span>
                        </td>
                        <td className="py-3 px-4 text-right hidden lg:table-cell">
                          <span className="text-sm text-success">{fmt(p.allowances)}</span>
                        </td>
                        <td className="py-3 px-4 text-right hidden lg:table-cell">
                          <span className="text-sm text-danger">{fmt(p.deductions + (p.tax || 0))}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-bold">{fmt(p.net_pay)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={p.status} variant={p.status === "paid" ? "success" : p.status === "draft" ? "muted" : "warning"} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/hr/payroll/${p.id}`}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-primary"
                              title="View payslip"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDownloadPDF(p.id)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {p.status !== "paid" && (
                              <button
                                onClick={() => handleMarkPaid(p.id)}
                                disabled={paying === p.id}
                                className="p-1.5 rounded-lg hover:bg-success/10 transition-colors text-success disabled:opacity-50"
                                title="Mark as paid"
                              >
                                {paying === p.id ? (
                                  <div className="w-4 h-4 border-2 border-success border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CircleDollarSign className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
