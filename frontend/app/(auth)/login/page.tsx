"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo bypass — accept any email/password
    // TODO: Replace with real auth once backend is ready
    router.push("/dashboard");
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
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 relative overflow-hidden group active:scale-[0.98]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                Sign In
              </button>
            </div>

            {/* Demo Hint */}
            <p className="text-center text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              Demo mode — enter any email & password to sign in
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
