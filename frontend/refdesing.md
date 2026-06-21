# Klyron ERP — Premium SaaS ERP Design System & UI Specification

Version: 1.0
Design Goal: Enterprise-grade, premium, modern, highly sellable ERP UI
Framework: Next.js + TailwindCSS + shadcn/ui
Target: SMEs, Enterprises, Manufacturing, Distribution, Retail, Service Companies

---

# Brand Identity

## Product Name

**Klyron ERP**

### Brand Personality

* Professional
* Premium
* Trustworthy
* Intelligent
* Fast
* Modern SaaS

Think:

* Linear
* Stripe
* Vercel
* Notion
* Ramp
* Mercury

Not:

* Traditional ERP
* Outdated admin dashboard
* Bootstrap themes

---

# Design Philosophy

### Core Principles

1. Minimal but information-rich
2. Enterprise-ready
3. High readability
4. Excellent dark mode
5. Fast navigation
6. Beautiful analytics
7. Premium SaaS feel

---

# Color System

## Primary Brand

```css
Primary:
#4F46E5

Primary Hover:
#4338CA

Primary Light:
#EEF2FF
```

---

## Accent

```css
Accent:
#06B6D4

Accent Light:
#ECFEFF
```

---

## Success

```css
#10B981
```

---

## Warning

```css
#F59E0B
```

---

## Danger

```css
#EF4444
```

---

## Background

### Light

```css
Background:
#F8FAFC

Card:
#FFFFFF

Border:
#E2E8F0
```

---

### Dark

```css
Background:
#0F172A

Card:
#111827

Border:
#1F2937
```

---

# Typography

## Font

```html
Inter
```

Fallback:

```html
Inter, ui-sans-serif, system-ui
```

---

# Layout Structure

```text
┌─────────────┬───────────────────────┐
│ Sidebar     │ Top Navbar            │
│             ├───────────────────────┤
│             │ Page Content          │
│             │                       │
│             │                       │
└─────────────┴───────────────────────┘
```

---

# Sidebar Design

Width:

```css
280px
```

Collapsed:

```css
72px
```

Style:

* Glassmorphism subtle effect
* Soft shadows
* Active item highlight
* Animated expand/collapse

Sections:

```text
Dashboard

CRM
Sales
Customers

Inventory
Warehouses
Procurement

Finance
Accounting

HRM
Payroll

Projects

Support

Reports

Settings
```

---

# Top Navigation

Components:

### Left

* Breadcrumb

### Center

* Global Search

### Right

* Notifications
* Messages
* Quick Create
* Theme Switch
* Profile Menu

---

# Global Search

Spotlight style.

Shortcut:

```text
CTRL + K
```

Search:

* Customers
* Invoices
* Employees
* Products
* Projects
* Tickets

Design inspiration:

Linear Search

---

# Dashboard Design

Goal:

CEO should understand business in 10 seconds.

---

## Section 1

Hero KPI Cards

```text
Revenue
Expenses
Profit
Cash Flow
```

Card Style:

* Large numbers
* Trend indicator
* Mini sparkline

---

## Section 2

Analytics Row

```text
Revenue Trend
Sales Trend
Profit Trend
```

Height:

```css
380px
```

---

## Section 3

Operations Overview

```text
Open Orders
Pending Approvals
Stock Alerts
Support Tickets
```

---

## Section 4

Recent Activities

Timeline Style

```text
John approved PO
Sara created invoice
Stock adjusted
```

---

# CRM Module

## Customer List

Layout:

```text
Filters
Search
Data Table
```

Columns:

* Customer
* Company
* Status
* Revenue
* Last Activity

---

## Customer Profile

Tabs:

```text
Overview
Contacts
Orders
Invoices
Tickets
Notes
Activities
```

Right panel:

Customer health score.

---

# Inventory Module

## Inventory Dashboard

Cards:

```text
Total Products
Stock Value
Low Stock
Out of Stock
```

Charts:

```text
Inventory Movement
Warehouse Distribution
```

