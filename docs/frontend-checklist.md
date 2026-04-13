# Frontend Checklist

- use JWT auth
- fetch `/api/auth/access/` after login
- implement a global API client
- support paginated list responses
- support standardized error payloads
- support soft-delete semantics in list/detail screens
- handle action endpoints in addition to CRUD
- implement Supabase signed upload flow
- use status-driven UI for finance and approvals
- build finance with separate receivables and payables areas
- build notifications inbox and unread count in app shell
- use `/api/docs/` during integration to inspect payloads

## Prompt For Another Chat

Use this backend as the source of truth.

Read:

- `docs/frontend-handoff.md`
- `docs/frontend-flows.md`
- `docs/frontend-api-guide.md`
- `docs/frontend-access-matrix.md`

Then build the frontend around the existing API and business transitions. Do not invent endpoints if the backend already exposes an action for that transition.

