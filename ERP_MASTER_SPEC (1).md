<!-- BEGIN:erp-master-spec -->
# ERP Master Specification

## Overview
A full-stack ERP system built for a big office environment, inspired by top-tier commercial ERP platforms like ERPGo SaaS.
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4 ( latest ), Shadcn/UI
- **Backend:** FastAPI (Python), async-first
- **Database:** Neon Postgres (pay-as-you-go scaling)
- **Auth:** JWT-based with role-based access control (RBAC)
- **Architecture:** Modular monolith (single deployable unit, logically separated modules)
- **All latest Packages

---

## Core Modules

### 1. Finance & Accounting
- General Ledger, Chart of Accounts
- Accounts Payable (AP) / Accounts Receivable (AR)
- Invoicing, Billing, Credit Notes, Debit Notes
- Estimates / Proforma Invoices / Quotations
- Tax Management (VAT, TDS, multi-rate)
- Multi-currency support, Bank reconciliation
- Internal Banking & Transfers (between company accounts)
- Expense recording, Payment Receipts, Bill tracking
- Financial reporting: P&L, Balance Sheet, Cash Flow, Trial Balance
- Budgeting & Forecasting
- Asset Management / Depreciation
- Double-entry bookkeeping enforcement

### 2. Human Resources (HRM)
- Employee database, profiles, org chart
- Attendance, Timesheets, Biometric integration hooks
- Leave management (annual, sick, casual, unpaid)
- Payroll processing, salary slips, deductions, tax slab
- Employee assets tracking (laptops, phones, furniture)
- Employee documents (contracts, IDs, certificates, policies)
- Recruitment pipeline (ATS), job postings, candidate stages
- Training plans & skill tracking
- Performance goals, appraisals, KPI tracking
- Company events calendar
- HR reports (headcount, turnover, attendance)

### 3. Inventory & Warehouse
- Real-time stock tracking, SKU management, Barcode/QR generation
- Product categories and sub-categories
- Multi-warehouse support, bin locations, inter-warehouse transfers
- Stock adjustments (damage, expiry, found)
- Stock takes / audits
- Reorder points, low-stock alerts
- Import/Export stock lists (CSV/Excel)
- Vendor catalog linkage
- Product bundles / variants

### 4. Procurement (Purchase)
- Purchase Requisitions (PR) with approval workflow
- Purchase Orders (PO), GRN (Goods Receipt Note)
- Supplier/Vendor management, scoring, contracts
- RFQ (Request for Quotation), quotations comparison
- Purchase approvals (workflow engine with levels)
- Three-way matching (PO, GRN, Invoice)
- Supplier payment tracking
- Import/Export supplier data

### 5. Sales & CRM
- Lead pipeline, opportunity tracking, deal stages
- Customer database, contact history, communication notes
- Quotations / Estimates / Proforma
- Sales Orders, Delivery Notes, Sales Invoices
- Credit Notes / Debit Notes for returns/adjustments
- Sales receipts, payment tracking
- Commission management
- Customer support tickets
- Contracts storage and renewal tracking
- CRM custom form builder (custom fields for leads/deals)
- Marketing campaigns (basic email lists)
- Inquiry / Contact capture from external sources

### 6. Point of Sale (POS)
- Fast POS checkout screen (touch-friendly)
- Barcode scanning integration
- Sales receipt generation, thermal printer support
- Cash register management, daily close
- Discounts, coupons, loyalty points
- Purchase recording within POS
- Warehouse stock auto-deduct on POS sales
- POS reports (daily sales, monthly summary, cashier-wise)
- Offline mode support (queue for sync)

### 7. Manufacturing / Production (if applicable)
- BOM (Bill of Materials)
- Work orders, production scheduling
- Shop floor tracking, job costing
- Quality control checkpoints
- MRP (Material Requirements Planning)
- Capacity planning

### 8. Project Management
- Project creation, budgets, timelines, milestones
- Task assignments, Gantt charts, task calendar view
- Resource allocation (people + equipment)
- Time tracking per project / task
- Bug / Issue tracking per project
- Milestone billing, project profitability
- Project reports (progress, burn-down, profit)
- Document collaboration per project

### 9. Support & Communication
- Support ticket system (internal & external)
- Ticket categories, priority, SLA tracking
- Zoom meeting scheduling & integration
- Internal messaging / notes

### 10. Reporting & Business Intelligence
- Role-based dashboards (CEO, Manager, Employee, Accountant)
- KPI widgets, trend charts, real-time counters
- Scheduled reports (PDF/Excel export via email)
- Custom report builder (drag filters, save templates)
- POS reports, sales comparison, inventory valuation
- Real-time notifications, alerts

### 11. SaaS & Subscription Management
- Subscription plans (monthly/yearly/per-user)
- Payment gateway integration (Stripe, PayPal, local Bangladesh gateways)
- Plan limits (modules, users, storage, branches)
- Automatic plan expiry & downgrade
- Trial period management
- Multi-tenant company isolation (database-level or schema-level)
- White-label branding (custom domain, logo, colors)
- Billing history, invoices for SaaS fees

