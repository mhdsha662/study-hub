# Cambridge Study Hub - Deployment Guide

This guide will help you deploy the Cambridge Study Hub to Vercel with Supabase as the database.

## Prerequisites

1. GitHub account
2. Vercel account (connected to GitHub)
3. Supabase account

## Step 1: Set Up Supabase

### Create a new Supabase project
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Note your project URL and database password

### Get Database Connection String
From your Supabase project dashboard:
1. Go to Settings → Database
2. Find the "Connection string" section
3. Copy the URI string and replace `[YOUR-PASSWORD]` with your actual database password

Your connection string should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres?sslmode=require
```

### Set up Storage (Optional)
1. Go to Storage section in Supabase dashboard
2. Create a new bucket named "resources"
3. Set it to private (for security)

### Get Supabase Keys
1. Go to Settings → API
2. Copy the Project URL (public)
3. Copy the service_role key (private)
4. Copy the anon key (public)

## Step 2: Set Up Vercel

### Connect to GitHub
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Import your repository

### Configure Environment Variables
In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres?sslmode=require

# NextAuth
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-a-strong-secret-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Generate NextAuth Secret
Run this command to generate a strong secret:
```bash
openssl rand -base64 32
```

## Step 3: Deploy to Vercel

### First Deployment
1. Push your code to GitHub
2. Vercel will automatically detect and deploy your project
3. Wait for the build to complete

### Run Database Migrations
After deployment, you need to set up your database:

1. Install Prisma CLI locally:
```bash
npm install -g prisma
```

2. Set up your local environment:
```bash
cp .env.example .env
# Add your DATABASE_URL from Supabase
```

3. Run migrations:
```bash
prisma migrate dev
```

4. Seed the database:
```bash
npm run db:seed
```

## Step 4: Post-Deployment Setup

### Update NextAuth URL
Make sure your `NEXTAUTH_URL` in Vercel environment variables matches your deployed URL.

### Test the Application
1. Visit your deployed site
2. Try signing up and logging in
3. Test admin panel (use admin@cambridge.com / admin123)
4. Test file uploads

### Set Up Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow the DNS instructions

## Step 5: Maintenance

### Database Management
- Use Prisma Studio to manage your database:
```bash
npx prisma studio
```

### Monitoring
- Check Vercel analytics for performance
- Monitor Supabase dashboard for database usage
- Set up error monitoring (optional)

### Backups
- Supabase automatically handles database backups
- Consider backing up your uploaded files separately

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed
- Check TypeScript errors
- Verify environment variables are set correctly

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure SSL mode is enabled
- Check Supabase project status

### File Upload Issues
- Verify Supabase storage is configured
- Check service role key permissions
- Ensure bucket exists and has correct permissions

### Authentication Issues
- Verify NEXTAUTH_URL matches deployed URL
- Check NEXTAUTH_SECRET is set
- Ensure database migrations ran successfully

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://...` |
| `NEXTAUTH_URL` | Your deployed app URL | Yes | `https://app.vercel.app` |
| `NEXTAUTH_SECRET` | JWT secret key | Yes | `random-string-here` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | `https://project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | Yes | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | Yes | `eyJhbGciOiJIUzI1NiIs...` |

## Security Notes

- Never commit your `.env` file to version control
- Use strong secrets and keys
- Regularly rotate your secrets
- Keep your service role key private
- Enable SSL for all database connections

## Cost Considerations

### Vercel
- Free tier includes:
  - 100GB bandwidth per month
  - Serverless functions
  - Automatic SSL

### Supabase
- Free tier includes:
  - 500MB database
  - 1GB storage
  - 2 million API requests per month
  - 2 concurrent users

Both should be sufficient for a small to medium educational platform.