# KAGUJJE Boosting - Complete Setup Guide

## ✅ Current Status
- **Site:** https://boosting.kagujje.com - LIVE
- **Supabase:** Connected ✅
- **Auth Page:** Working ✅
- **Admin:** Protected (redirects to login) ✅

---

## 🔧 Setup Google OAuth

### Step 1: Get Google OAuth Credentials

1. Go to: https://console.cloud.google.com
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   ```
   https://dtejfdquiqogwapjtfar.supabase.co/auth/v1/callback
   ```
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Supabase Auth

1. Go to: https://supabase.com/dashboard/project/dtejfdquiqogwapjtfar/auth/providers
2. Find **Google** in the list
3. Toggle it **ON**
4. Enter your Google **Client ID** and **Client Secret**
5. Click **Save**

### Step 3: Create Admin User

Run this SQL in Supabase SQL Editor:

```sql
-- Create admin user (run after signing up via the website)
-- First, sign up through the website, then run:

UPDATE profiles 
SET role = 'admin', balance = 100000 
WHERE email = 'dicksonkagujje@gmail.com';
```

---

## 🔑 Supabase Credentials (Already Configured)

| Key | Value |
|-----|-------|
| URL | `https://dtejfdquiqogwapjtfar.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (in code as fallback) |

---

## 📦 Add Providers (mrgoviral.com)

Run this SQL in Supabase:

```sql
INSERT INTO providers (name, slug, api_url, api_key, currency, is_active, is_default)
VALUES (
  'MrGoViral',
  'mrgoviral',
  'https://mrgoviral.com/api/v2',
  '3a821b733389666e0857a26011cdbc0c',
  'USD',
  true,
  true
);
```

---

## 🚀 Quick Test Commands

```bash
# Test the site
curl -I https://boosting.kagujje.com

# Check admin redirect
curl -I https://boosting.kagujje.com/admin

# Test services API
curl https://boosting.kagujje.com/api/services
```

---

## 📋 Next Steps

1. [ ] Set up Google OAuth in Supabase
2. [ ] Sign up on the website with Google
3. [ ] Run SQL to make yourself admin
4. [ ] Add mrgoviral.com as provider
5. [ ] Sync services from provider

---

## 🔗 Important Links

- **Site:** https://boosting.kagujje.com
- **GitHub:** https://github.com/kagujje256/kagujje-boosting
- **Supabase Dashboard:** https://supabase.com/dashboard/project/dtejfdquiqogwapjtfar
- **Google Console:** https://console.cloud.google.com