### 12. Administration & System
- Company profile, branches, departments, locations
- Role & Permission matrix (RBAC with module-level + action-level)
- User management (invite, deactivate, impersonate)
- Audit logs, activity trails, IP tracking
- Data backups, import/export utilities
- Notification center (email, in-app, SMS, push)
- Form builder (custom fields for any entity)
- Print settings (templates for invoices, payslips, POs)
- Multi-language support (i18n, RTL for Arabic/Bengali future)
- Theme customization (sidebar, layout, colors, logo)
- System-wide configuration (email SMTP, currency, date format, timezone)
- GDPR / privacy compliance tools

### 13. Workflow Engine
- Configurable approval workflows per entity (PR, PO, Leave, Invoice, Expense)
- Multi-level approval chains with amount thresholds
- Role-based and user-based assignees
- Workflow history and audit trail
- Auto-escalation and reminders
- MVP: Simple status-based (`draft -> pending -> approved -> rejected`)
- V2: Configurable rules engine with conditions and branches

### 14. Customer Portal
- Self-service portal for customers (separate from main app)
- View invoices, quotations, sales orders
- Download PDFs and receipts
- Pay invoices online (Stripe/PayPal integration)
- Raise and track support tickets
- View account statements and balances
- White-labeled per company domain

### 15. Master Data Module
- Reference tables for system-wide data
- Currencies, countries, states, cities
- Units of measurement, tax codes
- Payment terms, shipping methods
- Designations, departments
- Item categories, warehouses
- All master data importable/exportable via CSV

### 16. Integrations
- **Slack** — Real-time activity notifications
- **Telegram** — Instant bot notifications
- **Twilio** — SMS alerts for approvals, payments, reminders
- **Zoom** — Meeting creation, calendar sync
- **Email** — SMTP integration for transactional emails
- **Bangladesh Banks** — Future hook for statement import (CSV upload for now)

---

## Project Structure

```
erp-suite/
├── frontend/                      # Next.js 16 App Router
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── finance/
│   │   │   │   ├── ledger/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── credit-notes/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── debit-notes/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── estimates/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── banking/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx
│   │   │   ├── hr/
│   │   │   │   ├── employees/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── attendance/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── payroll/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── leaves/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── recruitment/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── training/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── performance/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── inventory/
│   │   │   │   ├── items/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── stock/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [warehouseId]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── warehouses/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── adjustments/
│   │   │   │       ├── page.tsx
│   │   │   │       └── new/
│   │   │   │           └── page.tsx
│   │   │   ├── procurement/
│   │   │   │   ├── requisitions/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── purchase-orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── grn/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── suppliers/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── sales/
│   │   │   │   ├── leads/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── deals/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── quotations/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── sales-orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── customers/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── contracts/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── pos/
│   │   │   │   ├── terminal/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── history/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── bugs/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── timesheets/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── support/
│   │   │   │   ├── tickets/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── meetings/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   ├── crm/
│   │   │   │   ├── inquiries/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── campaigns/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── company/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── branches/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── roles/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── audit-logs/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── form-builder/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── integrations/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       ├── billing/
│   │   │       │   └── page.tsx
│   │   │       ├── theme/
│   │   │       │   └── page.tsx
│   │   │       └── notifications/
│   │   │           └── page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       │   └── route.ts
│   │   │       ├── register/
│   │   │       │   └── route.ts
│   │   │       ├── logout/
│   │   │       │   └── route.ts
│   │   │       ├── me/
│   │   │       │   └── route.ts
│   │   │       └── refresh/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── DataTable.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   └── Calendar.tsx
│   │   ├── finance/
│   │   │   ├── LedgerTable.tsx
│   │   │   ├── InvoiceForm.tsx
│   │   │   └── CreditNoteForm.tsx
│   │   ├── hr/
│   │   │   ├── EmployeeCard.tsx
│   │   │   ├── PayrollCalculator.tsx
│   │   │   └── AttendanceGrid.tsx
│   │   ├── inventory/
│   │   ├── procurement/
│   │   ├── sales/
│   │   ├── pos/
│   │   │   ├── PosTerminal.tsx
│   │   │   ├── BarcodeScanner.tsx
│   │   │   └── ReceiptPrinter.tsx
│   │   ├── projects/
│   │   │   ├── GanttChart.tsx
│   │   │   └── TaskBoard.tsx
│   │   ├── support/
│   │   ├── reports/
│   │   │   └── ReportBuilder.tsx
│   │   └── dashboard/
│   │       └── DashboardWidget.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFinance.ts
│   │   ├── useInventory.ts
│   │   ├── usePos.ts
│   │   └── useNotifications.ts
│   ├── lib/
│   │   ├── apiClient.ts
│   │   ├── constants.ts
│   │   ├── i18n.ts
│   │   └── utils.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── financeService.ts
│   │   ├── hrService.ts
│   │   ├── inventoryService.ts
│   │   ├── procurementService.ts
│   │   ├── salesService.ts
│   │   ├── posService.ts
│   │   ├── projectService.ts
│   │   ├── supportService.ts
│   │   ├── reportService.ts
│   │   └── adminService.ts
│   ├── types/
│   │   ├── apiTypes.ts
│   │   ├── auth.ts
│   │   ├── finance.ts
│   │   ├── hr.ts
│   │   ├── inventory.ts
│   │   ├── procurement.ts
│   │   ├── sales.ts
│   │   ├── pos.ts
│   │   ├── project.ts
│   │   ├── support.ts
│   │   ├── report.ts
│   │   └── admin.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── posStore.ts
│   ├── public/
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── middleware.ts
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── events.py                    # Event bus pub/sub
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── auth.py
│   │   │   ├── finance.py
│   │   │   ├── hr.py
│   │   │   ├── inventory.py
│   │   │   ├── procurement.py
│   │   │   ├── sales.py
│   │   │   ├── pos.py
│   │   │   ├── project.py
│   │   │   ├── support.py
│   │   │   ├── company.py
│   │   │   ├── subscription.py
│   │   │   ├── workflow.py
│   │   │   ├── master_data.py
│   │   │   └── portal.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── common.py
│   │   │   ├── auth.py
│   │   │   ├── finance.py
│   │   │   ├── hr.py
│   │   │   ├── inventory.py
│   │   │   ├── procurement.py
│   │   │   ├── sales.py
│   │   │   ├── pos.py
│   │   │   ├── project.py
│   │   │   ├── support.py
│   │   │   ├── company.py
│   │   │   ├── subscription.py
│   │   │   ├── workflow.py
│   │   │   ├── master_data.py
│   │   │   └── portal.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── finance.py
│   │   │   ├── hr.py
│   │   │   ├── inventory.py
│   │   │   ├── procurement.py
│   │   │   ├── sales.py
│   │   │   ├── pos.py
│   │   │   ├── project.py
│   │   │   ├── support.py
│   │   │   ├── reports.py
│   │   │   ├── admin.py
│   │   │   ├── subscription.py
│   │   │   ├── workflow.py
│   │   │   ├── master_data.py
│   │   │   └── portal.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── authService.py
│   │   │   ├── financeService.py
│   │   │   ├── hrService.py
│   │   │   ├── inventoryService.py
│   │   │   ├── procurementService.py
│   │   │   ├── salesService.py
│   │   │   ├── posService.py
│   │   │   ├── projectService.py
│   │   │   ├── supportService.py
│   │   │   ├── reportService.py
│   │   │   ├── adminService.py
│   │   │   ├── subscriptionService.py
│   │   │   ├── workflowService.py
│   │   │   ├── eventBus.py
│   │   │   ├── storageService.py
│   │   │   └── portalService.py
│   │   ├── jobs/                          # Celery task definitions
│   │   │   ├── __init__.py
│   │   │   ├── payroll_jobs.py
│   │   │   ├── report_jobs.py
│   │   │   ├── notification_jobs.py
│   │   │   ├── backup_jobs.py
│   │   │   └── scheduler.py
│   │   ├── dependencies/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── db.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── jwt.py
│   │   │   ├── hashing.py
│   │   │   ├── excel.py
│   │   │   ├── pdf.py
│   │   │   ├── barcode.py
│   │   │   ├── notifications.py
│   │   │   └── storage.py
│   │   └── middleware/
│   │       ├── __init__.py
│   │       ├── cors.py
│   │       ├── logging.py
│   │       └── rate_limit.py
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_ROUTES.md
│   └── DB_SCHEMA.md
│
├── docker-compose.yml
└── README.md
```

