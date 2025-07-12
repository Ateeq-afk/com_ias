# OAuth Setup Guide

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Community IAS
   - User support email: your-email@domain.com
   - Developer contact: your-email@domain.com
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Community IAS Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://your-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)

### 2. Update Environment Variables

Add to `.env.local`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 3. Test Google Sign In

1. Start the development server: `npm run dev`
2. Navigate to `/auth/signin`
3. Click "Continue with Google"
4. Complete the OAuth flow

## Additional OAuth Providers (Optional)

### GitHub OAuth
```env
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
```

### Facebook OAuth
```env
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch**
   - Ensure the redirect URI in Google Console matches exactly
   - Include the full path: `/api/auth/callback/google`

2. **Invalid client**
   - Double-check CLIENT_ID and CLIENT_SECRET
   - Ensure no extra spaces in .env.local

3. **Scope errors**
   - Default scopes (email, profile) are usually sufficient
   - Add additional scopes in provider configuration if needed

### Production Deployment

1. Update Google Console with production URLs
2. Set environment variables in your hosting platform
3. Ensure NEXTAUTH_URL is set correctly:
   ```env
   NEXTAUTH_URL=https://your-domain.com
   ```

## Security Best Practices

1. Never commit OAuth credentials to version control
2. Use different credentials for development and production
3. Regularly rotate secrets
4. Implement proper session management
5. Use HTTPS in production