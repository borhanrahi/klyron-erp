"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPut } from "@/lib/api";
import { User, Mail, Phone, MapPin, Building2, Calendar, Save } from "lucide-react";

interface Profile {
  id: number;
  employee_code: string;
  designation: string;
  phone: string;
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

  useEffect(() => {
    apiGet<{ data: Profile }>("/ess/profile")
      .then((res) => {
        setProfile(res.data);
        setPhone(res.data.phone || "");
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
    </div>
  );
}