---

## Database Schema Overview

### Auth & System
- `users` (id, email, password_hash, role_id, branch_id, company_id, status, last_login, created_at, deleted_at)
- `roles` (id, name, permissions_json, deleted_at)
- `permissions` (id, resource, action)
- `audit_logs` (id, user_id, company_id, action, entity, entity_id, old_values, new_values, changed_fields, ip, user_agent, timestamp)
- `companies` (id, name, logo, tax_id, currency, timezone, address, subdomain, plan_id, status, deleted_at)
- `branches` (id, company_id, name, code, address, manager_id, deleted_at)
- `departments` (id, branch_id, name, code, deleted_at)
- `settings` (id, company_id, key, value)
- `custom_fields` (id, company_id, entity_type, field_name, field_type, options, required)
- `form_builder` (id, company_id, form_name, fields_json, module)
- `notifications` (id, company_id, user_id, type, title, message, entity_type, entity_id, is_read, created_at)
- `notification_templates` (id, company_id, type, channel, subject_template, body_template)
- `activities` (id, company_id, user_id, action, entity_type, entity_id, description, metadata_json, created_at)
- `documents` (id, company_id, folder_id, name, file_url, file_size, mime_type, uploaded_by, version, parent_id, created_at, deleted_at)
- `document_folders` (id, company_id, name, parent_id, created_at, deleted_at)

### Subscription / SaaS
- `plans` (id, name, price_monthly, price_yearly, modules_json, max_users, max_branches, max_storage, features_json, deleted_at)
- `subscriptions` (id, company_id, plan_id, status, started_at, expires_at, auto_renew, deleted_at)
- `payments` (id, company_id, subscription_id, gateway, amount, currency, status, paid_at, receipt_url)
- `gateways` (id, name, config_json, is_active)

