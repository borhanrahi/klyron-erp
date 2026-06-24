"use client";

import { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPut } from "@/lib/api";
import { User, Mail, Phone, Save, Upload, Trash2, PenLine } from "lucide-react";

interface Profile {
  id: number;
  employee_code: string;
  designation: string;
  phone: string;
  signature_url?: string | null;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  department_name?: string;
  gender: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  blood_group: string | null;
  nationality: string | null;
  national_id: string | null;
  present_address: string | null;
  permanent_address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_routing_number: string | null;
  status: string;
  created_at: string;
}

export default function ESSProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiGet<{ data: Profile }>("/ess/profile")
      .then((res) => {
        setProfile(res.data);
        setPhone(res.data.phone || "");
        if (res.data.signature_url) {
          setHasSignature(true);
          setSignaturePreview(`data:image/png;base64,${res.data.signature_url}`);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await apiPut("/ess/profile", { phone });
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignatureUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file (PNG, JPG)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be under 2MB");
      return;
    }

    setUploadingSig(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/ess/profile/signature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => setSignaturePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setHasSignature(true);
      setMessage("Signature uploaded successfully");
    } catch {
      setMessage("Failed to upload signature");
    } finally {
      setUploadingSig(false);
    }
  };

  const handleSignatureDelete = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/ess/profile/signature`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setSignaturePreview(null);
      setHasSignature(false);
      setMessage("Signature removed");
    } catch {
      setMessage("Failed to remove signature");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleSignatureUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSignatureUpload(file);
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading profile...</div>;
  if (!profile) return <div className="p-6 text-muted-foreground">Profile not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Profile"
        description="View and manage your personal information."
        icon={<User className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">
              {(profile.full_name || profile.employee_code).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold">{profile.full_name || profile.employee_code}</h2>
          <p className="text-sm text-muted-foreground">{profile.designation}</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{profile.email || "N/A"}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{profile.phone || "N/A"}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              profile.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            }`}>
              {profile.status}
            </span>
          </div>
        </div>

        {/* Personal Info */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Personal Information</h3>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Employee Code", value: profile.employee_code },
              { label: "Department", value: profile.department_name || "N/A" },
              { label: "Designation", value: profile.designation },
              { label: "Gender", value: profile.gender || "N/A" },
              { label: "Date of Birth", value: profile.date_of_birth || "N/A" },
              { label: "Marital Status", value: profile.marital_status || "N/A" },
              { label: "Blood Group", value: profile.blood_group || "N/A" },
              { label: "Nationality", value: profile.nationality || "N/A" },
              { label: "National ID", value: profile.national_id || "N/A" },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-xs text-muted-foreground">{item.label}</label>
                <p className="text-sm font-medium mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact & Bank Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Contact Information</h3>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Present Address</label>
              <p className="text-sm mt-1">{profile.present_address || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Emergency Contact</label>
              <p className="text-sm mt-1">{profile.emergency_contact_name || "N/A"} - {profile.emergency_contact_phone || "N/A"}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {message && <p className={`text-xs ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Bank Information</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: "Bank Name", value: profile.bank_name || "N/A" },
              { label: "Account Number", value: profile.bank_account_number || "N/A" },
              { label: "Routing Number", value: profile.bank_routing_number || "N/A" },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-xs text-muted-foreground">{item.label}</label>
                <p className="text-sm font-medium mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signature Upload */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Payslip Signature</h3>
        </div>
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-4">
            Upload your signature (PNG/JPG, max 2MB). It will appear on your payslips.
          </p>

          {hasSignature && signaturePreview ? (
            <div className="flex items-start gap-6">
              <div className="rounded-xl border border-border bg-background p-4 inline-block">
                <img
                  src={signaturePreview}
                  alt="Your signature"
                  className="max-h-20 object-contain"
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingSig}
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  Replace
                </button>
                <button
                  onClick={handleSignatureDelete}
                  className="flex items-center gap-2 px-3 py-2 border border-danger/30 text-danger rounded-lg text-sm font-medium hover:bg-danger/5 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {uploadingSig ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
