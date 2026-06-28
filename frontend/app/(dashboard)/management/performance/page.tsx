"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  TrendingUp,
  Search,
  Plus,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

interface Review {
  id: number;
  employee: string;
  avatar: string;
  department: string;
  reviewer: string;
  cycle: string;
  due_date: string;
  score: string;
  status: string;
  statusVariant: "success" | "info" | "warning" | "muted";
}

const reviews: Review[] = [
  { id: 1, employee: "Sarah Chen", avatar: "SC", department: "Engineering", reviewer: "You", cycle: "Q2 2026", due_date: "Jun 30, 2026", score: "4.5/5", status: "Completed", statusVariant: "success" },
  { id: 2, employee: "Mike Johnson", avatar: "MJ", department: "Engineering", reviewer: "You", cycle: "Q2 2026", due_date: "Jun 30, 2026", score: "3.8/5", status: "Completed", statusVariant: "success" },
  { id: 3, employee: "David Park", avatar: "DP", department: "Engineering", reviewer: "You", cycle: "Q3 2026", due_date: "Sep 30, 2026", score: "\u2014", status: "Scheduled", statusVariant: "warning" },
  { id: 4, employee: "Alex Kim", avatar: "AK", department: "DevOps", reviewer: "You", cycle: "Q3 2026", due_date: "Sep 30, 2026", score: "\u2014", status: "Pending", statusVariant: "muted" },
  { id: 5, employee: "Lisa Thompson", avatar: "LT", department: "Design", reviewer: "You", cycle: "Q2 2026", due_date: "Jun 30, 2026", score: "\u2014", status: "In Progress", statusVariant: "info" },
  { id: 6, employee: "James Wilson", avatar: "JW", department: "Finance", reviewer: "You", cycle: "Q3 2026", due_date: "Sep 30, 2026", score: "\u2014", status: "Scheduled", statusVariant: "warning" },
  { id: 7, employee: "Rachel Martinez", avatar: "RM", department: "HR", reviewer: "You", cycle: "Q2 2026", due_date: "Jun 30, 2026", score: "4.2/5", status: "Completed", statusVariant: "success" },
  { id: 8, employee: "Emily Davis", avatar: "ED", department: "Product", reviewer: "You", cycle: "Q2 2026", due_date: "Jun 30, 2026", score: "\u2014", status: "In Progress", statusVariant: "info" },
];

const renderStars = (score: string) => {
  const num = parseFloat(score);
  if (isNaN(num)) return <span className="text-muted-foreground">\u2014</span>;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-3 w-3 ${star <= num ? "text-warning fill-warning" : "text-muted-foreground"}`} />
      ))}
      <span className="text-sm font-medium ml-1">{score}</span>
    </div>
  );
};

export default function TeamPerformance() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = reviews.filter((r) =>
    r.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completed = filtered.filter((r) => r.status === "Completed").length;
  const inProgress = filtered.filter((r) => r.status === "In Progress").length;
  const pending = filtered.filter((r) => r.status === "Pending" || r.status === "Scheduled").length;
  const avgScore = filtered
    .filter((r) => r.score !== "\u2014")
    .reduce((acc, r) => acc + parseFloat(r.score), 0) / (completed || 1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Performance"
        description="Track and manage performance reviews for your team"
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Start Review
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Reviews</p>
          <p className="text-2xl font-bold mt-1">{filtered.length}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold mt-1 text-success">{completed}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-info">{inProgress}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Avg. Score</p>
          <p className="text-2xl font-bold mt-1">{avgScore.toFixed(1)}/5</p>
        </div>
      </div>

      {/* Search & Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Reviewer</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Cycle</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Due Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Score</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((review) => (
                <tr key={review.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{review.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{review.employee}</p>
                        <p className="text-xs text-muted-foreground">{review.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{review.reviewer}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><StatusBadge status={review.cycle} variant="primary" /></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{review.due_date}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell">{renderStars(review.score)}</td>
                  <td className="py-3 px-4"><StatusBadge status={review.status} variant={review.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {reviews.length} reviews</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</span>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