### Workflow Engine
- `workflows` (id, company_id, name, entity_type, is_active, created_at, deleted_at)
- `workflow_steps` (id, workflow_id, step_order, name, approver_type, approver_id, min_amount, max_amount, action)
- `workflow_instances` (id, company_id, workflow_id, entity_type, entity_id, status, started_at, completed_at, created_by)
- `workflow_approvals` (id, instance_id, step_id, approver_id, status, comment, approved_at)
- `workflow_history` (id, instance_id, action, user_id, comment, timestamp)

### Master Data
- `currencies` (id, code, name, symbol, is_default, deleted_at)
- `countries` (id, code, name, phone_code, deleted_at)
- `states` (id, country_id, code, name, deleted_at)
- `cities` (id, state_id, name, deleted_at)
- `units` (id, name, symbol, is_base, deleted_at)
- `tax_codes` (id, company_id, code, name, rate, type, is_active, deleted_at)
- `payment_terms` (id, company_id, name, days, is_active, deleted_at)
- `shipping_methods` (id, company_id, name, base_cost, is_active, deleted_at)
- `designations` (id, company_id, name, department_id, deleted_at)

### Finance
- `bank_accounts` (id, company_id, branch_id, name, account_number, bank_name, balance, currency, is_default, deleted_at)
- `bank_transfers` (id, from_account_id, to_account_id, amount, date, reference, status, created_by)
- `chart_of_accounts` (id, company_id, code, name, type, parent_id, balance, is_active, deleted_at)
- `transactions` (id, company_id, account_id, type, amount, date, reference, description, created_by)
- `invoices` (id, company_id, customer_id, branch_id, invoice_number, date, due_date, subtotal, tax, total, status, paid_amount, balance_due, deleted_at)
- `invoice_items` (id, invoice_id, item_id, description, quantity, unit_price, tax, total)
- `credit_notes` (id, company_id, customer_id, credit_number, invoice_id, date, amount, status, reason, deleted_at)
- `debit_notes` (id, company_id, supplier_id, debit_number, invoice_id, date, amount, status, reason, deleted_at)
- `estimates` (id, company_id, customer_id, estimate_number, date, expiry_date, status, total, converted_to_invoice_id, deleted_at)
- `estimate_items` (id, estimate_id, item_id, qty, price, total)
- `expenses` (id, company_id, category_id, amount, date, vendor, receipt_url, description, approved_by, deleted_at)
- `budgets` (id, company_id, department_id, fiscal_year, allocated, spent, remaining)
- `tax_rates` (id, company_id, name, rate, type, is_default, deleted_at)

### HR
- `employees` (id, company_id, user_id, employee_code, department_id, designation, joining_date, resignation_date, salary, status, shift_id, deleted_at)
- `attendance` (id, company_id, employee_id, date, check_in, check_out, status, late_minutes, ot_hours, biometric_id)
- `leaves` (id, company_id, employee_id, type, start_date, end_date, days, reason, status, approved_by, applied_at)
- `leave_balances` (id, company_id, employee_id, year, type, entitled, used, remaining)
- `payroll` (id, company_id, employee_id, month, year, base_salary, allowances, deductions, tax, bonus, net_pay, status, payslip_url)
- `payroll_items` (id, payroll_id, type, name, amount)
- `recruitments` (id, company_id, position, department_id, job_type, description, candidate_name, stage, source, applied_date, hired_by, deleted_at)
- `trainings` (id, company_id, title, description, trainer, start_date, end_date, mode, status, deleted_at)
- `training_enrollments` (id, training_id, employee_id, status, completed_at)
- `performance_reviews` (id, company_id, employee_id, reviewer_id, period, goals_json, rating, feedback, status)
- `employee_assets` (id, company_id, employee_id, asset_type, name, serial, assigned_at, returned_at, condition)
- `employee_documents` (id, company_id, employee_id, doc_type, file_url, uploaded_at, expiry_date)

### Inventory
- `item_categories` (id, company_id, name, parent_id, code, deleted_at)
- `items` (id, company_id, sku, name, category_id, unit, cost_price, sell_price, tax_rate, barcode, weight, description, is_service, deleted_at)
- `stock` (id, company_id, item_id, warehouse_id, quantity, reserved_qty, reorder_level, reorder_qty)
- `warehouses` (id, company_id, code, name, address, manager_id, is_active, deleted_at)
- `stock_adjustments` (id, company_id, item_id, warehouse_id, type, qty_change, reason, date, created_by)
- `stock_transfers` (id, company_id, from_warehouse_id, to_warehouse_id, item_id, qty, status, date, approved_by)
- `stock_takes` (id, company_id, warehouse_id, date, status, counted_by, approved_by)
- `stock_take_items` (id, stock_take_id, item_id, system_qty, counted_qty, difference)

### Procurement
- `suppliers` (id, company_id, name, email, phone, address, tax_id, status, rating, credit_limit, balance, deleted_at)
- `purchase_requisitions` (id, company_id, pr_number, department_id, requester_id, date, status, priority, total_estimated, notes)
- `pr_items` (id, pr_id, item_id, qty, estimated_price, notes)
- `purchase_orders` (id, company_id, po_number, supplier_id, pr_id, date, status, subtotal, tax, total, delivery_date, terms)
- `po_items` (id, po_id, item_id, qty, unit_price, tax, total, received_qty)
- `grn` (id, company_id, grn_number, po_id, date, received_by, status, warehouse_id, notes)
- `grn_items` (id, grn_id, po_item_id, received_qty, accepted_qty, rejected_qty, reason)
- `supplier_payments` (id, company_id, supplier_id, po_id, amount, date, method, reference, notes)

