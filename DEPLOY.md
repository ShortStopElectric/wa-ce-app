# WA CE App — Deployment Guide

## Prerequisites
- Supabase project (free tier works)
- Resend account for email
- Vercel account
- GoDaddy domain: `learn.shortstopelectric.com`

---

## 1. Supabase Setup

1. Create a new Supabase project at supabase.com
2. Go to **SQL Editor** → **New query**
3. Paste the full contents of `supabase-schema.sql` and run it
4. Go to **Project Settings → API** and copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Authentication → Settings**:
   - Site URL: `https://learn.shortstopelectric.com`
   - Enable **Email** provider
   - Enable **MFA** (Multi-Factor Authentication) → **TOTP**

---

## 2. Resend Setup

1. Create an account at resend.com
2. Verify your sending domain `shortstopelectric.com`
3. Create an API key → copy it as `RESEND_API_KEY`
4. Set `RESEND_FROM=certificates@shortstopelectric.com`

---

## 3. Create .env.local

```bash
cp .env.local.example .env.local
# Fill in all values
```

---

## 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# From wa-ce-app directory:
vercel

# Follow prompts — link to your Vercel account
# Set environment variables when asked, OR set them in Vercel dashboard
```

### Set Environment Variables in Vercel Dashboard
Go to your project → **Settings → Environment Variables** and add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `NEXT_PUBLIC_APP_URL` = `https://learn.shortstopelectric.com`
- `NEXT_PUBLIC_CE_PROVIDER_ID` = your WA L&I provider ID

---

## 5. Connect GoDaddy Domain

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add `learn.shortstopelectric.com`
3. Vercel will show you DNS records to add
4. Log into **GoDaddy → DNS Management** for `shortstopelectric.com`
5. Add a **CNAME record**:
   - Type: `CNAME`
   - Name: `learn`
   - Value: `cname.vercel-dns.com`
   - TTL: 600 (or Auto)
6. Wait 5-30 minutes for DNS propagation
7. Vercel will auto-provision SSL once DNS resolves

---

## 6. Create First Admin User

1. Go to `https://learn.shortstopelectric.com/login`
2. Sign up with your admin email
3. In Supabase dashboard → **Table Editor → profiles**
4. Find your row and set `role` to `admin`
5. Complete MFA enrollment
6. Access admin panel at `/admin`

---

## 7. Create Student Accounts

Students register via Supabase Auth. You can:
- Invite them via Supabase **Authentication → Users → Invite user**
- Or build a signup page (not included — MFA enrollment handles first login)

---

## Project Structure

```
wa-ce-app/
├── app/
│   ├── login/          # Email + password + TOTP MFA
│   ├── setup-mfa/      # TOTP enrollment (required on first login)
│   ├── dashboard/      # Student module grid + progress
│   ├── module/[id]/    # Course content + module quiz
│   ├── exam/           # 120-question final exam
│   ├── certificate/    # Certificate display + PDF download
│   ├── admin/          # Admin student tracking + CSV export
│   └── api/            # Auth, progress, certificate, admin endpoints
├── components/
│   └── CertificatePDF.tsx   # react-pdf certificate template
├── data/
│   └── modules.ts      # All 12 modules (auto-extracted, 122KB)
├── lib/
│   ├── supabase.ts          # Browser Supabase client
│   ├── supabase-server.ts   # Server Supabase client
│   └── resend.ts            # Email client (lazy init)
├── types/index.ts      # TypeScript types
├── middleware.ts        # Auth + MFA guard
└── supabase-schema.sql # Database schema
```
