# 📋 Supabase SQL Editor Setup Guide

Since we're having connectivity issues, let's set up your database using Supabase's SQL Editor.

## 🚀 Quick Steps

### Step 1: Open SQL Editor
1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query** button

### Step 2: Create Tables
1. Copy ALL content from `database-setup.sql`
2. Paste it into the SQL Editor
3. Click **Run** button (or press Ctrl/Cmd + Enter)
4. Wait for "Success" message

### Step 3: Add Sample Data
1. Click **New query** button again
2. Copy ALL content from `database-seed.sql`
3. Paste it into the SQL Editor
4. Click **Run** button
5. Wait for "Success" message

### Step 4: Verify Tables
1. Go to **Table Editor** in left sidebar
2. You should see these tables:
   - User (2 records)
   - Subject (5 records)
   - Module (4 records)
   - Lesson (4 records)
   - Test (1 record)
   - Question (3 records)
   - And more...

## ✅ Success Checklist
- [ ] All tables created without errors
- [ ] Sample data inserted successfully
- [ ] Can see users in User table
- [ ] Can see subjects in Subject table

## 🎉 Next Steps

Once the database is set up:

1. **Update Prisma to use existing tables:**
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

2. **Start your application:**
   ```bash
   npm run dev
   ```

3. **Test login:**
   - Admin: admin@communityias.com / admin123
   - Student: student@example.com / student123

## 🆘 Troubleshooting

### If you get "type already exists" error:
This means tables were partially created. Run this first:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
Then run the setup SQL again.

### If you get permission errors:
Make sure you're running the SQL as the database owner (usually automatic in Supabase).

## 📝 Important Notes

1. The passwords in the seed data are already hashed
2. All IDs are using UUID format
3. The database includes all relationships and constraints
4. Sample data includes test users, subjects, and lessons

---

**Ready to proceed?** Open your Supabase SQL Editor and let's create the database!