### Sales
- `leads` (id, company_id, name, email, phone, source, status, assigned_to, score, notes, created_at, deleted_at)
- `deals` (id, company_id, lead_id, title, value, currency, stage, probability, expected_close, actual_close, status, deleted_at)
- `deal_stages` (id, company_id, name, order, probability, color)
- `customers` (id, company_id, name, email, phone, tax_id, address, credit_limit, balance, loyalty_points, status, deleted_at)
- `customer_contracts` (id, company_id, customer_id, title, start_date, end_date, value, file_url, status, renewal_reminder, deleted_at)
- `quotations` (id, company_id, customer_id, quote_number, date, expiry, status, subtotal, tax, total, converted_to_order_id, deleted_at)
- `quotation_items` (id, quotation_id, item_id, qty, price, tax, total)
- `sales_orders` (id, company_id, order_number, customer_id, quotation_id, date, status, subtotal, tax, total, delivery_date, shipping_address, deleted_at)
- `sales_order_items` (id, sales_order_id, item_id, qty, price, tax, total, delivered_qty)
- `delivery_notes` (id, company_id, dn_number, sales_order_id, date, shipped_by, status, tracking_number)
- `sales_campaigns` (id, company_id, name, type, start_date, end_date, target_audience, status, budget, deleted_at)
- `inquiries` (id, company_id, name, email, phone, message, source, status, assigned_to, created_at)

### POS
- `pos_sessions` (id, company_id, branch_id, cashier_id, opened_at, closed_at, opening_balance, closing_balance, status)
- `pos_sales` (id, company_id, session_id, sale_number, customer_id, subtotal, tax, discount, total, paid, change, payment_method, status, created_at)
- `pos_sale_items` (id, pos_sale_id, item_id, qty, unit_price, tax, discount, total)
- `cash_registers` (id, company_id, branch_id, name, current_balance, status)
- `pos_receipts` (id, pos_sale_id, receipt_number, printer_type, printed_at, receipt_data)

### Projects
- `projects` (id, company_id, code, name, client_id, manager_id, budget, start_date, end_date, status, priority, progress_pct, billing_type, deleted_at)
- `project_milestones` (id, project_id, name, due_date, amount, status, completed_at)
- `project_tasks` (id, project_id, title, description, assignee_id, priority, due_date, status, hours_estimated, hours_logged, parent_id, stage)
- `project_bugs` (id, project_id, title, description, severity, status, reporter_id, assignee_id, created_at, resolved_at)
- `timesheets` (id, company_id, employee_id, project_id, task_id, date, hours, description, billable, approved_by)
- `project_expenses` (id, project_id, category, amount, date, receipt_url, approved_by)
- `project_notes` (id, project_id, user_id, note, created_at)

### Support
- `tickets` (id, company_id, ticket_number, subject, category, priority, status, requester_id, assignee_id, sla_deadline, resolved_at, rating, deleted_at)
- `ticket_comments` (id, ticket_id, user_id, message, is_internal, created_at)
- `meetings` (id, company_id, title, description, zoom_link, start_time, end_time, attendees_json, created_by)

### Customer Portal
- `portal_users` (id, company_id, customer_id, user_id, is_primary, created_at, deleted_at)
- `portal_sessions` (id, portal_user_id, token, ip, user_agent, expires_at)

### Integrations
- `notification_settings` (id, company_id, channel, module, events_json, is_active)
- `webhooks` (id, company_id, name, url, events_json, secret, is_active)
- `api_keys` (id, company_id, name, key_hash, permissions_json, last_used, expires_at)

---

## API Routing Convention

