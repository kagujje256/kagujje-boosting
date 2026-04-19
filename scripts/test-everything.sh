#!/bin/bash

# KAGUJJE Boosting - Complete Setup Script
# This script tests all components and verifies the setup

echo "========================================"
echo "KAGUJJE Boosting - Complete Setup Test"
echo "========================================"
echo ""

# Supabase credentials
SUPABASE_URL="https://dtejfdquiqogwapjtfar.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZWpmZHF1aXFvZ3dhcGp0ZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjY5ODAsImV4cCI6MjA5MjA0Mjk4MH0.ptiq8drt1WuBrKv3OMgf6lo8IiJUFqferwnGGWSJksM"

echo "1. Testing Supabase Connection..."
curl -s "$SUPABASE_URL/rest/v1/profiles?select=count" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Prefer: count=exact" | head -c 200
echo ""
echo ""

echo "2. Testing Auth (Creating/Logging in admin user)..."
# Sign in as kaggu admin
AUTH_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"kaggu@boost.kagujje.com","password":"Knox2026"}')

ACCESS_TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo "$AUTH_RESPONSE" | grep -o '"user":{"id":"[^"]*' | cut -d'"' -f6)

if [ -n "$ACCESS_TOKEN" ]; then
  echo "✅ Admin login successful"
  echo "   User ID: $USER_ID"
else
  echo "❌ Admin login failed"
  echo "$AUTH_RESPONSE"
fi
echo ""

echo "3. Testing Profile Access..."
if [ -n "$ACCESS_TOKEN" ]; then
  curl -s "$SUPABASE_URL/rest/v1/profiles?id=eq.$USER_ID&select=*" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | head -c 500
  echo ""
fi
echo ""

echo "4. Testing Services..."
curl -s "$SUPABASE_URL/rest/v1/services?select=*&limit=5" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" | head -c 500
echo ""
echo ""

echo "5. Testing Categories..."
curl -s "$SUPABASE_URL/rest/v1/categories?select=*&order=display_order" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" | head -c 500
echo ""
echo ""

echo "6. Testing Website..."
curl -sI "https://boosting.kagujje.com" | head -5
echo ""

echo "7. Testing Auth Page..."
curl -sI "https://boosting.kagujje.com/auth" | head -5
echo ""

echo "========================================"
echo "Test Complete!"
echo "========================================"
echo ""
echo "If profile role is not 'admin', run this SQL in Supabase:"
echo ""
echo "UPDATE profiles SET role = 'admin' WHERE id = '$USER_ID';"
echo ""
echo "Or go to: https://supabase.com/dashboard/project/dtejfdquiqogwapjtfar/editor/27894"
