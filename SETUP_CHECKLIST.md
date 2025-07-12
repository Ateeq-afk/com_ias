# ✅ Database Setup Checklist

Print this out or keep it open while you work!

---

## 🎯 Before You Start

- [ ] I have my project folder open: `/Users/ateeq/com_ias`
- [ ] I have terminal/command prompt ready
- [ ] I know which database option I'm choosing:
  - [ ] **Supabase** (recommended for beginners)
  - [ ] **Local PostgreSQL** (for advanced users)

---

## 📋 Setup Steps

### Step 1: Database Connection
- [ ] **Supabase users**: I created my Supabase account
- [ ] **Supabase users**: I copied my connection string
- [ ] **Local users**: I installed PostgreSQL on my computer
- [ ] I updated my `.env.local` file with DATABASE_URL
- [ ] I saved the `.env.local` file

**✋ STOP**: Don't continue until your `.env.local` has the correct DATABASE_URL!

### Step 2: Install Tools
- [ ] I opened terminal in my project folder
- [ ] I ran: `npm install tsx @types/bcryptjs`
- [ ] Command completed without errors

### Step 3: Create Database Tables
- [ ] I ran: `npm run db:push`
- [ ] I saw: "Your database is now in sync with your Prisma schema"
- [ ] No error messages appeared

### Step 4: Add Sample Data
- [ ] I ran: `npm run db:seed`
- [ ] I saw: "🎉 Database seeding completed!"
- [ ] I saw messages about creating admin user, subjects, etc.

### Step 5: Verify Database
- [ ] I ran: `npm run db:studio`
- [ ] Browser opened with database viewer
- [ ] I can see tables: User, Subject, Lesson, Test
- [ ] Tables have data in them (not empty)

### Step 6: Test Application
- [ ] I ran: `npm run dev` (in new terminal)
- [ ] I saw: "Ready in X.Xs"
- [ ] I opened: http://localhost:3000
- [ ] Homepage loads correctly

### Step 7: Test Login
- [ ] I clicked "Sign In" on homepage
- [ ] I tried admin login: admin@communityias.com / admin123
- [ ] Login worked and I see dashboard
- [ ] I tried student login: student@example.com / student123
- [ ] Student login worked too

---

## 🎊 Success Indicators

You're successful when you see:

### In Terminal:
```
✅ Created admin user: admin@communityias.com
✅ Created test student: student@example.com
✅ Created subjects
✅ Created Polity module and lessons
🎉 Database seeding completed!
```

### In Database Viewer:
- User table with 2 users
- Subject table with 5 subjects
- Lesson table with sample lessons
- Test table with practice tests

### In Your App:
- Homepage loads
- Sign in page works
- Dashboard shows after login
- Lesson demo works
- Test page loads

---

## 🆘 When Things Go Wrong

### "Environment variables loaded" but then error:
- [ ] Check your DATABASE_URL in `.env.local`
- [ ] Make sure it starts with `postgresql://`
- [ ] No extra spaces or quotes

### "Connection refused":
- [ ] **Supabase**: Check your project is running
- [ ] **Local**: Start PostgreSQL service
- [ ] Wait 30 seconds and try again

### "npm command not found":
- [ ] Make sure you're in the right folder
- [ ] Run `ls` and check you see `package.json`
- [ ] Try `npm install` first

### Tables exist but no data:
- [ ] Run `npm run db:seed` again
- [ ] Check for error messages
- [ ] Try `npx prisma db seed` directly

---

## 🏁 Final Check

**I am ready to proceed when**:
- [ ] ✅ All steps above are completed
- [ ] ✅ No error messages in terminal
- [ ] ✅ I can log in with test accounts
- [ ] ✅ Database viewer shows data
- [ ] ✅ App runs at http://localhost:3000

**🎉 Congratulations! You've successfully set up PostgreSQL!**

*Next steps: Configure OAuth and payments, then deploy to production!*