```
/auth
  POST /login
  POST /register
  POST /logout
  GET  /me
  POST /refresh
  POST /forgot-password
  POST /reset-password

/finance
  GET    /bank-accounts
  POST   /bank-accounts
  GET    /bank-accounts/{id}
  POST   /bank-transfers
  GET    /bank-transfers
  GET    /accounts
  POST   /accounts
  GET    /accounts/{id}
  PUT    /accounts/{id}
  GET    /accounts/{id}/transactions
  POST   /transactions
  GET    /invoices
  POST   /invoices
  GET    /invoices/{id}
  PUT    /invoices/{id}/status
  GET    /invoices/{id}/pdf
  GET    /credit-notes
  POST   /credit-notes
  GET    /debit-notes
  POST   /debit-notes
  GET    /estimates
  POST   /estimates
  PUT    /estimates/{id}/convert-to-invoice
  GET    /expenses
  POST   /expenses
  GET    /reports/profit-loss
  GET    /reports/balance-sheet
  GET    /reports/trial-balance
  GET    /reports/cash-flow
  POST   /reports/export

/hr
  GET    /employees
  POST   /employees
  GET    /employees/{id}
  PUT    /employees/{id}
  GET    /employees/{id}/attendance
  POST   /attendance
  POST   /attendance/bulk
  GET    /payroll
  POST   /payroll/generate
  GET    /payroll/{id}/payslip
  GET    /leaves
  POST   /leaves
  PUT    /leaves/{id}/approve
  GET    /leave-balances
  GET    /recruitment
  POST   /recruitment
  PUT    /recruitment/{id}/stage
  GET    /trainings
  POST   /trainings
  GET    /performance
  POST   /performance
  GET    /employees/{id}/assets
  GET    /employees/{id}/documents

/inventory
  GET    /categories
  POST   /categories
  GET    /items
  POST   /items
  GET    /items/{id}
  PUT    /items/{id}
  GET    /stock
  POST   /stock/adjust
  POST   /stock/transfer
  GET    /stock-transfers
  GET    /warehouses
  GET    /warehouses/{id}/stock
  POST   /stock-takes
  GET    /stock-takes
  POST   /items/import
  GET    /items/export

/procurement
  GET    /suppliers
  POST   /suppliers
  GET    /suppliers/{id}
  POST   /suppliers/{id}/payment
  GET    /requisitions
  POST   /requisitions
  PUT    /requisitions/{id}/approve
  GET    /purchase-orders
  POST   /purchase-orders
  PUT    /purchase-orders/{id}/receive
  GET    /grn
  POST   /grn

/sales
  GET    /leads
  POST   /leads
  PUT    /leads/{id}/convert
  GET    /deals
  POST   /deals
  PUT    /deals/{id}/stage
  GET    /customers
  POST   /customers
  GET    /customers/{id}/contracts
  GET    /quotations
  POST   /quotations
  GET    /sales-orders
  POST   /sales-orders
  PUT    /sales-orders/{id}/deliver
  GET    /delivery-notes
  GET    /inquiries
  POST   /inquiries
  PUT    /inquiries/{id}/assign
  GET    /campaigns
  POST   /campaigns

/pos
  POST   /sessions/open
  POST   /sessions/{id}/close
  GET    /sessions
  POST   /sales
  GET    /sales
  GET    /sales/{id}/receipt
  GET    /history
  GET    /reports/daily
  GET    /reports/monthly
  GET    /items/search

/projects
  GET    /
  POST   /
  GET    /{id}
  PUT    /{id}
  GET    /{id}/tasks
  POST   /{id}/tasks
  GET    /{id}/bugs
  POST   /{id}/bugs
  GET    /{id}/timesheets
  POST   /timesheets
  GET    /{id}/expenses
  POST   /{id}/expenses
  GET    /{id}/milestones
  GET    /{id}/reports

/support
  GET    /tickets
  POST   /tickets
  GET    /tickets/{id}
  POST   /tickets/{id}/comment
  PUT    /tickets/{id}/assign
  PUT    /tickets/{id}/resolve
  GET    /meetings
  POST   /meetings

/reports
  GET    /dashboard
  GET    /finance-summary
  GET    /hr-summary
  GET    /inventory-summary
  GET    /sales-summary
  GET    /pos-summary
  POST   /custom
  GET    /custom/{id}/export

/admin
  GET    /users
  POST   /users
  PUT    /users/{id}/role
  GET    /roles
  GET    /audit-logs
  GET    /settings
  PUT    /settings
  GET    /form-builder
  POST   /form-builder
  GET    /custom-fields
  POST   /custom-fields
  GET    /integrations
  PUT    /integrations

/subscription
  GET    /plans
  POST   /plans
  GET    /current
  POST   /subscribe
  POST   /upgrade
  GET    /payments
  GET    /invoices
  POST   /cancel

/notifications
  GET    /
  PUT    /{id}/read
  POST   /settings
  POST   /test

/workflow
  GET    /definitions
  POST   /definitions
  GET    /instances
  POST   /instances/{id}/approve
  POST   /instances/{id}/reject
  GET    /instances/{id}/history

/master-data
  GET    /currencies
  POST   /currencies
  GET    /countries
  GET    /countries/{id}/states
  GET    /units
  POST   /units
  GET    /tax-codes
  POST   /tax-codes
  GET    /payment-terms
  POST   /payment-terms
  GET    /shipping-methods
  POST   /shipping-methods
  GET    /designations
  POST   /designations

/documents
  GET    /folders
  POST   /folders
  GET    /files
  POST   /files/upload
  GET    /files/{id}/download
  DELETE /files/{id}

/search
  GET    /global?q={query}

/portal
  POST   /login
  GET    /invoices
  GET    /invoices/{id}
  GET    /quotations
  GET    /orders
  POST   /tickets
  GET    /tickets
  POST   /pay/{invoice_id}
```

---

## Frontend Routing

