"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ processed: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/hr/payroll-actions/template`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "payroll_template.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download template", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/hr/payroll-actions/upload?month=${month}&year=${year}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.data) {
        setResult(data.data);
      } else {
        setResult({ processed: 0, errors: [data.detail || "Upload failed"] });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setResult({ processed: 0, errors: [message] });
    } finally {
      setUploading(false);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Upload"
        description="Upload payroll adjustments, bonuses, and allowances via CSV file."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Bulk Upload" },
        ]}
        icon={<Upload className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={handleDownloadTemplate}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </button>
        }
      />

      {/* Instructions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">How Bulk Upload Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <p className="text-sm font-medium">Download Template</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get the CSV template with the correct column headers (employee_code, bonus, allowances, deductions, notes).
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <p className="text-sm font-medium">Fill in Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add employee codes and amounts. Bonus is required; allowances and deductions are optional.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <p className="text-sm font-medium">Upload & Process</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload your CSV and the system will automatically add adjustments to existing payroll or create new records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Payroll Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {monthNames.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Payroll Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              file
                ? "border-success bg-success/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile?.name.endsWith(".csv")) {
                setFile(droppedFile);
                setResult(null);
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setResult(null);
                }
              }}
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => { setFile(null); setResult(null); }}
                  className="text-xs text-danger hover:underline flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Drop your CSV file here, or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary hover:underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only .csv files are supported
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload & Process
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Upload Results</h3>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/20 mb-4">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium">{result.processed} records processed successfully</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-sm font-medium">{result.errors.length} errors encountered</p>
              </div>
              <div className="space-y-1">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs text-muted-foreground pl-6">{err}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
