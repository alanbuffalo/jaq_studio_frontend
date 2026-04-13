# Frontend Flows

## 1. CRM

- create lead
- create opportunity in pipeline/stage
- register commercial activities
- move opportunity through stages
- when won, call `POST /api/crm/opportunities/<id>/convert-to-client/`

Result:

- creates `Client`
- creates initial `Briefing`

## 2. Client Onboarding

- manage client
- manage brand/business unit
- manage contacts
- use client as the anchor for contracts, projects and finance

## 3. Briefing to Contract

- create briefing
- create internal analysis
- approve analysis
- generate contract draft
- review draft
- promote draft to contract

Important:

- briefing does not generate contract directly
- analysis is required

## 4. Project Delivery

- create project
- create jobs inside project
- create tasks inside project/job
- assign owners
- track status and due dates
- register time entries

## 5. Asset Workflow

- create asset linked to client/project/job/task
- create asset versions
- comment on asset/version
- request internal or client approval
- approve, reject or request changes

## 6. Receivables

- create invoice
- add billing entries
- issue invoice
- receive partial or full payments
- refund when needed
- download PDF document

Important:

- task-based billing requires task status `DONE`
- manual billing is allowed without task

## 7. Payables

- create vendor
- create payable
- approve payable
- register partial or full payments
- track open amount

## 8. Notifications

- inbox list
- unread count
- mark one as read
- mark all as read
- archive

Automatic notifications already exist for:

- task blocked or overdue
- approvals due
- invoice overdue
- payable overdue
- contract renewal approaching

