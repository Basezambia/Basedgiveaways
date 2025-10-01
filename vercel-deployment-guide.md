# Vercel Deployment Guide

## Environment Variables Required

Make sure these environment variables are set in your Vercel dashboard:

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection string (for migrations)

### Authentication
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)

### Admin Credentials
- `ADMIN_USERNAME` - Admin username
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password

### Application Settings
- `APP_NAME` - Your app name
- `APP_URL` - Your production URL
- `VERCEL_ENV` - Set to "production"

## Database Setup

1. Create a PostgreSQL database (recommended providers):
   - Vercel Postgres
   - Supabase
   - Neon
   - Railway

2. Run migrations after deployment:
   ```bash
   npx prisma migrate deploy
   ```

3. Seed the database with campaigns:
   ```bash
   node seed-campaigns.js
   ```

## Common Issues

### 500 Internal Server Error
- Check that `DATABASE_URL` is properly set
- Verify database connection string format
- Ensure database is accessible from Vercel

### API Routes Not Working
- Verify all environment variables are set
- Check Vercel function logs for specific errors
- Ensure Prisma client is properly configured

## Debugging Steps

1. Check Vercel function logs in the dashboard
2. Verify environment variables are set correctly
3. Test database connection with a simple query
4. Check that all required dependencies are in package.json