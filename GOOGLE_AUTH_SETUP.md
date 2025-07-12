# 🔐 Google Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication using Firebase/Google Cloud Console.

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console
- Your app running on `http://localhost:3000`

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter project name: `community-ias` (or your preferred name)
   - Click "Create"
   - Wait for the project to be created (usually takes 30 seconds)

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" > "Library"

2. **Search and Enable Google+ API**
   - Search for "Google+ API"
   - Click on it
   - Click "Enable" button
   - Wait for it to enable

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - In the left sidebar, click "APIs & Services" > "Credentials"

2. **Configure Consent Screen** (First time only)
   - Click "Configure Consent Screen"
   - Choose "External" (unless you have a Google Workspace account)
   - Click "Create"
   - Fill in the required fields:
     - **App name**: Community IAS
     - **User support email**: Your email
     - **Developer contact email**: Your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Skip test users (click "Save and Continue")
   - Click "Back to Dashboard"

3. **Create OAuth Client ID**
   - Click "+ Create Credentials" at the top
   - Select "OAuth client ID"
   - Choose application type: "Web application"
   - Name: "Community IAS Web Client"
   
4. **Add Authorized URLs**
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     http://localhost:3001/api/auth/callback/google
     ```
   
   - Click "Create"

5. **Save Your Credentials**
   - A popup will show your credentials
   - Copy the **Client ID** and **Client Secret**
   - Keep these safe!

### Step 4: Update Your Environment Variables

1. **Open your `.env.local` file**

2. **Add/Update these variables**:
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

3. **Save the file**

### Step 5: Update NextAuth Configuration

Your NextAuth configuration is already set up to use Google OAuth! The code in `/app/api/auth/[...nextauth]/route.ts` already includes:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})
```

### Step 6: Test Google Login

1. **Restart your development server**
   ```bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm run dev
   ```

2. **Go to the login page**
   - Visit: http://localhost:3000/auth/signin

3. **Click "Continue with Google"**
   - You should see Google's login screen
   - Sign in with your Google account
   - Grant permissions when asked

4. **Success!**
   - You should be redirected to the dashboard

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### "Error 400: redirect_uri_mismatch"
- **Problem**: The redirect URI doesn't match
- **Solution**: 
  1. Go back to Google Cloud Console
  2. Edit your OAuth client
  3. Make sure the redirect URI exactly matches: `http://localhost:3000/api/auth/callback/google`
  4. Save and wait 5 minutes for changes to propagate

#### "Access blocked: This app's request is invalid"
- **Problem**: Missing required OAuth consent screen info
- **Solution**: 
  1. Go to "OAuth consent screen" in Google Cloud Console
  2. Make sure all required fields are filled
  3. Add your email to test users if in development

#### Google button doesn't appear
- **Problem**: Environment variables not loaded
- **Solution**: 
  1. Make sure `.env.local` has the correct variables
  2. Restart your development server
  3. Check browser console for errors

#### "Invalid client" error
- **Problem**: Wrong client ID or secret
- **Solution**: 
  1. Double-check your credentials in Google Cloud Console
  2. Make sure there are no extra spaces in your `.env.local`
  3. Ensure the values are wrapped in quotes if they contain special characters

---

## 🚀 Production Setup

When deploying to production:

1. **Add production URLs** to your OAuth client:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

2. **Update environment variables** in your hosting platform (Vercel, etc.)

3. **Update NextAuth URL**:
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

---

## 📝 Additional Notes

### Security Best Practices

1. **Never commit** your Google Client Secret to Git
2. **Use environment variables** for all sensitive data
3. **Restrict API access** in production to your domain only
4. **Enable 2FA** on your Google Cloud account

### User Data Access

When users sign in with Google, you'll receive:
- Email address
- Name
- Profile picture URL
- Google ID

This data is automatically saved to your database through the NextAuth adapter.

### Customization Options

You can request additional scopes (permissions) by modifying the provider:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      scope: 'openid email profile',
      // Add more scopes as needed
    }
  }
})
```

---

## ✅ Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 credentials
- [ ] Added localhost URLs to authorized origins/redirects
- [ ] Copied Client ID and Secret to `.env.local`
- [ ] Restarted development server
- [ ] Successfully tested Google login

---

## 🎉 Congratulations!

You've successfully set up Google authentication for your Community IAS platform. Users can now sign in with their Google accounts!

For more advanced configurations, refer to:
- [NextAuth.js Documentation](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)