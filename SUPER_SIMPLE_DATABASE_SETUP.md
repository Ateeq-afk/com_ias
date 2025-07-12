# 🍼 Baby Steps: PostgreSQL Setup Guide

## 🎯 Goal: Get your database running in 10 minutes!

### Step 1: Choose Your Path

**🌟 RECOMMENDED: Supabase (Cloud Database - FREE!)**
- ✅ No installation needed
- ✅ Always works
- ✅ Free tier available
- ✅ Beginner-friendly

**Alternative: Local Database**
- ⚠️ Requires installation
- ⚠️ More technical setup
- ⚠️ Can break if computer restarts

---

## 🚀 Method 1: Supabase (EASIEST)

### Step A: Create Account
1. **Go to**: [supabase.com](https://supabase.com)
2. **Click**: "Start your project" (big green button)
3. **Sign up** with GitHub or Google (it's free!)

### Step B: Create Database
1. **Click**: "New Project" 
2. **Fill in**:
   - Project name: `community-ias`
   - Database password: Make a strong password (WRITE IT DOWN!)
   - Region: Choose your country
3. **Click**: "Create new project"
4. **Wait**: 2-3 minutes (grab a coffee! ☕)

### Step C: Get Your Magic Connection String
1. **Click**: ⚙️ Settings (in left sidebar)
2. **Click**: "Database" 
3. **Scroll down** to "Connection string"
4. **Click**: "URI" tab
5. **Copy** the long text that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefg.supabase.co:5432/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual password!

### Step D: Put It In Your Project
1. **Open**: Your project folder (`com_ias`)
2. **Find**: `.env.local` file
3. **Replace** the DATABASE_URL line with:
   ```
   DATABASE_URL="your-copied-connection-string-here"
   ```
4. **Save** the file

### Step E: Set Up Your Tables
Open your terminal in the project folder and run:
```bash
# Install required tools
npm install tsx @types/bcryptjs

# Create all your database tables
npm run db:push

# Add sample data (admin account, test lessons, etc.)
npm run db:seed
```

### Step F: Test Everything Works
```bash
# Start your app
npm run dev

# In another terminal, open database viewer
npm run db:studio
```

**🎉 SUCCESS!** If you see tables with data, you're done!

---

## 🖥️ Method 2: Local Database (Advanced)

### For Mac Users:
```bash
# Install Homebrew (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start it
brew services start postgresql@15

# Create your database
createdb community_ias

# Update .env.local
DATABASE_URL="postgresql://postgres@localhost:5432/community_ias"
```

### For Windows Users:
1. **Download**: [PostgreSQL Windows Installer](https://www.postgresql.org/download/windows/)
2. **Run installer** (remember the password!)
3. **Open Command Prompt** as Administrator
4. **Navigate to**: `C:\Program Files\PostgreSQL\15\bin`
5. **Run**: `createdb -U postgres community_ias`
6. **Update .env.local**:
   ```
   DATABASE_URL="postgresql://postgres:your-password@localhost:5432/community_ias"
   ```

### For Linux/Ubuntu:
```bash
# Update packages
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb community_ias

# Update .env.local
DATABASE_URL="postgresql://postgres@localhost:5432/community_ias"
```

---

## 🆘 Help! Something Went Wrong!

### "Connection refused" error
- **Supabase**: Check your connection string is copied correctly
- **Local**: Run `brew services start postgresql@15` (Mac) or restart PostgreSQL service

### "Database does not exist" error
- **Supabase**: Your database should auto-exist, check project is created
- **Local**: Run `createdb community_ias` again

### "Authentication failed" error
- **Supabase**: Check your password in the connection string
- **Local**: Try without password first, then add if needed

### npm run commands don't work
```bash
# Try installing dependencies first
npm install

# Then try again
npm run db:push
```

---

## 🎊 What You Get After Setup

### Test Accounts:
- **Admin**: admin@communityias.com (password: admin123)
- **Student**: student@example.com (password: student123)

### Sample Data:
- ✅ 5 subjects (History, Geography, Polity, Economy, Current Affairs)
- ✅ Sample lessons and tests
- ✅ User profiles and notifications

### Database Tables:
- 👥 Users and profiles
- 📚 Subjects, modules, and lessons  
- 📝 Tests and questions
- 💳 Payments and subscriptions
- 🔔 Notifications

---

## 🚀 Next Steps

1. **Start your app**: `npm run dev`
2. **Visit**: http://localhost:3000
3. **Sign in** with test accounts
4. **Explore** the dashboard and lessons!

Need help? The database viewer at `npm run db:studio` lets you see all your data visually!