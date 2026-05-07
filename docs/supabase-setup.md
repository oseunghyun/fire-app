# Supabase Setup

This app keeps raw financial amounts on device. Supabase stores only account data and share-safe metrics for crew/ranking features.

## 1. Create Project

Create a Supabase project, then copy:

- Project URL
- anon public key

Create `.env` from `.env.example`:

```sh
cp .env.example .env
```

```sh
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Create Tables

Run [supabase/schema.sql](../supabase/schema.sql) in the Supabase SQL editor.

The schema includes:

- `profiles`
- `households`
- `monthly_snapshots`
- `crews`
- `crew_members`
- RLS policies

## 3. Auth Providers

Email magic link works first.

For production, add these later:

- Apple sign in for iOS App Store release
- Google sign in for Android and optional iOS
- `fireapp://auth/callback` as a redirect URL

## 4. Privacy Rule

Do not upload raw income, expense, or asset amounts.

Server-safe monthly snapshot payload:

```ts
{
  savings_rate: 43,
  achievement_rate: 48,
  fire_distance_months: 136,
  target_year: 2037
}
```
