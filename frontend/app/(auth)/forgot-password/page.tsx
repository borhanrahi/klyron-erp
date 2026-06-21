"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0%,rgba(11,19,38,0)_70%)] pointer-events-none z-0" />

      <main className="w-full max-w-md relative z-10">
        <div className="bg-card/90 backdrop-blur-xl border border-border/30 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <div className="text-center w-full mb-6">
            <div className="text-xl font-bold text-primary mb-4 flex justify-center items-center gap-2">
              Klyron <span className="text-primary">ERP</span>
            </div>
            <h1 className="text-lg font-semibold mb-2">Forgot Password</h1>
            <p className="text-sm text-muted-foreground max-w-[300px] mx-auto leading-relaxed">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="w-full text-center py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Work Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted border border-border/40 rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-hover transition-all shadow-md hover:shadow-lg active:scale-[0.98] duration-200 flex items-center justify-center gap-2"
              >
                Send Reset Link
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <div className="w-full mt-6 pt-4 border-t border-border/20 flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Return to Login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact your system administrator or{" "}
            <a href="#" className="text-primary hover:underline">
              IT Support
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
