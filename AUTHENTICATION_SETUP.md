# Authentication Setup Guide

## Overview
The DCL application now includes user authentication and role-based access control (RBAC) using Supabase.

## Prerequisites
1. A Supabase project
2. Environment variables configured in Replit Secrets:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon/public key

## Database Setup

### Step 1: Create User Profiles Table
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from `supabase_setup.sql`

This will:
- Create the `user_profiles` table
- Set up Row Level Security (RLS) policies
- Create triggers to automatically create user profiles on signup
- Set up proper indexes and permissions

### Step 2: Enable Email Authentication
1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Email provider
3. Configure email templates (optional)

### Step 3: Create Your First Admin User
1. Sign up through the application login page
2. Go to Supabase SQL Editor and run:
```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

## User Roles

### Admin
- Full access to all features
- Can access the Command Center
- Future: Can invite new users

### Viewer
- Read-only access to dashboards
- Can view data connections and ontology mappings
- Cannot access admin-only features

## Protected Routes

All routes except `/login` are protected and require authentication:
- `/dcl` - DCL Dashboard (all users)
- `/ontology` - Ontology Mapping (all users)
- `/uncertain` - Edge Cases (all users)
- `/agents` - Agents (all users)
- `/pipeline` - Pipeline (all users)
- `/command` - Command Center (admin only)
- `/faq` - FAQ (all users)

## Testing Authentication

1. Open the application - you should be redirected to `/login`
2. Sign up with an email and password
3. After signup, you'll be automatically logged in
4. To test admin access, promote your user to admin role using SQL
5. Navigate to different routes to test protection

## Security Notes

- Passwords are handled securely by Supabase Auth
- User roles are stored in a separate `user_profiles` table
- RLS policies ensure users can only access their own data
- The SUPABASE_ANON_KEY is safe to expose in the frontend (it's public)
- Never expose SUPABASE_SERVICE_KEY in frontend code

## Troubleshooting

### "Supabase not initialized" error
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are set in Replit Secrets
- Verify the backend endpoint `/api/supabase-config` is returning the config

### Users stuck on login page
- Check browser console for errors
- Verify Supabase project is active and email auth is enabled
- Check that the user_profiles table exists and has proper RLS policies

### Role not appearing
- Ensure the trigger `handle_new_user()` is created and active
- Check that user_profiles table has a row for the user
- Verify RLS policies allow the user to read their own profile
