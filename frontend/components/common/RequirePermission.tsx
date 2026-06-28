"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

interface RequirePermissionProps {
  /** Module ID or array of module IDs to check (e.g. "hr.employees", "sales.orders") */
  module: string | string[];
  /** What to render if user has permission */
  children: ReactNode;
  /** Optional fallback content. If omitted, shows a default "Access Denied" card. */
  fallback?: ReactNode;
  /** Whether to redirect to dashboard instead of showing fallback */
  redirect?: boolean;
}

/**
 * Route-level permission guard.
 * Wraps a page or section and only renders children if the user has view (or higher) access
 * to the specified module(s).
 *
 * Usage:
 * ```tsx
 * <RequirePermission module="hr.employees">
 *   <YourPage />
 * </RequirePermission>
 * ```
 */
export function RequirePermission({
  module,
  children,
  fallback,
  redirect: shouldRedirect,
}: RequirePermissionProps) {
  const { canViewAny, loading, profile } = usePermissions();

  // While loading, don't show anything (avoids flash of denied state)
  if (loading) return null;

  // If no profile (not logged in), don't render
  if (!profile) return null;

  const modules = Array.isArray(module) ? module : [module];
  const hasAccess = canViewAny(modules);

  if (!hasAccess) {
    if (shouldRedirect) {
      // Use a meta refresh fallback since we can't use router in a simple way here
      return null;
    }

    if (fallback !== undefined) {
      return <>{fallback}</>;
    }

    // Default access denied UI
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="p-4 rounded-full bg-danger/10 mb-4">
          <ShieldAlert className="h-10 w-10 text-danger" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          You don&apos;t have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
