# Cambridge Study Hub - Complete Setup Guide

This guide will help you set up the Cambridge Study Hub for local development and deployment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone and Install
```bash
git clone https://github.com/your-username/cambridge-study-hub.git
cd cambridge-study-hub
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates SQLite database)
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration Files and Where to Put Credentials

### 1. Environment Variables (`.env` file)

**File**: `/home/z/my-project/.env`

**Current Local Development Setup**:
```bash
# Local Development Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth - Local development
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

**For Production (Vercel + Supabase)**:
```bash
# Database - Get from Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres?sslmode=require"

# NextAuth - Your deployed URL
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="generate-a-strong-secret-key-here"

# Supabase (for file storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 2. Database Configuration

**File**: `/home/z/my-project/prisma/schema.prisma`

**Current Setup**: SQLite for local development
**Production Setup**: PostgreSQL (Supabase)

**To switch to production**:
1. Change `provider = "sqlite"` to `provider = "postgresql"`
2. Update your `DATABASE_URL` in `.env`
3. Run `npm run db:generate`

### 3. NextAuth Configuration

**File**: `/home/z/my-project/src/lib/auth.ts`

**Current Setup**: Credentials provider with bcrypt
**Required**: No changes needed for basic functionality

### 4. Storage Configuration

**File**: `/home/z/my-project/src/lib/storage.ts`

**Current Setup**: Supabase storage with local fallback
**For Production**: 
1. Set up Supabase project
2. Create storage bucket named "resources"
3. Add Supabase credentials to `.env`

### 5. Vercel Configuration

**File**: `/home/z/my-project/vercel.json`

**Current Setup**: Optimized for Vercel deployment
**Required**: Update with your app name and domain

## 📋 Complete File Structure and Changes Needed

### Files You NEED to Configure:

#### 1. `.env` (Environment Variables)
```bash
# REQUIRED FOR LOCAL DEVELOPMENT:
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# REQUIRED FOR PRODUCTION:
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?sslmode=require"
# NEXTAUTH_URL="https://your-app.vercel.app"
# NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
# SUPABASE_SERVICE_ROLE_KEY="your-service-key"
```

#### 2. `prisma/schema.prisma` (Database Schema)
```prisma
# FOR LOCAL DEVELOPMENT (current):
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

# FOR PRODUCTION (change to):
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 3. `next.config.ts` (Next.js Configuration)
```typescript
// CURRENT - Already optimized:
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'], // UPDATE THIS
  },
};

export default nextConfig;
```

#### 4. `vercel.json` (Vercel Configuration)
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXTAUTH_URL": "https://your-app-name.vercel.app", // UPDATE THIS
    "NEXTAUTH_SECRET": "your-super-secret-key-here" // UPDATE THIS
  }
}
```

## 🔑 Step-by-Step Setup Process

### Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with local settings (already done)
   ```

3. **Set Up Database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Production Setup (Vercel + Supabase)

#### Step 1: Set Up Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get database connection string from Settings → Database
4. Create storage bucket named "resources"
5. Get API keys from Settings → API

#### Step 2: Update Local Configuration
1. Update `.env` with Supabase credentials
2. Change `prisma/schema.prisma` to PostgreSQL
3. Update `next.config.ts` with your Supabase domain

#### Step 3: Deploy to Vercel
1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables in Vercel dashboard:
   ```bash
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   ```

#### Step 4: Post-Deployment
1. Run database migrations:
   ```bash
   npm run db:generate
   npm run db:seed
   ```

## 🧪 Testing All Functions

### 1. Authentication Testing
- **Sign Up**: Visit `/auth/signup`
- **Sign In**: Visit `/auth/signin`
- **Admin Access**: Use `admin@cambridge.com` / `admin123`

### 2. User Interface Testing
- **Home Page**: Check navigation and links
- **Past Papers**: `/past-papers` (public access)
- **Books**: `/books` (login required)
- **Admin Panel**: `/admin` (admin only)

### 3. File Upload Testing
- Go to `/admin/upload`
- Test file upload functionality
- Check files are stored correctly

### 4. Database Testing
- Check user creation in database
- Verify resource uploads
- Test admin functions

## 🔍 Troubleshooting Common Issues

### 1. Database Connection Errors
**Error**: `Invalid prisma.user.findUnique() invocation`
**Solution**: 
- Check `DATABASE_URL` in `.env`
- Ensure database schema matches provider
- Run `npm run db:generate`

### 2. NextAuth Issues
**Error**: `[next-auth][warn][NEXTAUTH_URL]`
**Solution**: 
- Set `NEXTAUTH_URL` correctly
- Ensure it matches your deployed URL

### 3. Build Errors
**Error**: `React does not recognize the asChild prop`
**Solution**: 
- Fixed in current version
- Ensure components support `asChild` prop

### 4. File Upload Issues
**Error**: Upload fails
**Solution**: 
- Check Supabase credentials
- Ensure storage bucket exists
- Verify file size limits

### 5. Environment Variables Not Loading
**Solution**: 
- Restart development server after changing `.env`
- Check variable names match exactly
- Verify no syntax errors in `.env`

## 📊 Default Admin Account

After running `npm run db:seed`, you'll have:

**Admin Account**:
- Email: `admin@cambridge.com`
- Password: `admin123`
- Role: ADMIN
- Book Access: Yes

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update all environment variables
- [ ] Change database to PostgreSQL in schema
- [ ] Update NextAuth URL
- [ ] Configure Supabase storage
- [ ] Test all functionality locally
- [ ] Push to GitHub
- [ ] Set up Vercel project
- [ ] Add environment variables in Vercel
- [ ] Deploy and test

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### File Upload
- `POST /api/upload` - Upload resources (admin only)

### Health Check
- `GET /api/health` - Application health

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use strong secrets for production
- Regularly rotate your secrets
- Keep service role keys private
- Enable SSL for database connections

## 💡 Development Tips

1. **Local Development**: Use SQLite for easy setup
2. **Production**: Use Supabase for scalability
3. **Testing**: Test all user flows before deployment
4. **Backups**: Regular backup your database
5. **Monitoring**: Set up error tracking in production

---

This guide should help you get the Cambridge Study Hub running both locally and in production. Let me know if you encounter any issues!