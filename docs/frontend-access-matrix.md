# Frontend Access Matrix

Use `GET /api/auth/access/` as the runtime source of truth. This file is a build guideline.

## ADMIN

- full access to all modules

## DIRETOR

- full business access
- can manage users
- cannot manage settings module

## FINANCEIRO

- finance
- dashboard
- clients read
- contracts read
- notifications

Should not have write access to:

- projects
- tasks
- files
- CRM

## ATENDIMENTO

- dashboard
- CRM
- clients
- briefings
- contracts
- projects
- tasks
- time entries
- files
- notifications
- finance read and limited operational visibility

Should not have finance management actions.

## MIDIA

- dashboard
- clients read
- projects
- tasks
- time entries
- files
- notifications read
- services read

Should not access:

- finance
- CRM
- contracts write
- user management

## Frontend Rule

- gate routes by `modules`
- gate buttons/actions by `permissions`
- do not rely only on hidden UI; backend still enforces permissions

