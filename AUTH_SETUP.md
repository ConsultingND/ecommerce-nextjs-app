# Authentication Setup Guide

This guide will help you set up authentication for the e-commerce app with all required credentials.

## 📋 Prerequisites

- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console account (for Google OAuth)
- Azure Portal account (for Microsoft OAuth)

---

## 1️⃣ MongoDB Setup

### Get MongoDB Credentials

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (or use existing one)
3. Click "Connect" → "Drivers"
4. Copy your connection string
5. Extract username and password from the connection string

**Connection String Format:**
```
mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

**Add to `.env`:**
```bash
MONGODB_USER=your_username_here
MONGODB_PASSWORD=your_password_here
```

---

## 2️⃣ NextAuth Secret

### Generate AUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

**Add to `.env`:**
```bash
AUTH_SECRET=generated_secret_here
NEXTAUTH_URL=http://localhost:3000  # Change to your domain in production
```

---

## 3️⃣ Google OAuth Setup

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen if prompted:
   - User Type: **External**
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
6. Select **Application type**: **Web application**
7. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   For production, add:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

**Add to `.env`:**
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## 4️⃣ Microsoft (Azure AD) OAuth Setup

### Create Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** (formerly Azure Active Directory)
3. Click **App registrations** → **New registration**
4. Fill in:
   - **Name**: Your app name
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**:
     - Type: **Web**
     - URL: `http://localhost:3000/api/auth/callback/azure-ad`
5. Click **Register**
6. On the app page, copy the following:
   - **Application (client) ID**
   - **Directory (tenant) ID**
7. Go to **Certificates & secrets** → **Client secrets** → **New client secret**
   - Description: "NextAuth Secret"
   - Expires: Choose duration
8. Click **Add** and copy the **Value** (not the Secret ID)

**Add to `.env`:**
```bash
AZURE_AD_CLIENT_ID=your_azure_client_id_here
AZURE_AD_CLIENT_SECRET=your_azure_client_secret_here
AZURE_AD_TENANT_ID=your_tenant_id_here
```

---

## 5️⃣ Complete `.env` File Example

Create a `.env` file in your project root:

```bash
# MongoDB Configuration
MONGODB_USER=myusername
MONGODB_PASSWORD=mypassword123

# NextAuth Configuration
AUTH_SECRET=Kb8IBA8DUcj8gJRmjAEzRBeDhmq1XscQHBpnXJlGHQk=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz

# Azure AD (Microsoft) OAuth
AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789abc
AZURE_AD_CLIENT_SECRET=abc~123XYZ_secret
AZURE_AD_TENANT_ID=87654321-4321-4321-4321-987654321fed
```

---

## 6️⃣ Testing Authentication

### Create a Test User (Email/Password)

**Using Postman or cURL:**

```bash
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

### Sign In

1. Navigate to: `http://localhost:3000/auth/login`
2. Choose authentication method:
   - **Email/Password**: Use credentials created above
   - **Google**: Click "Sign in with Google"
   - **Microsoft**: Click "Sign in with Microsoft"
3. After successful login, you'll be redirected to `/app`

---

## 7️⃣ Production Checklist

Before deploying to production:

- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Add production redirect URIs in Google Cloud Console
- [ ] Add production redirect URIs in Azure Portal
- [ ] Use production MongoDB cluster (not development)
- [ ] Rotate `AUTH_SECRET` for production
- [ ] Enable IP whitelisting on MongoDB Atlas
- [ ] Set up environment variables in your hosting platform (Vercel, Netlify, etc.)

---

## 🔒 Security Best Practices

1. **Never commit `.env` to git** - Already in `.gitignore`
2. **Use different credentials for dev/staging/production**
3. **Rotate secrets regularly** (every 90 days recommended)
4. **Enable 2FA on all cloud accounts** (Google, Azure, MongoDB)
5. **Monitor OAuth consent screens** for suspicious activity
6. **Use least-privilege database users** in MongoDB

---

## 🆘 Troubleshooting

### "Redirect URI mismatch" error
- Verify redirect URIs exactly match in Google/Azure console
- Check for trailing slashes
- Ensure protocol matches (http vs https)

### "Invalid client" error
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check for extra spaces in `.env` file
- Regenerate client secret if needed

### "Failed to connect to MongoDB"
- Verify MongoDB username/password
- Check IP whitelist in MongoDB Atlas (allow your IP)
- Ensure database user has read/write permissions

### Edge runtime crypto error
- Verify `proxy.ts` has `export const runtime = 'nodejs'`
- Clear `.next` cache: `rm -rf .next`
- Restart dev server

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

---

**Last Updated:** November 2024
