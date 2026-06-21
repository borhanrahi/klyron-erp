"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  BookOpen,
  Search,
  FileText,
  Users,
  Settings,
  Shield,
  Zap,
  ChevronRight,
  Clock,
  Eye,
} from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Getting Started",
    description: "Initial setup and onboarding guides",
    articles: 12,
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    title: "User Management",
    description: "Roles, permissions, and team setup",
    articles: 24,
    icon: Users,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 3,
    title: "System Settings",
    description: "Configuration and customization",
    articles: 8,
    icon: Settings,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 4,
    title: "Security & Compliance",
    description: "Data protection and security best practices",
    articles: 16,
    icon: Shield,
    color: "text-danger",
    bgColor: "bg-danger/10",
  },
];

const popularArticles = [
  {
    id: 1,
    title: "How to create your first project",
    category: "Getting Started",
    views: 1240,
    lastUpdated: "2 days ago",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Setting up team roles and permissions",
    category: "User Management",
    views: 890,
    lastUpdated: "1 week ago",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Configuring automated workflows",
    category: "System Settings",
    views: 756,
    lastUpdated: "3 days ago",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "Data backup and recovery procedures",
    category: "Security & Compliance",
    views: 623,
    lastUpdated: "5 days ago",
    readTime: "6 min read",
  },
  {
    id: 5,
    title: "Integrating third-party applications",
    category: "System Settings",
    views: 512,
    lastUpdated: "1 week ago",
    readTime: "12 min read",
  },
];

const recentArticles = [
  {
    id: 6,
    title: "New feature: Advanced reporting dashboard",
    category: "Getting Started",
    date: "Mar 24, 2024",
  },
  {
    id: 7,
    title: "Updated: Two-factor authentication setup",
    category: "Security & Compliance",
    date: "Mar 22, 2024",
  },
  {
    id: 8,
    title: "New: Bulk user import guide",
    category: "User Management",
    date: "Mar 20, 2024",
  },
];

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Support</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Knowledge Base
        </span>
      </div>

      <PageHeader
        title="Knowledge Base"
        description="Find answers and learn how to make the most of Klyron ERP."
        icon={<BookOpen className="h-6 w-6 text-primary" />}
      />

      {/* Hero Search */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
          How can we <span className="text-primary">help</span>?
        </h2>
        <p className="text-muted-foreground mb-6">
          Search the knowledge base or browse categories below.
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles, guides, tutorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Browse by Category</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`p-3 rounded-xl ${category.bgColor} w-fit mb-4`}>
                  <Icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <h4 className="text-sm font-semibold mb-1">{category.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {category.articles} Articles
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Articles & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Articles */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
          <div className="space-y-3">
            {popularArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recently Updated</h3>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <h4 className="text-sm font-medium mb-1">{article.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {article.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-primary hover:text-primary/80 transition-colors"
              >
                API Documentation
              </a>
              <a
                href="#"
                className="block text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Video Tutorials
              </a>
              <a
                href="#"
                className="block text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Community Forum
              </a>
              <a
                href="#"
                className="block text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
