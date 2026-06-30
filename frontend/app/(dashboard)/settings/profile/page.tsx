"use client";

import { useState, useEffect, useRef } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { apiPut, apiPost } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import {
  User,
  Save,
  Upload,
  Lock,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { profile, loading: profileLoading, error: profileError } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");

  // Password state
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Initialise form from profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setDesignation(profile.designation || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  // Clear success/error messages after 4s
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);
  useEffect(() => {
    if (passwordSuccess) {
      const t = setTimeout(() => setPasswordSuccess(null), 4000);
      return () => clearTimeout(t);
    }
  }, [passwordSuccess]);

  // ──────────────────────────────────────────────
  // Save profile
  // ──────────────────────────────────────────────
  async function handleSaveProfile() {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await apiPut("/auth/profile", {
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        designation: designation.trim() || null,
      });
      setSuccessMsg("Profile updated successfully");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  // ──────────────────────────────────────────────
  // Change password
  // ──────────────────────────────────────────────
  async function handleChangePassword() {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await apiPost("/auth/profile/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  // ──────────────────────────────────────────────
  // Upload avatar
  // ──────────────────────────────────────────────
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      setErrorMsg("File must be an image (JPG, PNG, GIF)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Image must be under 2MB");
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/profile/avatar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      // Refetch profile (we return refreshed profile from endpoint)
      // For now just show success — the photo_url in context will update on next load
      setSuccessMsg("Profile picture uploaded");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // ──────────────────────────────────────────────
  // Derived initials and photo
  // ──────────────────────────────────────────────
  const initials = profile
    ? (profile.full_name || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const photoUrl = profile?.photo_url || null;

  // ──────────────────────────────────────────────
  // Loading / error states
  // ──────────────────────────────────────────────
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <XCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">Failed to load profile. Try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Profile Settings"
        description="Manage your personal account settings and preferences."
        icon={<User className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Profile" },
        ]}
        actions={
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      {/* Success/Error toasts */}
      {successMsg && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600 text-white shadow-md dark:bg-green-700 dark:text-green-50 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 text-white shadow-md dark:bg-red-700 dark:text-red-50 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                    {initials}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">{profile?.full_name || "User"}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="border border-border bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted/80 flex items-center gap-2 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>

            {passwordSuccess && (
              <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-green-600 text-white shadow-md dark:bg-green-700 dark:text-green-50 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="font-semibold">{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-red-600 text-white shadow-md dark:bg-red-700 dark:text-red-50 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="font-semibold">{passwordError}</span>
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Summary */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <div className="space-y-3">
              {[
                { label: "User ID", value: profile?.employee_code || `USR-${String(profile?.id || "").padStart(3, "0")}` },
                { label: "Role", value: profile?.role_name || "—" },
                { label: "Department", value: profile?.department_name || "—" },
                { label: "Branch", value: profile?.branch_name || "—" },
                { label: "Joined", value: profile?.created_at_display ? new Date(profile.created_at_display).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—" },
                { label: "Last Login", value: profile?.last_login ? new Date(profile.last_login).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <div className="space-y-3">
              {[
                { label: "Email", value: profile?.email || "—" },
                { label: "Employee ID", value: profile?.employee_id ? `EMP-${String(profile.employee_id).padStart(3, "0")}` : "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium truncate ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
