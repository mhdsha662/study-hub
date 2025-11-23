# Vercel Deployment Guide - Cambridge Study Hub

## 🚀 Quick Start Deployment

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for Vercel"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables** (CRITICAL)
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL = [Get from Vercel Postgres - see step 4]
   NEXTAUTH_SECRET = [Generate with: openssl rand -base64 32]
   NEXTAUTH_URL = https://your-app-name.vercel.app
   ```

4. **Set Up Database**
   - In Vercel dashboard, go to "Storage"
   - Click "Create Database"  
   - Select "Postgres"
   - Choose "Free" plan
   - Copy the `DATABASE_URL` connection string
   - Paste it in Environment Variables (step 3)

5. **Deploy!**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app will be live! 🎉

---

### Option 2: Deploy via Vercel CLI (Faster for developers)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Create Postgres Database**
   ```bash
   vercel postgres create
   ```
   - Vercel will give you a `DATABASE_URL`
   - Copy it for next step

5. **Set Environment Variables**
   ```bash
   # Set DATABASE_URL
   vercel env add DATABASE_URL
   # Paste the Postgres URL when prompted
   
   # Generate and set NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   # Enter: https://your-project.vercel.app (you'll see this after first deploy)
   
   # Set NEXTAUTH_SECRET
   vercel env add NEXTAUTH_SECRET
   # Generate with: openssl rand -base64 32
   # Paste the generated secret
   ```

6. **Deploy**
   ```bash
   vercel --prod
   ```

7. **Run Database Migrations**
   ```bash
   # After first deploy, run migrations
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

---

## ⚠️ IMPORTANT: File Uploads

**Current Limitation**: File uploads save to `public/uploads/` which **won't persist** on Vercel's serverless environment.

### Solutions:

#### Option A: Vercel Blob Storage (Recommended - Easy)
```bash
# Install Vercel Blob
npm install @vercel/blob

# Enable in Vercel dashboard:
# Storage → Create Blob Store
```

Then update `src/app/api/upload/route.ts` to use Vercel Blob instead of local file system.

#### Option B: Cloudflare R2 (Cheapest - Free 10GB)
- Sign up at cloudflare.com
- Create R2 bucket
- Use `@aws-sdk/client-s3` (R2 is S3-compatible)

#### Option C: For Now - Deploy Without Uploads
- The app will work for browsing existing content
- Uploads will fail gracefully
- Add cloud storage later

---

## 📋 Pre-Deployment Checklist

```
✅ Prisma schema updated to PostgreSQL
✅ Environment variables template created (env.example)
✅ Build passes locally (npm run build)
✅ Code pushed to GitHub
⏳ Vercel Postgres database created
⏳ Environment variables set in Vercel
⏳ First deployment successful
⏳ Database migrated
```

---

## 🔧 Post-Deployment Steps

### 1. Run Database Migrations
```bash
# Pull environment variables
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Optional: Seed database
npx prisma db seed
```

### 2. Create First Admin User
You'll need to create an admin account manually in the database:

```sql
-- Go to Vercel Postgres → Query tab
INSERT INTO users (id, email, name, password, role, "hasBookAccess", "isActive")
VALUES (
  'admin-001',
  'admin@study-hub.com', 
  'Admin',
  -- Password hash for "admin123" (change this!)
  '$2a$10$YOUR_BCRYPT_HASH_HERE',
  'ADMIN',
  true,
  true
);
```

To generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

### 3. Test Your Deployment
- ✅ Visit your Vercel URL
- ✅ Sign in with admin account
- ✅ Try browsing (should work)
- ✅ Try downloading (should work if files exist)
- ⚠️ Upload will fail until you add cloud storage

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Locally test the build
npm run build

# Check for errors
# Fix any TypeScript/lint errors
```

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check Postgres database is running
- Verify SSL mode: `?sslmode=require`

### "Module not found" errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reinstall dependencies
npm install

# Clear cache and rebuild
rm -rf .next
npm run build
```

### File Upload Not Working
- This is expected! See "File Uploads" section above
- Implement Vercel Blob or Cloudflare R2

---

## 🎯 Next Steps After Deployment

1. **Add Cloud Storage**
   - Implement Vercel Blob for uploaded files
   - Update upload API route

2. **Set Up Custom Domain** (Optional)
   - Vercel Dashboard → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` environment variable

3. **Monitor Your App**
   - Vercel provides automatic monitoring
   - Check Analytics tab for usage stats

4. **Create Initial Content**
   - Sign in as admin
   - Upload subjects
   - Upload resources

---

## 💡 Tips

1. **Free Tier Limits (Vercel)**
   - 100GB bandwidth/month
   - Serverless function timeout: 10s (Hobby), 60s (Pro)
   - Should be fine for moderate traffic

2. **Database Backups**
   - Vercel Postgres has automatic backups (Pro plan)
   - For Hobby: Export regularly via `pg_dump`

3. **Environment Variables**
   - Use different values for preview/production
   - Vercel supports environment-specific variables

---

## 📚 Useful Commands

```bash
# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Rollback to previous deployment
vercel rollback

# View current deployment
vercel

# Open project in browser
vercel open
```

---

## 🎉 You're Done!

Your Cambridge Study Hub is now live on Vercel!

**Share your URL**: `https://your-app.vercel.app`

For questions, check:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