```
/(dashboard)/
  /dashboard

  /finance/ledger
  /finance/ledger/new
  /finance/ledger/[id]
  /finance/invoices
  /finance/invoices/new
  /finance/invoices/[id]
  /finance/credit-notes
  /finance/credit-notes/new
  /finance/credit-notes/[id]
  /finance/debit-notes
  /finance/debit-notes/new
  /finance/debit-notes/[id]
  /finance/estimates
  /finance/estimates/new
  /finance/estimates/[id]
  /finance/banking
  /finance/banking/new
  /finance/banking/[id]
  /finance/reports

  /hr/employees
  /hr/employees/new
  /hr/employees/[id]
  /hr/attendance
  /hr/payroll
  /hr/payroll/[id]
  /hr/leaves
  /hr/leaves/[id]
  /hr/recruitment
  /hr/recruitment/new
  /hr/recruitment/[id]
  /hr/training
  /hr/training/new
  /hr/training/[id]
  /hr/performance
  /hr/performance/[id]

  /inventory/items
  /inventory/items/new
  /inventory/items/[id]
  /inventory/stock
  /inventory/stock/[warehouseId]
  /inventory/warehouses
  /inventory/warehouses/new
  /inventory/warehouses/[id]
  /inventory/adjustments
  /inventory/adjustments/new

  /procurement/requisitions
  /procurement/requisitions/new
  /procurement/requisitions/[id]
  /procurement/purchase-orders
  /procurement/purchase-orders/new
  /procurement/purchase-orders/[id]
  /procurement/grn
  /procurement/grn/new
  /procurement/grn/[id]
  /procurement/suppliers
  /procurement/suppliers/new
  /procurement/suppliers/[id]

  /sales/leads
  /sales/leads/new
  /sales/leads/[id]
  /sales/deals
  /sales/deals/new
  /sales/deals/[id]
  /sales/quotations
  /sales/quotations/new
  /sales/quotations/[id]
  /sales/sales-orders
  /sales/sales-orders/new
  /sales/sales-orders/[id]
  /sales/customers
  /sales/customers/new
  /sales/customers/[id]
  /sales/contracts
  /sales/contracts/new
  /sales/contracts/[id]
  /sales/inquiries
  /sales/inquiries/[id]
  /sales/campaigns
  /sales/campaigns/new
  /sales/campaigns/[id]

  /pos/terminal
  /pos/history
  /pos/reports

  /projects/projects
  /projects/projects/new
  /projects/projects/[id]
  /projects/tasks
  /projects/tasks/new
  /projects/tasks/[id]
  /projects/bugs
  /projects/bugs/new
  /projects/bugs/[id]
  /projects/timesheets
  /projects/timesheets/[id]

  /support/tickets
  /support/tickets/new
  /support/tickets/[id]
  /support/meetings
  /support/meetings/new
  /support/meetings/[id]

  /reports

  /crm/inquiries
  /crm/inquiries/[id]
  /crm/campaigns
  /crm/campaigns/new
  /crm/campaigns/[id]

  /admin/company
  /admin/branches
  /admin/branches/new
  /admin/branches/[id]
  /admin/roles
  /admin/roles/new
  /admin/roles/[id]
  /admin/users
  /admin/users/new
  /admin/users/[id]
  /admin/audit-logs
  /admin/form-builder
  /admin/form-builder/new
  /admin/form-builder/[id]
  /admin/integrations
  /admin/settings

  /settings/profile
  /settings/billing
  /settings/theme
  /settings/notifications

/portal/                          # Customer self-service portal
  /login
  /dashboard
  /invoices
  /invoices/[id]
  /quotations
  /orders
  /tickets
  /tickets/new
  /tickets/[id]
  /profile
```

---

## Key Design Principles

1. **Types First** — Every feature starts with `types/feature.ts`, then schemas, then service, then UI.
2. **Feature-Based Folders** — `components/finance/LedgerTable.tsx`, `services/financeService.ts`.
3. **Naming** — Components: `PascalCase.tsx`, Services/Hooks/Types: `camelCase.ts`, Routes: `kebab-case`.
4. **RBAC Everywhere** — All backend routes protected by `require_role` dependency; frontend routes gated by middleware.
5. **Soft Deletes** — All master tables use `deleted_at` for recoverable data.
6. **Audit Logs** — Every create/update/delete logged with old_values, new_values, changed_fields, IP, and user agent.
7. **Multi-Company / Multi-Branch** — All transaction tables have `company_id` and `branch_id` for SaaS multi-tenancy.
8. **Approval Workflows** — Configurable multi-level workflows via Workflow Engine (MVP: simple status chains).
9. **Event Bus** — Internal pub/sub for module decoupling; events emitted on key actions (InvoicePaid, POApproved, StockAdjusted).
10. **Async-First** — FastAPI uses `async` SQLAlchemy with Neon for performance.
11. **Import/Export** — Every list view supports Excel/CSV import and export via backend.
12. **Custom Fields** — Form builder allows admins to add custom fields to any entity without code changes.
13. **White-Label Ready** — Companies can set their own logo, colors, subdomain, and email SMTP.
14. **POS Offline Queue** — POS sales saved to IndexedDB if offline, synced when connection returns.
15. **Object Storage** — All file uploads (invoices, contracts, documents) stored in S3/R2 with signed URLs.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16 (App Router) | SSR, routing, API proxy |
| Styling | Tailwind CSS v4+ | Utility-first CSS |
| UI | Shadcn/ui | Enterprise components |
| State | Zustand | Client state, auth, POS cart |
| Data Fetch | TanStack Query | Server state, caching, refetch |
| Forms | React Hook Form + Zod | Type-safe validation |
| i18n | next-intl | Multi-language + RTL support |
| Tables | TanStack Table | Sortable, filterable, paginated grids |
| Charts | Recharts / Tremor | Dashboards, reports |
| Backend | FastAPI | Async API, auto OpenAPI docs |
| ORM | SQLAlchemy 2.0 (async) | Database abstraction |
| Migrations | Alembic | Schema versioning |
| Auth | JWT (python-jose) + bcrypt | Stateless auth |
| DB | Neon Postgres | Serverless Postgres |
| Cache | Redis | Session, rate limit, POS queue |
| Queue | Celery + Redis | Payroll, reports, bulk imports |
| Storage | AWS S3 / Cloudflare R2 | File uploads, documents, exports |
| Export | openpyxl / pandas | Excel/CSV reports and imports |
| PDF | ReportLab / WeasyPrint | Invoices, payslips, POs |
| Barcode | python-barcode | EAN/UPC generation |
| Search | PostgreSQL Full-Text | Item search |
| Notifications | Slack SDK, python-telegram-bot, Twilio | Integrations |
| Observability | Sentry + OpenTelemetry | Error tracking, tracing |
| Deploy | Vercel + Render/Railway/VPS | Or Docker Compose |

