# 果物キング — Fruit King

A bilingual (日本語 / English) P2P fruit marketplace MVP for Japan, built with **Next.js 15 + Supabase**. Sellers list seasonal fruit, buyers browse and contact them. No payments — this is a listing & inquiry MVP.

> Brand: 果物キング / Fruit King — *Seasonal Japanese fruit, direct from growers.*

---

## Features

- 🍊 **Browse & search** active fruit listings, by title, type, prefecture
- 🔐 **Google sign-in** via Supabase Auth (OAuth)
- 👤 **Public seller profiles** at `/u/[username]` with their current listings
- 📝 **Listing CRUD** with multi-image upload to Supabase Storage
- ✉️ **In-app inquiries** — buyers contact sellers via a stored message thread
- 🛡️ **Admin role** baked in from day one (`profiles.is_admin`) with admin pages and server actions
- 🌐 **Bilingual UI** (Japanese default, English secondary) via [next-intl](https://next-intl-docs.vercel.app/), with locale switcher
- 🔒 **Row Level Security** policies on every table

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + a few [shadcn/ui](https://ui.shadcn.com/)-style primitives
- [Supabase](https://supabase.com/) — Postgres, Auth, Storage
- [next-intl](https://next-intl-docs.vercel.app/) for i18n
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) (form validation via server actions)

---

## Local setup

### 1. Install dependencies

```bash
pnpm install      # or: npm install / yarn install
```

### 2. Environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server only
```

### 3. Run the dev server

```bash
pnpm dev
```

Open http://localhost:3000 — you'll be redirected to `/ja` (Japanese is the default locale).

---

## Supabase setup

### Create the project

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy **Project URL**, **anon public key**, and **service_role key** into `.env.local`.

### Apply migrations

The SQL files in `supabase/migrations/` should be run **in order**. The easiest way:

- Open the Supabase SQL editor and paste each file in order, *or*
- Use the [Supabase CLI](https://supabase.com/docs/guides/cli):
  ```bash
  supabase link --project-ref <your-ref>
  supabase db push
  ```

| File | Purpose |
|---|---|
| `0001_init_schema.sql` | Tables, enums, indexes, `set_updated_at`, `is_admin()` |
| `0002_rls_policies.sql` | Row Level Security policies on every table |
| `0003_storage_buckets.sql` | `avatars` and `listing-images` buckets + storage policies |
| `0004_profile_trigger.sql` | Auto-create a `profiles` row on new user signup |

### (Optional) Load seed data

```bash
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

⚠️  The seed file uses placeholder UUIDs — open it and replace them with real `auth.users.id` values from your project before running, otherwise the foreign keys will fail. **Local dev only.**

---

## Google OAuth setup

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Configure the **OAuth consent screen** (External, scopes: `email`, `profile`, `openid`).
3. Create an **OAuth 2.0 Client ID** of type **Web application**.
4. Authorized JavaScript origins:
   - `http://localhost:3000`
   - your production origin (e.g. `https://kudamono-king.vercel.app`)
5. Authorized redirect URIs — add the Supabase callback URL:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
6. In Supabase dashboard → **Authentication → Providers → Google** → enable, paste Client ID and Client Secret.
7. In Supabase dashboard → **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (and your production URL)
   - **Additional redirect URLs**: `http://localhost:3000/auth/callback`, `https://<prod>/auth/callback`

The app uses `/auth/callback` (defined in `src/app/auth/callback/route.ts`) to exchange the OAuth code for a session.

---

## Vercel deployment

1. Push this repository to GitHub.
2. Import the repo on [vercel.com/new](https://vercel.com/new).
3. Add environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` — set to your production URL (e.g. `https://kudamono-king.vercel.app`)
4. Update Supabase **Site URL** and **Redirect URLs** to include the production origin.
5. Update Google OAuth authorized origins/redirects similarly.
6. Deploy!

---

## Granting admin

After signing in once with your Google account, give yourself admin access via SQL:

```sql
update public.profiles
   set is_admin = true
 where email = 'you@example.com';
```

Then visit `/admin` — you'll see the admin dashboard, listings management, and users list.

---

## Project structure

```
src/
├── app/
│   ├── [locale]/                  # all i18n routes
│   │   ├── page.tsx               # /  homepage
│   │   ├── listings/              # /listings + /listings/[id]
│   │   ├── u/[username]/          # public seller profile
│   │   ├── search/                # combined search (listings + sellers)
│   │   ├── login/                 # Google sign-in
│   │   ├── dashboard/             # auth-gated user pages
│   │   └── admin/                 # admin pages (requireAdmin guard)
│   ├── auth/callback/             # Supabase OAuth code exchange
│   └── layout.tsx
├── components/
│   ├── ui/                        # Button, Input, Card, etc.
│   ├── layout/                    # SiteHeader, SiteFooter, LocaleSwitcher, UserMenu
│   ├── listings/                  # ListingCard, ListingForm, ContactSellerForm…
│   ├── profile/                   # ProfileForm, AvatarUploader, ProfileHeader
│   ├── search/                    # SearchBar
│   └── common/                    # EmptyState, LoadingSkeleton, ErrorState
├── i18n/                          # next-intl config (routing, request, navigation)
├── lib/
│   ├── supabase/                  # browser/server/middleware/admin clients
│   ├── auth/                      # getCurrentUser, requireAdmin
│   ├── data/                      # server-side query helpers
│   ├── actions/                   # server actions (create/update/delete/contact)
│   ├── validation/                # zod schemas
│   ├── constants/                 # prefectures, fruit types, currencies
│   └── utils.ts                   # cn(), formatPrice(), formatDate()
└── types/                         # database & domain types

messages/
├── ja.json                        # default locale
└── en.json

supabase/
├── migrations/                    # 0001 → 0004
└── seed.sql
```

---

## Future improvements

- 💳 **Real payments** (Stripe, Komoju, or PAY.JP)
- 📦 **Order workflow** with shipping status tracking
- ⭐ **Reviews & seller ratings**
- ❤️ **Favorites UI** — the `favorites` table already exists, just needs UI
- 💬 **Real-time chat** between buyer and seller (Supabase Realtime channels)
- 🛡️ **Moderation** — reports, soft-delete reasons, automod for prohibited content
- 🔍 **Richer filters** — price ranges, in-stock toggle, harvest season
- ✉️ **Email notifications** when an inquiry arrives (Resend / Supabase Edge Functions)
- 🌐 **Sitemap, structured data, OG images** for SEO
- 🧪 **Tests** — Playwright for E2E flows, Vitest for action validation
