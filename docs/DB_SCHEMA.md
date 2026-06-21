# Database Schema

## Auth & System

### users
- id (PK)
- email (unique, indexed)
- full_name
- password_hash
- role_id (FK -> roles)
- branch_id (FK -> branches)
- company_id (FK -> companies)
- status
- last_login
- created_at, updated_at, deleted_at

### roles
- id (PK)
- name (unique)
- permissions_json (JSON)
- company_id (FK -> companies)
- created_at, deleted_at

### companies
- id (PK)
- name
- logo
- tax_id
- currency
- timezone
- address
- subdomain (unique)
- plan_id (FK -> plans)
- status
- created_at, deleted_at

### branches
- id (PK)
- company_id (FK -> companies)
- name
- code
- address
- manager_id (FK -> users)
- is_active
- created_at, deleted_at

## Finance

### invoices
- id (PK)
- company_id (FK -> companies)
- customer_id (FK -> customers)
- branch_id (FK -> branches)
- invoice_number (unique)
- date, due_date
- subtotal, tax, total
- status
- paid_amount, balance_due
- created_at, deleted_at

### chart_of_accounts
- id (PK)
- company_id (FK -> companies)
- code
- name
- type
- parent_id (self-referencing)
- balance
- is_active
- created_at, deleted_at

## HR

### employees
- id (PK)
- company_id (FK -> companies)
- user_id (FK -> users)
- employee_code (unique)
- department_id (FK -> departments)
- designation
- joining_date
- salary
- status
- created_at, deleted_at

### payroll
- id (PK)
- company_id (FK -> companies)
- employee_id (FK -> employees)
- month, year
- base_salary, allowances, deductions, tax, bonus, net_pay
- status
- created_at

## Inventory

### items
- id (PK)
- company_id (FK -> companies)
- sku (unique)
- name
- category_id (FK -> item_categories)
- unit
- cost_price, sell_price
- tax_rate
- barcode
- created_at, deleted_at

### stock
- id (PK)
- company_id (FK -> companies)
- item_id (FK -> items)
- warehouse_id (FK -> warehouses)
- quantity, reserved_qty
- reorder_level, reorder_qty
- created_at, updated_at

## Sales

### customers
- id (PK)
- company_id (FK -> companies)
- name
- email, phone
- tax_id
- address
- credit_limit, balance
- loyalty_points
- status
- created_at, deleted_at

### leads
- id (PK)
- company_id (FK -> companies)
- name
- email, phone
- source
- status
- assigned_to (FK -> users)
- score
- created_at, deleted_at
