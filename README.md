# ArchLink — Architecture Marketplace

A full-stack two-sided marketplace connecting clients with architects. Built with Next.js 14, Prisma, NextAuth, and Tailwind CSS.

## Features

- **Two user roles**: Client & Architect
- **Google OAuth + email/password** authentication
- **Architect profiles**: bio, specialty, location, portfolio, services, pricing
- **Browse & search** architects by keyword, specialty, location, availability
- **Real-time messaging** between users (polls every 3s)
- **Reviews & ratings** system (1–5 stars)
- **Dashboards** for both architects and clients
- **Portfolio management** for architects

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v4 |
| ORM | Prisma |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Fonts | Cormorant Garamond + DM Sans |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in your values:

```bash
cp .env.local .env.local
```

Required variables:
- `DATABASE_URL` — SQLite path (default works for dev)
- `NEXTAUTH_SECRET` — generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from [Google Cloud Console](https://console.cloud.google.com)

#### Setting up Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services → Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
6. Copy Client ID and Secret to `.env.local`

### 3. Set up the database

```bash
npm run db:push    # Push schema to SQLite
npm run db:seed    # Seed with demo data
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Demo Accounts

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Architect | marta@demo.com | demo12345 |
| Architect | james@demo.com | demo12345 |
| Architect | yuki@demo.com | demo12345 |
| Architect | amara@demo.com | demo12345 |
| Client | client@demo.com | demo12345 |

## Project Structure

```
archlink/
├── app/
│   ├── (auth)/
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── api/
│   │   ├── auth/          # NextAuth + register endpoint
│   │   ├── architects/    # Profile, portfolio APIs
│   │   ├── clients/       # Client profile API
│   │   ├── messages/      # Messaging API
│   │   └── reviews/       # Reviews API
│   ├── architects/
│   │   ├── page.tsx       # Browse architects
│   │   └── [id]/page.tsx  # Architect profile
│   ├── dashboard/         # User dashboard
│   ├── messages/          # Messaging UI
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/
│       ├── ArchitectCard.tsx
│       ├── ArchitectDashboard.tsx
│       ├── ClientDashboard.tsx
│       ├── ContactButton.tsx
│       ├── ReviewForm.tsx
│       ├── SearchFilters.tsx
│       └── StarRating.tsx
├── lib/
│   ├── auth.ts            # NextAuth config
│   └── prisma.ts          # Prisma client
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # Demo data
```

## Deploying to Production

### Database
Switch to PostgreSQL by updating `.env`:
```
DATABASE_URL="postgresql://user:password@host:5432/archlink"
```
Update `prisma/schema.prisma` provider from `sqlite` to `postgresql`.

### Recommended platforms
- **Vercel** (Next.js) + **Supabase** or **Railway** (PostgreSQL)
- Or any Node.js host + managed PostgreSQL

```bash
npm run build
npm start
```

## Extending the App

Ideas for future features:
- File uploads for portfolio images (use Cloudinary or S3)
- Project proposals / quotes system
- Stripe payments for premium architect listings
- Email notifications via Resend or SendGrid
- Advanced search with Algolia
- Video consultations (Daily.co or Whereby)
