# Frontend API Guide

## Auth

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `GET /api/auth/access/`

## CRM

- `GET/POST /api/crm/pipelines/`
- `GET/POST /api/crm/stages/`
- `GET/POST /api/crm/leads/`
- `GET/POST /api/crm/opportunities/`
- `GET/POST /api/crm/activities/`
- `POST /api/crm/opportunities/<id>/convert-to-client/`

## Clients

- `GET/POST /api/clients/clients/`
- `GET/POST /api/clients/brands/`
- `GET/POST /api/clients/contacts/`

## Briefings

- `GET/POST /api/briefings/templates/`
- `GET/POST /api/briefings/briefings/`
- `GET/POST /api/briefings/analyses/`
- `GET/POST /api/briefings/contract-drafts/`
- `POST /api/briefings/briefings/<id>/generate-contract-draft/`
- `POST /api/briefings/contract-drafts/<id>/promote-to-contract/`

## Contracts

- `GET/POST /api/contracts/contracts/`

## Services

- `GET/POST /api/services/services/`

## Projects

- `GET/POST /api/projects/projects/`
- `GET/POST /api/projects/jobs/`

## Tasks

- `GET/POST /api/tasks/tasks/`
- `GET/POST /api/tasks/attachments/`
- `POST /api/tasks/attachments/create-upload-url/`
- `GET /api/tasks/attachments/<id>/signed-url/`

## Time Entries

- `GET/POST /api/time-entries/time-entries/`

## Files / Assets

- `GET/POST /api/files/assets/`
- `POST /api/files/assets/<id>/submit-for-review/`
- `POST /api/files/assets/<id>/archive/`
- `GET/POST /api/files/versions/`
- `POST /api/files/versions/create-upload-url/`
- `GET /api/files/versions/<id>/signed-url/`
- `GET/POST /api/files/comments/`
- `POST /api/files/comments/<id>/resolve/`
- `GET/POST /api/files/approval-requests/`
- `POST /api/files/approval-requests/<id>/approve/`
- `POST /api/files/approval-requests/<id>/reject/`
- `POST /api/files/approval-requests/<id>/request-changes/`
- `POST /api/files/approval-requests/<id>/cancel/`

## Finance

- `GET/POST /api/finance/financial-categories/`
- `GET/POST /api/finance/cost-centers/`
- `GET/POST /api/finance/invoices/`
- `GET/POST /api/finance/billing-entries/`
- `GET/POST /api/finance/invoice-payments/`
- `GET/POST /api/finance/invoice-payment-refunds/`
- `POST /api/finance/invoices/<id>/mark-issued/`
- `POST /api/finance/invoices/<id>/mark-overdue/`
- `POST /api/finance/invoices/<id>/mark-paid/`
- `POST /api/finance/invoices/<id>/mark-void/`
- `GET /api/finance/invoices/<id>/document/`
- `GET /api/finance/invoices/reports/summary/`
- `GET /api/finance/invoices/reports/by-client/`
- `GET /api/finance/invoices/reports/profitability/by-client/`
- `GET /api/finance/invoices/reports/profitability/by-project/`
- `GET/POST /api/finance/vendors/`
- `GET/POST /api/finance/payables/`
- `GET/POST /api/finance/payable-payments/`
- `POST /api/finance/payables/<id>/mark-approved/`
- `POST /api/finance/payables/<id>/mark-overdue/`
- `POST /api/finance/payables/<id>/mark-paid/`
- `POST /api/finance/payables/<id>/mark-void/`
- `GET /api/finance/payables/reports/summary/`

## Dashboard

- `GET /api/dashboard/overview/`
- `GET /api/dashboard/finance/`
- `GET /api/dashboard/projects/`
- `GET /api/dashboard/clients/`
- `GET /api/dashboard/operations/`

## Notifications

- `GET /api/notifications/`
- `GET /api/notifications/unread-count/`
- `POST /api/notifications/mark-all-read/`
- `POST /api/notifications/run-scheduled/`
- `POST /api/notifications/<id>/mark-read/`
- `POST /api/notifications/<id>/archive/`

## Audit

- `GET /api/audit/logs/`
- `GET /api/audit/logs/<id>/`

## Conventions

- lists return pagination envelope
- write actions can be blocked by role
- use `/api/docs/` to inspect schema live

