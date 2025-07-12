# Database Setup Guide

## Option 1: Local PostgreSQL Setup

### macOS
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb community_ias

# Update .env.local
DATABASE_URL="postgresql://localhost/community_ias"
```

### Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb community_ias

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/community_ias"
```

## Option 2: Cloud Database Services (Recommended)

### Supabase (Free Tier Available)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings > Database
4. Update `.env.local`:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Railway (Simple Setup)
1. Go to [railway.app](https://railway.app)
2. Create new project > Deploy PostgreSQL
3. Copy DATABASE_URL from Variables tab
4. Update `.env.local`

### PlanetScale (MySQL Alternative)
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Use Prisma MySQL adapter
4. Update `schema.prisma` provider to "mysql"

## Database Migration

After setting up your database:

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# (Optional) Seed initial data
npm run db:seed
```

## Verify Connection

```bash
# Open Prisma Studio to view database
npx prisma studio
```

## Production Considerations

1. **Connection Pooling**: Use PgBouncer or Prisma Accelerate
2. **Backups**: Set up automated backups
3. **SSL**: Ensure SSL connections in production
4. **Monitoring**: Use tools like pgAdmin or Supabase dashboard