---

## Background Jobs (Celery Tasks)

| Job | Schedule | Purpose |
|-----|----------|---------|
| `generate_payroll` | Monthly | Process payroll for all employees |
| `send_invoice_reminders` | Daily | Email reminders for overdue invoices |
| `send_payslips` | Monthly | Generate and email payslips |
| `generate_reports` | Weekly/Monthly | Scheduled PDF/Excel report generation |
| `backup_database` | Daily | Automated database backups |
| `sync_stock_levels` | Real-time | Sync POS sales to inventory |
| `send_notification_queue` | Every 5 min | Process queued notifications (email, SMS) |
| `expire_subscriptions` | Daily | Downgrade expired subscriptions |
| `cleanup_expired_tokens` | Daily | Remove expired JWT refresh tokens |
| `import_bank_statements` | Manual/ Scheduled | Parse uploaded CSV bank statements |

---

## Deployment Options

### Option A: Single Vercel Project (api/ folder)
- Backend lives in `/api/` as Vercel Python functions
- Good for MVP, serverless limits apply
- One domain, no CORS

### Option B: Separate Projects (preferred for scale)
- `frontend/` -> Vercel
- `backend/` -> Render / Railway / VPS
- Cleaner code, independent scaling, same repo possible
- CORS handled in FastAPI middleware

### Option C: Docker Compose (local / self-hosted)
- `docker-compose.yml` with Next.js, FastAPI, Postgres, Redis
- Best for local development and Bangladesh office LAN deployment

---

## Development Order (MVP Sprints)

| Sprint | Focus | Deliverable |
|--------|-------|-------------|
| 1 | Auth + RBAC + Company Setup + SaaS Plans | Login, roles, users, branches, audit logs, subscription plans |
| 2 | Inventory + Items + POS | SKU, stock, warehouses, POS terminal, barcode, receipts |
| 3 | Procurement + Sales CRM | PR, PO, GRN, suppliers, leads, customers, quotations, deals |
| 4 | Finance + Banking | Chart of accounts, transactions, invoices, credit/debit notes, estimates, banking, basic reports |
| 5 | HR | Employees, attendance, leave, payroll (Bangladesh rules), recruitment |
| 6 | Projects + Support | Projects, tasks, bugs, timesheets, tickets, meetings |
| 7 | BI + Admin + Integrations | Dashboards, custom reports, form builder, Excel export, Slack/Telegram |
| 8 | Polish + SaaS Billing | White-label, theme, billing portal, payment gateways, multi-tenant isolation |

---

## Bangladesh-Specific Considerations

- **VAT & Tax:** Invoices must support Bangladesh VAT rules (15% or exempt), TDS tracking, tax slab in payroll.
- **Payroll:** Support provident fund, gratuity, festival bonuses, professional tax calculations.
- **Banking:** Integration with Bangladeshi banks for statement import (manual CSV upload first, then API hooks).
- **Bengali UI:** i18n ready with `next-intl` for future Bengali language support, RTL support for Arabic if needed.
- **POS:** Thermal printer support for local shops, offline mode for poor connectivity areas.
- **SMS:** Twilio integration for OTP, payment reminders, approval alerts via local telecom gateways.

---

## Gaps vs ERPGo SaaS (Resolved)

| Feature | ERPGo SaaS | Our Spec |
|---------|-----------|---------|
| POS | Yes | Yes |
| Credit/Debit Notes | Yes | Yes |
| Estimates | Yes | Yes |
| Banking & Transfers | Yes | Yes |
| Deals / CRM Pipeline | Yes | Yes |
| Contracts | Yes | Yes |
| Bug Tracking | Yes | Yes |
| Support Tickets | Yes | Yes |
| Zoom/Slack/Telegram/Twilio | Yes | Yes |
| SaaS Plans & Billing | Yes | Yes |
| Form Builder | Yes | Yes |
| White-label / Theme | Yes | Yes |
| Import/Export | Yes | Yes |
| Employee Assets | Yes | Yes |
| Training & Appraisal | Yes | Yes |
| Inquiry Management | Yes | Yes |
| POS Reports | Yes | Yes |
| Multi-language / RTL | Yes | Yes |

---

*End of ERP Master Specification*
<!-- END:erp-master-spec -->
