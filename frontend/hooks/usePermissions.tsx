"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { apiGet } from "@/lib/api";

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role_id: number | null;
  role_name: string | null;
  role_permissions: Record<string, Record<string, boolean>> | null;
  company_id: number | null;
  status: string;
  employee_id?: number | null;
  phone?: string | null;
  designation?: string | null;
  photo_url?: string | null;
  employee_code?: string | null;
  department_name?: string | null;
  branch_name?: string | null;
  last_login?: string | null;
  created_at_display?: string | null;
}

interface PermissionsContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  /** Check if user has a specific permission for a module */
  can: (module: string, action: string) => boolean;
  /** Check if user has a specific role */
  hasRole: (role: string) => boolean;
  /** Check if user can view any of the given modules */
  canViewAny: (modules: string[]) => boolean;
  /** Check if user can view a specific module */
  canView: (module: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType>({
  profile: null,
  loading: true,
  error: null,
  can: () => false,
  hasRole: () => false,
  canViewAny: () => false,
  canView: () => false,
});

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const data = await apiGet<UserProfile>("/auth/me");
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }

  function can(module: string, action: string): boolean {
    if (!profile?.role_permissions) return false;
    const perms = profile.role_permissions[module];
    if (!perms) return false;
    return perms[action] === true;
  }

  function hasRole(role: string): boolean {
    return profile?.role_name === role;
  }

  function canViewAny(modules: string[]): boolean {
    return modules.some((m) => can(m, "view") || can(m, "create") || can(m, "edit") || can(m, "approve"));
  }

  function canView(module: string): boolean {
    return can(module, "view") || can(module, "create") || can(module, "edit") || can(module, "approve");
  }

  return (
    <PermissionsContext.Provider
      value={{ profile, loading, error, can, hasRole, canViewAny, canView }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}

/** Convenience: check if user has Admin role */
export function useIsAdmin() {
  return usePermissions().hasRole("Admin");
}

/** Convenience: get current user profile */
export function useUserProfile() {
  return usePermissions().profile;
}
