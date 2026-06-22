const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && !retried) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return apiFetch<T>(path, options, true);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json();
}

export function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiFetch<T>(`${path}${qs}`);
}

export function apiPost<T>(path: string, data: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiPut<T>(path: string, data: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: "DELETE" });
}
