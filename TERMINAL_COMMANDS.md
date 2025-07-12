# 💻 Terminal Commands - Copy & Paste Guide

## 🎯 What you'll do:
1. Set up your database connection
2. Create all the tables
3. Add sample data
4. Test everything works

---

## Step 1: Open Terminal

### On Mac:
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

### On Windows:
- Press `Windows + R`
- Type "cmd"
- Press Enter

### Navigate to your project:
```bash
cd /Users/ateeq/com_ias
```

---

## Step 2: Install Required Tools

Copy and paste this command:
```bash
npm install tsx @types/bcryptjs
```

**What this does**: Installs tools needed to set up your database

---

## Step 3: Set Up Database Tables

Copy and paste this command:
```bash
npm run db:push
```

**What this does**: Creates all the tables in your database (Users, Lessons, Tests, etc.)

**Expected output**:
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public"

🚀  Your database is now in sync with your Prisma schema.
```

---

## Step 4: Add Sample Data

Copy and paste this command:
```bash
npm run db:seed
```

**What this does**: Adds test users, sample lessons, and practice tests

**Expected output**:
```
🌱 Starting database seed...
✅ Created admin user: admin@communityias.com
✅ Created test student: student@example.com
✅ Created subjects
✅ Created Polity module and lessons
✅ Created practice test
✅ Created notifications
🎉 Database seeding completed!
```

---

## Step 5: Test Your Database

Copy and paste this command:
```bash
npm run db:studio
```

**What this does**: Opens a visual database viewer in your browser

**Expected result**: 
- A browser tab opens at `http://localhost:5555`
- You see tables like: User, Subject, Lesson, Test, etc.
- Tables have data in them

---

## Step 6: Start Your App

In a NEW terminal window, run:
```bash
npm run dev
```

**What this does**: Starts your application

**Expected output**:
```
▲ Next.js 13.5.1
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 2.3s
```

---

## Step 7: Test Login

1. **Go to**: http://localhost:3000
2. **Click**: Sign in
3. **Use test accounts**:
   - **Admin**: admin@communityias.com / admin123
   - **Student**: student@example.com / student123

---

## 🆘 Troubleshooting Commands

### If "npm run db:push" fails:
```bash
# Check if Prisma is installed
npx prisma --version

# Try generating client first
npx prisma generate

# Then try push again
npm run db:push
```

### If "npm run db:seed" fails:
```bash
# Check your .env.local file exists
ls -la .env.local

# Run seed directly
npx prisma db seed
```

### If connection fails:
```bash
# Test connection
npx prisma db execute --preview-feature --stdin <<< "SELECT NOW();"
```

### Reset everything:
```bash
# WARNING: This deletes all data!
npx prisma db push --force-reset
npm run db:seed
```

---

## 🎊 Success Checklist

You're done when:
- [ ] `npm run db:push` completes without errors
- [ ] `npm run db:seed` shows success messages
- [ ] `npm run db:studio` opens database viewer
- [ ] You can see data in User, Subject, Lesson tables
- [ ] `npm run dev` starts the app
- [ ] You can log in at http://localhost:3000

**🎉 Congratulations! Your database is ready!**