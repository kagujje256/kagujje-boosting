# KAGUJJE Boosting - Setup Guide

## GitHub Repository
✅ Pushed to: https://github.com/kagujje256/kagujje-boosting

## Step 1: Run Database Schema

**Open Supabase SQL Editor:** https://supabase.com/dashboard/project/dtejfdquiqogwapjtfar/sql

Copy the entire contents of `supabase/schema.sql` and run it.

## Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import the repository: `kagujje256/kagujje-boosting`
3. Set environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://dtejfdquiqogwapjtfar.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZWpmZHF1aXFvZ3dhcGp0ZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MDA4NjcsImV4cCI6MjA1OTk3Njg2N30.s_7FfO6KG5FQbN4p4QcLkT0M6xB1Pa0cIL-6gC6w9pU
   ```
4. Deploy!

## Step 3: Add Custom Domain

In Vercel dashboard:
1. Go to Settings → Domains
2. Add: `boosting.kagujje.com`
3. Copy the CNAME value
4. In Spaceship DNS, add CNAME record:
   - Name: `boosting`
   - Value: (the CNAME from Vercel)

## MarzPay Integration

The payment system is ready to integrate with MarzPay. Add your API credentials in Supabase settings table:

```sql
UPDATE settings SET value = 'YOUR_MARZPAY_API_KEY' WHERE key = 'marzpay_api_key';
UPDATE settings SET value = 'YOUR_MARZPAY_API_SECRET' WHERE key = 'marzpay_api_secret';
```

## Features

✅ **User Features:**
- Social login (Google, GitHub, etc.)
- Browse services by category
- Place orders with quantity calculator
- Track order status
- Add funds via MarzPay
- Referral system
- Support tickets
- API access

✅ **Admin Features:**
- Manage services & categories
- View all orders
- User management
- Announcement system
- Payment tracking

## Next Steps

1. Run the SQL schema in Supabase
2. Deploy to Vercel
3. Add domain `boosting.kagujje.com`
4. Add MarzPay credentials
5. Start adding services!
