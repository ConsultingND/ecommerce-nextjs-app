# OAuth Provider Setup for Production

Quick reference guide for updating OAuth callback URLs after Vercel deployment.

---

## After You Deploy to Vercel

Once your app is deployed, Vercel will give you a URL like:
```
https://your-app-abc123.vercel.app
```

You MUST update your OAuth providers with this production URL.

---

## Google OAuth Setup

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com
- Select your project

### 2. Navigate to Credentials
- Left sidebar → **APIs & Services**
- Click **Credentials**
- Find your OAuth 2.0 Client ID

### 3. Add Production Redirect URI
- Click on your OAuth client ID
- Under **Authorized redirect URIs**, click **+ ADD URI**
- Add your production callback:
  ```
  https://your-app.vercel.app/api/auth/callback/google
  ```
- Click **Save**

### 4. Keep Development URI
Keep your development callback URL too:
```
http://localhost:3000/api/auth/callback/google
```

### Final Google URIs List:
```
http://localhost:3000/api/auth/callback/google          (Development)
https://your-app.vercel.app/api/auth/callback/google    (Production)
```

---

## Azure AD (Microsoft) OAuth Setup

### 1. Go to Azure Portal
- Visit: https://portal.azure.com
- Search for **Microsoft Entra ID** (formerly Azure AD)

### 2. Navigate to App Registrations
- Left sidebar → **App registrations**
- Click on your app

### 3. Add Production Redirect URI
- Left sidebar → **Authentication**
- Under **Platform configurations** → **Web**
- Click **Add URI**
- Add your production callback:
  ```
  https://your-app.vercel.app/api/auth/callback/azure-ad
  ```
- Click **Save**

### 4. Keep Development URI
Keep your development callback URL too:
```
http://localhost:3000/api/auth/callback/azure-ad
```

### Final Azure AD URIs List:
```
http://localhost:3000/api/auth/callback/azure-ad          (Development)
https://your-app.vercel.app/api/auth/callback/azure-ad    (Production)
```

---

## Custom Domain Setup (Optional)

If you add a custom domain later (e.g., `yourdomain.com`):

### Update Google OAuth:
Add:
```
https://yourdomain.com/api/auth/callback/google
```

### Update Azure AD:
Add:
```
https://yourdomain.com/api/auth/callback/azure-ad
```

### Update Vercel Environment Variable:
Update `NEXTAUTH_URL`:
```
NEXTAUTH_URL=https://yourdomain.com
```

Then redeploy!

---

## Testing OAuth After Deployment

### Test Google Login:
1. Visit: `https://your-app.vercel.app/auth/login`
2. Click "Sign in with Google"
3. Should redirect to Google
4. After login, should redirect back to your app
5. Check you're logged in (navbar shows sign out button)

### Test Microsoft Login:
1. Visit: `https://your-app.vercel.app/auth/login`
2. Click "Sign in with Microsoft"
3. Should redirect to Microsoft
4. After login, should redirect back to your app
5. Check you're logged in

---

## Common Errors & Solutions

### Error: "redirect_uri_mismatch"

**Cause**: OAuth provider doesn't recognize your callback URL

**Solution**:
1. Check the error message for the exact URL being used
2. Add that EXACT URL to your OAuth provider settings
3. Ensure no trailing slashes
4. Ensure protocol matches (http vs https)

### Error: "invalid_client"

**Cause**: Client ID or Secret doesn't match

**Solution**:
1. Verify `GOOGLE_CLIENT_ID` / `AZURE_AD_CLIENT_ID` in Vercel
2. Verify `GOOGLE_CLIENT_SECRET` / `AZURE_AD_CLIENT_SECRET` in Vercel
3. Check for typos or extra spaces
4. Regenerate secrets if needed

### Error: "Configuration error"

**Cause**: NextAuth configuration issue

**Solution**:
1. Check `AUTH_SECRET` is set in Vercel
2. Check `NEXTAUTH_URL` matches your deployment URL
3. Redeploy after updating environment variables

---

## Quick Checklist

After deploying to Vercel:

- [ ] Note your Vercel deployment URL
- [ ] Update Google OAuth redirect URI (if using)
- [ ] Update Azure AD redirect URI (if using)
- [ ] Update `NEXTAUTH_URL` environment variable in Vercel
- [ ] Redeploy app (Settings → Redeploy)
- [ ] Test Google login (if using)
- [ ] Test Microsoft login (if using)
- [ ] Test email/password login
- [ ] Test sign out

---

## URLs Reference Template

Fill this out after deployment for your records:

**Deployment URL**: `https://_____________________.vercel.app`

**Google OAuth Redirect URI**:
```
https://_____________________.vercel.app/api/auth/callback/google
```

**Azure AD Redirect URI**:
```
https://_____________________.vercel.app/api/auth/callback/azure-ad
```

**Login Page**:
```
https://_____________________.vercel.app/auth/login
```

---

## Support

- [NextAuth.js OAuth Docs](https://next-auth.js.org/configuration/providers/oauth)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Azure AD Guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/)

---

**Last Updated**: 2025-11-17
