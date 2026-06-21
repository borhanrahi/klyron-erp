# API Routes

## Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

## Finance
```
GET    /api/v1/finance/bank-accounts
POST   /api/v1/finance/bank-accounts
GET    /api/v1/finance/accounts
POST   /api/v1/finance/accounts
GET    /api/v1/finance/invoices
POST   /api/v1/finance/invoices
GET    /api/v1/finance/credit-notes
POST   /api/v1/finance/credit-notes
GET    /api/v1/finance/estimates
POST   /api/v1/finance/estimates
GET    /api/v1/finance/expenses
POST   /api/v1/finance/expenses
```

## HR
```
GET    /api/v1/hr/employees
POST   /api/v1/hr/employees
GET    /api/v1/hr/attendance
POST   /api/v1/hr/attendance
GET    /api/v1/hr/payroll
POST   /api/v1/hr/payroll/generate
GET    /api/v1/hr/leaves
POST   /api/v1/hr/leaves
```

## Inventory
```
GET    /api/v1/inventory/items
POST   /api/v1/inventory/items
GET    /api/v1/inventory/stock
POST   /api/v1/inventory/stock/adjust
GET    /api/v1/inventory/warehouses
POST   /api/v1/inventory/warehouses
```

## Procurement
```
GET    /api/v1/procurement/suppliers
POST   /api/v1/procurement/suppliers
GET    /api/v1/procurement/requisitions
POST   /api/v1/procurement/requisitions
GET    /api/v1/procurement/purchase-orders
POST   /api/v1/procurement/purchase-orders
```

## Sales
```
GET    /api/v1/sales/leads
POST   /api/v1/sales/leads
GET    /api/v1/sales/deals
POST   /api/v1/sales/deals
GET    /api/v1/sales/customers
POST   /api/v1/sales/customers
GET    /api/v1/sales/quotations
POST   /api/v1/sales/quotations
```

## POS
```
POST   /api/v1/pos/sessions/open
POST   /api/v1/pos/sessions/{id}/close
POST   /api/v1/pos/sales
GET    /api/v1/pos/sales
```

## Projects
```
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/{id}/tasks
POST   /api/v1/projects/{id}/tasks
```

## Support
```
GET    /api/v1/support/tickets
POST   /api/v1/support/tickets
POST   /api/v1/support/tickets/{id}/comment
```

## Admin
```
GET    /api/v1/admin/users
POST   /api/v1/admin/users
GET    /api/v1/admin/roles
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/settings
PUT    /api/v1/admin/settings
```