---

## Product Details

Tabs:

```text
Overview
Stock
Pricing
Purchase
Sales
Documents
Activity
```

---

# Procurement Module

## Purchase Orders

Modern table:

* Status badges
* Inline actions
* Bulk actions

Workflow indicator:

```text
Draft
Pending
Approved
Received
Completed
```

---

# Finance Module

## Finance Dashboard

Cards:

```text
Bank Balance
Receivables
Payables
Monthly Profit
```

Charts:

```text
Cash Flow
Profit & Loss
```

---

## Accounting

Professional ledger view.

Features:

* Journal Entries
* Trial Balance
* Balance Sheet
* General Ledger

---

# HR Module

## Employee Directory

Card + Table Toggle

Employee card:

* Photo
* Department
* Position
* Status

---

## Employee Profile

Tabs:

```text
Overview
Attendance
Leave
Payroll
Documents
Performance
```

---

# Payroll

Modern salary breakdown.

```text
Gross Salary
Allowances
Deductions
Net Salary
```

---

# Project Module

Kanban First.

Views:

```text
Board
List
Calendar
Timeline
```

Design similar to:

* Linear
* Jira
* ClickUp

---

# Support Module

Ticket dashboard.

Columns:

```text
Open
Pending
In Progress
Resolved
Closed
```

Beautiful Kanban.

---

# Manufacturing Module

## Production Dashboard

Cards:

```text
Work Orders
Production Output
Efficiency
Machine Utilization
```

---

# Reports Module

Report Builder Layout

```text
Filters
Columns
Preview
Export
```

Exports:

* PDF
* Excel
* CSV

---

# Customer Portal

Premium experience.

Customers can:

* View quotations
* Approve quotations
* Pay invoices
* Submit tickets
* Download documents

---

# Notification Center

Tabs:

```text
All
Approvals
Finance
HR
System
```

Realtime updates.

---

# Workflow Builder

Visual Node-Based Builder

Style:

```text
Trigger
↓
Condition
↓
Approval
↓
Action
```

Drag and drop interface.

---

# Document Management

Layout:

```text
Folders
Files
Versions
Preview
```

Built-in PDF preview.

---

# Settings

Sections:

```text
Company
Branches
Users
Roles
Permissions
Taxes
Currencies
Integrations
Billing
```

---

# Tables

Use:

```text
shadcn Data Table
```

Features:

* Sticky header
* Pagination
* Column resize
* Filters
* Export

---

# Cards

Style:

```css
rounded-2xl
shadow-sm
border
bg-card
```

Hover:

```css
transition-all
hover:shadow-lg
```

---

# Charts

Use:

```text
Recharts
```

Charts:

* Area
* Line
* Bar
* Pie
* Funnel

Style:

* Clean
* Gradient fills
* Minimal grid

---

# Dark Mode

Must be first-class.

Not an afterthought.

Every component should have:

```css
dark:
```

support.

---

# Landing Page

## Hero

Headline:

```text
Run Your Entire Business From One Platform
```

Subheadline:

```text
Inventory, Finance, HR, CRM, Projects,
Manufacturing and Support — all in Klyron ERP.
```

CTA:

```text
Start Free Trial
Book Demo
```

---

## Features Section

Large enterprise illustrations.

---

## Analytics Showcase

Beautiful dashboard mockups.

---

## Pricing

3 tiers:

```text
Starter
Growth
Enterprise
```

---

# Premium UI Inspiration

Study:

* Linear
* Stripe Dashboard
* Vercel
* Mercury
* Ramp
* Notion
* Attio
* Raycast

Avoid:

* Old ERP designs
* Bootstrap admin templates
* Overcrowded interfaces

---

# Final Visual Direction

"Klyron ERP should feel like Stripe and Linear built an ERP together."

Users should immediately feel:

* Premium
* Modern
* Enterprise-ready
* Fast
* Trustworthy

The UI should justify a premium SaaS subscription before users even explore the features.
