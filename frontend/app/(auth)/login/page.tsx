"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showAccounts, setShowAccounts] = useState(false);
  const [copied, setCopied] = useState("");

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1200);
  };

  const demoAccounts = [
    { role: "Admin (Demo)", email: "demo.admin.f3bd9cc0@klyron.demo.com", password: "Demo-cdcSKxqSwgii" },
    { role: "Manager", email: "sumaiya@klyron.com", password: "password123" },
    { role: "Supervisor", email: "kamal@klyron.com", password: "password123" },
    { role: "HR Manager", email: "anisur@klyron.com", password: "password123" },
    { role: "Finance Manager", email: "imran@klyron.com", password: "password123" },
    { role: "Employee", email: "rahim@klyron.com", password: "password123" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("remembered_email");
    if (saved) {
      setFormData((prev) => ({ ...prev, email: saved }));
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: "Login failed" }));
        setError(body.detail || "Invalid credentials");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      if (remember) {
        localStorage.setItem("remembered_email", formData.email);
      } else {
        localStorage.removeItem("remembered_email");
      }
      router.push("/dashboard");
    } catch {
      setError("Cannot connect to backend. Make sure the API server is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <main className="w-full max-w-[480px] z-10">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-1">
            Klyron <span className="text-primary">ERP</span>
          </h1>
          <p className="text-base text-muted-foreground">Enterprise Resource Planning</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold mb-1">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group rounded-lg transition-all duration-200 bg-muted border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 bg-transparent border-none text-foreground text-sm focus:ring-0 placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group rounded-lg transition-all duration-200 bg-muted border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-10 py-3 bg-transparent border-none text-foreground text-sm focus:ring-0 placeholder:text-muted-foreground/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-muted text-primary focus:ring-primary focus:ring-2 focus:ring-offset-background"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3 text-center">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 relative overflow-hidden group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            {/* Demo accounts link */}
            <p className="text-center text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => setShowAccounts(true)}
                className="font-semibold text-primary hover:underline"
              >
                View demo accounts
              </button>
            </p>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 text-muted-foreground text-xs uppercase tracking-wider bg-card">
                Or continue with
              </span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex justify-center items-center py-2.5 px-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors font-medium text-sm text-foreground"
            >
              Google
            </button>
            <button
              type="button"
              className="flex justify-center items-center py-2.5 px-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors font-medium text-sm text-foreground"
            >
              Microsoft
            </button>
          </div>
        </div>

        {/* Demo Accounts Modal */}
        {showAccounts && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAccounts(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Demo accounts</h3>
                <button
                  type="button"
                  onClick={() => setShowAccounts(false)}
                  className="text-muted-foreground hover:text-foreground text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {demoAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    className="relative rounded-lg border border-border bg-muted/50 hover:border-primary/40 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ email: acc.email, password: acc.password });
                        setError("");
                        setShowAccounts(false);
                      }}
                      className="w-full text-left px-3 py-2 pr-28 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="text-xs font-semibold text-primary">{acc.role}</span>
                      <div className="text-sm text-foreground truncate">{acc.email}</div>
                    </button>
                    <div className="absolute right-2 top-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => copy(`${acc.email}:email`, acc.email)}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-border bg-card hover:border-primary/40 text-muted-foreground hover:text-primary"
                      >
                        {copied === `${acc.email}:email` ? "✓" : "Email"}
                      </button>
                      <button
                        type="button"
                        onClick={() => copy(`${acc.email}:pass`, acc.password)}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-border bg-card hover:border-primary/40 text-muted-foreground hover:text-primary"
                      >
                        {copied === `${acc.email}:pass` ? "✓" : "Pass"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Click a row to fill the form, or copy Email / Pass
              </p>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Start free trial
          </Link>
        </p>
      </main>
    </div>
  );
}
