"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Building2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    password: "",
    terms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo bypass — TODO: Replace with real auth
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

        {/* Registration Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold mb-1">Create your account</h2>
            <p className="text-sm text-muted-foreground">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative group rounded-lg transition-all duration-200 bg-muted border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 bg-transparent border-none text-foreground text-sm focus:ring-0 placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                Work Email
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

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                Company Name
              </label>
              <div className="relative group rounded-lg transition-all duration-200 bg-muted border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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

            {/* Terms Checkbox */}
            <div className="flex items-start pt-1">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-muted text-primary focus:ring-primary focus:ring-2 focus:ring-offset-background"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="text-muted-foreground">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 relative overflow-hidden group active:scale-[0.98]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                Start 14-day Free Trial
              </button>
            </div>
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
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Log in here
          </Link>
        </p>
      </main>
    </div>
  );
}
