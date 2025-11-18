# Vercel Deployment Guide

Complete guide for deploying your e-commerce Next.js app to Vercel production.

---

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] TypeScript errors fixed (`npm run build` passes)
- [x] No `ignoreBuildErrors` in next.config.ts
- [x] Session-based authentication implemented
- [x] Environment variables properly configured
- [ ] Test app locally one more time

### ✅ Security
- [x] User authentication working (NextAuth)
- [x] Session-based cart (no user IDs in URLs)
- [x] Passwords hashed with bcrypt
- [x] `.env` files in `.gitignore`
- [ ] Production secrets generated (different from dev)

### ✅ Database
- [ ] Production MongoDB cluster created
- [ ] Database user with appropriate permissions
- [ ] IP whitelist configured (allow all: 0.0.0.0/0 for Vercel)
- [ ] Connection string ready

---

## Step 1: Prepare Production Environment Variables

### Required Environment Variables

Create these in Vercel (we'll add them in Step 3):

#### MongoDB Configuration
```bash
MONGODB_USER=your_production_mongodb_username
MONGODB_PASSWORD=your_production_mongodb_password
```

#### NextAuth Configuration
```bash
# Generate a NEW secret for production (NEVER use dev secret)
# Run: openssl rand -base64 32
AUTH_SECRET=your_production_auth_secret_here

# Will be auto-set by Vercel, but you can override
NEXTAUTH_URL=https://your-app.vercel.app
```

#### Google OAuth (Optional - if using Google login)
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Azure AD OAuth (Optional - if using Microsoft login)
```bash
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_azure_tenant_id
```

---

## Step 2: Prepare MongoDB Atlas for Production

### 2.1 Create Production Database

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a **new cluster** for production (or use existing)
3. **Important**: Use a DIFFERENT cluster/database than development

### 2.2 Create Database User

1. Click **Database Access** in left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and strong password
5. Set privileges: **Built-in Role** → **Read and write to any database**
6. Click **Add User**

### 2.3 Configure Network Access for Vercel

**Important**: Vercel uses dynamic IPs, so you need to allow all IPs:

1. Click **Network Access** in left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere**
4. Enter `0.0.0.0/0` (this allows all IPs)
5. Comment: "Vercel Production"
6. Click **Confirm**

> ⚠️ **Security Note**: This is safe because MongoDB still requires username/password authentication.

### 2.4 Get Connection String

1. Click **Database** in left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. It should look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   ```

6. Save the username and password separately - you'll need them for Vercel environment variables

---

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI (Optional but recommended)

```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard (Recommended for first deployment)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin feature/login_page
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "Add New Project"**

4. **Import your Git repository**
   - Connect GitHub account if needed
   - Select your repository
   - Click **Import**

5. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

6. **Add Environment Variables**

   Click **Environment Variables** section and add:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `MONGODB_USER` | your_prod_username | Production |
   | `MONGODB_PASSWORD` | your_prod_password | Production |
   | `AUTH_SECRET` | your_generated_secret | Production, Preview |
   | `NEXTAUTH_URL` | https://your-app.vercel.app | Production |
   | `GOOGLE_CLIENT_ID` | your_google_id | Production, Preview |
   | `GOOGLE_CLIENT_SECRET` | your_google_secret | Production, Preview |
   | `AZURE_AD_CLIENT_ID` | your_azure_id | Production, Preview |
   | `AZURE_AD_CLIENT_SECRET` | your_azure_secret | Production, Preview |
   | `AZURE_AD_TENANT_ID` | your_azure_tenant | Production, Preview |

   > **Note**: Only add OAuth variables if you're using those login methods

7. **Click "Deploy"**

   Vercel will:
   - Clone your repository
   - Install dependencies
   - Run `npm run build`
   - Deploy to production

8. **Wait for deployment** (usually 1-3 minutes)

---

## Step 4: Configure OAuth Callback URLs

Once deployed, you need to update OAuth provider settings with your production URL.

### 4.1 Google OAuth Callback

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Click **Save**

### 4.2 Azure AD Callback

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** → **App registrations**
3. Select your app
4. Click **Authentication** in left sidebar
5. Under **Redirect URIs**, add:
   ```
   https://your-app.vercel.app/api/auth/callback/azure-ad
   ```
6. Click **Save**

---

## Step 5: Update NEXTAUTH_URL

After deployment, Vercel will give you a URL like `https://your-app-abc123.vercel.app`

### Update in Vercel:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Find `NEXTAUTH_URL`
4. Update the value to your actual Vercel URL
5. Click **Save**
6. **Redeploy** the project for changes to take effect

---

## Step 6: Verify Deployment

### 6.1 Check Build Logs

1. In Vercel Dashboard, click on your deployment
2. Click **Deployment** tab
3. Review build logs for any errors

### 6.2 Test Your App

Visit your production URL and test:

- ✅ Homepage loads
- ✅ Products page displays
- ✅ Sign up works (create a test account)
- ✅ Sign in works (email/password)
- ✅ Google login works (if enabled)
- ✅ Microsoft login works (if enabled)
- ✅ Add to cart works
- ✅ View cart works
- ✅ Remove from cart works
- ✅ Sign out works

### 6.3 Check for Issues

Common issues to verify:

- [ ] No CORS errors in browser console
- [ ] No authentication errors
- [ ] No database connection errors
- [ ] Images load correctly
- [ ] All API routes respond correctly

---

## Step 7: Set Up Custom Domain (Optional)

### 7.1 Add Domain in Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Enter your domain name
4. Click **Add**

### 7.2 Configure DNS

Vercel will show you DNS records to add. Add these in your domain registrar:

**For root domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 7.3 Update OAuth Callbacks

After adding custom domain, update OAuth redirect URIs:

- Google: Add `https://yourdomain.com/api/auth/callback/google`
- Azure AD: Add `https://yourdomain.com/api/auth/callback/azure-ad`

### 7.4 Update NEXTAUTH_URL

Update environment variable to your custom domain:
```bash
NEXTAUTH_URL=https://yourdomain.com
```

Then redeploy.

---

## Alternative: Deploy via Vercel CLI

If you prefer command line:

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to add environment variables
```

---

## Environment Variables Quick Reference

### Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

### Verify Environment Variables are Set

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Ensure all required variables are present
3. Click **Redeploy** if you added/changed any

---

## Troubleshooting

### Build Fails

**Error**: `Type error: ...`
- **Fix**: Run `npm run build` locally first
- Ensure all TypeScript errors are fixed
- Check build logs in Vercel for specific errors

**Error**: `Module not found`
- **Fix**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Authentication Issues

**Error**: `[auth][error] Configuration`
- **Fix**: Check `AUTH_SECRET` is set in environment variables
- Ensure `NEXTAUTH_URL` matches your deployment URL

**Error**: `Redirect URI mismatch`
- **Fix**: Add production URL to OAuth provider settings
- Use exact URL: `https://your-app.vercel.app/api/auth/callback/google`

### Database Connection Issues

**Error**: `Failed to connect to MongoDB`
- **Fix**: Verify `MONGODB_USER` and `MONGODB_PASSWORD` are correct
- Check Network Access in MongoDB Atlas (allow 0.0.0.0/0)
- Test connection string locally

**Error**: `Authentication failed`
- **Fix**: Create new database user with correct permissions
- Ensure password doesn't contain special characters that need URL encoding

### NEXTAUTH_URL Issues

**Error**: Sign in redirects to wrong URL
- **Fix**: Update `NEXTAUTH_URL` to match your actual deployment URL
- Redeploy after changing environment variables

---

## Post-Deployment Checklist

### ✅ Security
- [ ] Different `AUTH_SECRET` for production (not same as dev)
- [ ] OAuth secrets are kept secure
- [ ] MongoDB Network Access configured correctly
- [ ] SSL/HTTPS enabled (automatic with Vercel)

### ✅ Monitoring
- [ ] Set up Vercel Analytics (optional)
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Monitor MongoDB performance
- [ ] Set up uptime monitoring

### ✅ Performance
- [ ] Images optimized (Next.js Image component)
- [ ] Enable caching where appropriate
- [ ] Monitor Vercel function execution times

### ✅ Maintenance
- [ ] Document deployment process for team
- [ ] Set up automated deployments (merge to main = deploy)
- [ ] Create staging environment (optional)
- [ ] Regular database backups

---

## Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to your repository:

**Production deployments:**
- Push to `main` or `master` branch
- Uses Production environment variables

**Preview deployments:**
- Push to any other branch (e.g., `feature/login_page`)
- Uses Preview environment variables
- Great for testing before merging

### Manual Redeploy

To redeploy without code changes:

1. Go to Vercel Dashboard
2. Click **Deployments** tab
3. Click ⋮ menu on latest deployment
4. Click **Redeploy**

Useful when you update environment variables.

---

## Cost Considerations

### Vercel Pricing
- **Hobby Plan**: Free
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Custom domains
  - Perfect for personal projects

- **Pro Plan**: $20/month
  - 1 TB bandwidth
  - Team collaboration
  - Advanced analytics
  - Recommended for production apps

### MongoDB Atlas Pricing
- **M0 (Free Tier)**
  - 512 MB storage
  - Shared RAM
  - Good for development/small apps

- **M10 (Production)**: ~$57/month
  - 10 GB storage
  - 2 GB RAM
  - Auto-scaling
  - Recommended for production

---

## Rollback Strategy

### Rollback to Previous Deployment

If something goes wrong:

1. Go to **Deployments** tab in Vercel
2. Find the last working deployment
3. Click ⋮ menu
4. Click **Promote to Production**

Instantly rollback to previous version!

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files to git
- ✅ Use different secrets for dev/staging/prod
- ✅ Rotate secrets every 90 days
- ✅ Use Vercel's encrypted storage

### 2. Database Security
- ✅ Use strong passwords (20+ characters)
- ✅ Limit database user permissions
- ✅ Enable MongoDB Atlas encryption at rest
- ✅ Regular backups

### 3. Authentication
- ✅ HTTPS only (enforced by Vercel)
- ✅ Secure session cookies
- ✅ Password hashing with bcrypt
- ✅ Session expiration configured

### 4. API Security
- ✅ Rate limiting (consider Vercel Edge Config)
- ✅ Input validation on all endpoints
- ✅ Authentication checks on protected routes
- ✅ CORS configuration

---

## Monitoring & Logging

### Vercel Logs

View logs in real-time:
1. Go to your project
2. Click **Deployments**
3. Click on a deployment
4. Click **Functions** tab to see serverless function logs

### MongoDB Monitoring

1. Go to MongoDB Atlas
2. Click **Metrics** tab
3. Monitor:
   - Connection count
   - Query performance
   - Storage usage
   - Network traffic

---

## Next Steps After Deployment

1. **Test thoroughly** - Use your production app extensively
2. **Monitor errors** - Check Vercel logs for issues
3. **Set up analytics** - Track user behavior
4. **Create documentation** - Document your deployment process
5. **Plan for scale** - Monitor usage and upgrade plans as needed
6. **Implement CI/CD** - Automate testing before deployment
7. **Add monitoring** - Uptime monitoring and error tracking

---

## Quick Deploy Commands

```bash
# Build and test locally first
npm run build
npm start

# If using Vercel CLI
vercel --prod

# Or commit and push to trigger auto-deploy
git add .
git commit -m "Deploy to production"
git push origin main
```

---

## Support & Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

### Getting Help
- [Vercel Discord](https://vercel.com/discord)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)
- [MongoDB Community](https://www.mongodb.com/community/forums/)

---

## Checklist: Ready to Deploy?

- [ ] All TypeScript errors fixed
- [ ] Build passes locally (`npm run build`)
- [ ] Production MongoDB cluster created
- [ ] MongoDB Network Access allows 0.0.0.0/0
- [ ] Production `AUTH_SECRET` generated
- [ ] All environment variables documented
- [ ] OAuth providers configured (if using)
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Ready to click "Deploy"!

---

**Last Updated**: 2025-11-17
**Status**: Ready for deployment
**Estimated Deployment Time**: 15-30 minutes

Good luck with your deployment! 🚀
