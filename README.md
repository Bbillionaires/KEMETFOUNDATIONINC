# Kemet Foundation Inc — Website

The public website for Kemet Foundation Inc, a Florida nonprofit corporation focused on African
heritage and cultural education, community development, family strengthening, and economic
empowerment. Live at [kemetfoundationinc.org](https://kemetfoundationinc.org).

## Status

**Works today:**
- All public pages (Home, Mission, Membership, Events, Team, Contact, Donate, Privacy, Terms)
- Contact form, membership interest form, and newsletter signup — delivered by email via Resend
- Events listing with calendar/list view, event detail pages, and the homepage "Upcoming Events" section
- Donations via Square Checkout (one-time and monthly, including Cash App Pay), **in sandbox mode by
  default** — see [Payments](#payments-square) below
- Cinematic homepage logo intro animation (runs once per session, respects reduced-motion)
- SEO metadata, sitemap, robots.txt

**What's left / needs a decision from the organization:**
- **Square must be switched to production** before donations can process real payments — see
  [Payments](#payments-square).
- **Resend must be configured** (`RESEND_API_KEY` / `EMAIL_FROM`, plus domain verification) before
  the contact form, membership form, newsletter signup, and donation notification emails actually
  send — without it they show a clear "not yet configured" error instead of failing silently.
- **Privacy Policy and Terms of Service are explicitly marked as placeholders** pending attorney
  review (see [Placeholder content](#placeholder-content)).
- No database and no admin panel, by design (see [Architecture](#architecture)) — events, team
  members, and all page copy are edited directly in code (see [Editing content](#editing-content)).

**Not done by design, not by oversight:** an earlier version of this task list called for a
Stripe- or PayPal-based donation flow. That's already implemented differently and on purpose —
donations run on Square (with Cash App Pay support) per a deliberate decision made with the
organization. Adding a second, competing payment processor wasn't done; if a change of payment
processor is wanted, that's a decision for the organization, not something to build speculatively.

## Architecture

This is a **static/server-rendered Next.js site with no database and no admin panel** — a
deliberate simplification. There are no member accounts, no event RSVP/registration tracking, and
no back-office dashboard. Instead:
- Events and team members are defined directly in code (`src/lib/events-data.ts`,
  `src/lib/team-data.ts`).
- Form submissions (contact, membership interest, newsletter) are emailed to the organization via
  Resend rather than stored anywhere.
- Donations are handled entirely by Square Checkout; Square itself is the system of record for
  payment history, not this app.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · React Hook Form + Zod ·
Square Node SDK · Resend.

## Setup

```bash
npm install
cp .env.example .env   # fill in values — see below; the site runs with all of them unset
npm run dev
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

### Environment variables

See `.env.example` for the full list with inline documentation. Nothing is required for the site
to build and run — every integration below degrades to a clear "not yet configured" message when
its variables are unset, rather than crashing or failing silently.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO metadata, sitemap, OpenGraph |
| `NEXT_PUBLIC_ORG_EMAIL` | Publicly displayed contact email (footer, contact page) |
| `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_ENVIRONMENT`, `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SQUARE_WEBHOOK_NOTIFICATION_URL` | Square Checkout for donations — see [Payments](#payments-square) |
| `RESEND_API_KEY`, `EMAIL_FROM` | Transactional email for forms and donation notifications |
| `ORG_NOTIFICATION_EMAILS` | Comma-separated inboxes that receive form/donation notifications (separate from the public-facing `NEXT_PUBLIC_ORG_EMAIL`) |

## Payments (Square)

Donations go through [Square Checkout](https://developer.squareup.com/apps), including Cash App
Pay, Apple Pay, and Google Pay.

- **`SQUARE_ENVIRONMENT` defaults to `"sandbox"`.** With sandbox credentials, the full donation
  flow (one-time and monthly, including the dynamic subscription-plan creation for recurring
  donations) can be tested end-to-end using Square's test card numbers, without moving any real
  money.
- **To go live:** set `SQUARE_ENVIRONMENT="production"` and supply production
  `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID` from the Square Developer Dashboard. This is a
  one-way decision the organization needs to make deliberately — this codebase never switches
  itself to production.
- The webhook at `/api/donations/webhook` verifies Square's signature and emails
  `ORG_NOTIFICATION_EMAILS` when a payment completes. Create the webhook subscription in the
  Square dashboard pointing at `<your-site>/api/donations/webhook`, and set
  `SQUARE_WEBHOOK_SIGNATURE_KEY` / `SQUARE_WEBHOOK_NOTIFICATION_URL` to match.
- With no Square credentials set at all, the donate page still renders with checkout disabled
  rather than erroring.

## Editing content

There's no admin panel — content changes are code changes, committed and redeployed:

- **Events:** `src/lib/events-data.ts` — add/edit/remove entries in the `EVENTS` array.
- **Team members:** `src/lib/team-data.ts`.
- **Page copy** (hero text, mission statement, section headings, etc.): `src/lib/site-content.ts`,
  consolidated there so copy can be found and edited in one place instead of scattered across page
  components.
- **Org details** (address, public email, notification inboxes, nav links): `src/lib/constants.ts`.

## Placeholder content

The **Privacy Policy** (`/privacy`) and **Terms of Service** (`/terms`) pages carry an explicit
on-page notice: they are generic, illustrative placeholder text pending final review by the
organization's attorney, not finalized policy. No other page content is placeholder — mission,
team, and event content reflects real information provided by the organization; nothing else was
fabricated.

## Deployment

Deployed on [Vercel](https://vercel.com), connected to this repository's default branch. Vercel
builds with `npm run build` (plain `next build`, no database migrations to run) and serves the
result; set the environment variables above in the Vercel project settings before relying on
email or donations in production.
