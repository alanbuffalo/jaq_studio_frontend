# Frontend Handoff

## Product Scope

This backend already covers the core ERP flow for the agency:

`lead -> opportunity -> client -> briefing -> analysis -> contract draft -> contract -> project -> job -> task -> time entry -> billing/invoice`

There is also support for:

- payables and vendor management
- dashboards
- notifications
- audit logs
- files/assets with approvals
- Supabase Storage signed upload flow

## Backend Base

- Framework: Django + DRF
- Auth: JWT
- Schema: `/api/schema/`
- Swagger: `/api/docs/`
- Redoc: `/api/redoc/`
- Healthcheck: `/healthz/`

## API Conventions

- Base prefix: `/api/`
- Lists are paginated
- Validation and server errors are standardized
- Many modules use soft delete
- Several flows use custom actions, not only CRUD

## Auth Flow

- Login: `POST /api/auth/login/`
- Refresh: `POST /api/auth/refresh/`
- Current user: `GET /api/auth/me/`
- Access matrix: `GET /api/auth/access/`

Frontend should load `/api/auth/access/` after login and use it to:

- gate routes
- hide actions
- build sidebar/modules

## File Upload Flow

Files do not go through Django.

### Task attachment

1. `POST /api/tasks/attachments/create-upload-url/`
2. upload directly to Supabase Storage
3. `POST /api/tasks/attachments/` with metadata
4. when needed, `GET /api/tasks/attachments/<id>/signed-url/`

### Asset version

1. `POST /api/files/versions/create-upload-url/`
2. upload directly to Supabase Storage
3. `POST /api/files/versions/` with metadata
4. when needed, `GET /api/files/versions/<id>/signed-url/`

## Suggested Frontend Build Order

1. auth and access control
2. dashboard shell and app layout
3. CRM
4. clients
5. briefings
6. contracts
7. projects, jobs, tasks
8. time entries
9. finance
10. files and approvals
11. notifications

## Important Rule

Do not invent endpoints if an action already exists in the backend. Several business transitions are explicit actions.

