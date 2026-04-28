# Supabase Backend Setup

This app is wired for Supabase Auth and Postgres. Passwords are handled by Supabase Auth; the app database stores user profile and product data, not raw passwords.

## 1. Create the Supabase project

Create a Supabase project and copy:

- Project URL
- Public anon key

These are safe to use in the frontend when Row Level Security is enabled.

## 2. Create the database

In Supabase SQL editor, run:

```sql
supabase/migrations/20260428230000_initial_backend.sql
```

This creates profiles, family profiles, caregiver profiles, bookings, messages, referrals, verification requests, reviews, and subscription entitlements with RLS enabled.

## 3. Configure the build

Set these environment variables before building:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
APP_ENV=production
```

Then run:

```bash
npm run build
npm run cap:sync
```

The build writes `dist/config.js`. The source fallback in `public/config.js` is intentionally blank.

## 4. Auth redirect URLs

In Supabase Auth settings, add the app URLs:

- `https://szaidman55.github.io/18-sitter-v4/`
- Your future production domain
- Native redirect URLs once Apple/Android builds are finalized

## 5. Payments

Keep Apple/Google subscriptions outside Supabase. Use RevenueCat or store webhooks to update `subscription_entitlements` from a server-side trusted process.

Do not update subscription status directly from the mobile app.
