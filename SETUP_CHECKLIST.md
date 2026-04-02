# Blog Web Application - Setup Checklist

Use this checklist to track your setup progress. Print this page or keep it open in a separate window.

---

## Pre-Installation Checklist

### Software Installation
- [ ] Java 17+ installed
  - [ ] Verified with: `java -version`
  - [ ] Version: ________________

- [ ] Maven 3.6+ installed
  - [ ] Verified with: `mvn -version`
  - [ ] Version: ________________

- [ ] Node.js 16+ installed
  - [ ] Verified with: `node -v`
  - [ ] Version: ________________

- [ ] npm installed (comes with Node.js)
  - [ ] Verified with: `npm -v`
  - [ ] Version: ________________

- [ ] MySQL 8.0+ installed
  - [ ] Verified with: `mysql --version`
  - [ ] Version: ________________

---

## Database Setup

### MySQL Configuration
- [ ] MySQL service is running
- [ ] Successfully logged in with: `mysql -u root -p`
- [ ] Root password known and documented
- [ ] Created `blog_db` database
- [ ] Verified database exists with: `SHOW DATABASES;`

### Application Configuration
- [ ] Opened `backend/src/main/resources/application.properties`
- [ ] Updated `spring.datasource.username` (default: root)
- [ ] Updated `spring.datasource.password` with actual password
- [ ] Saved changes

**MySQL Credentials:**
- Username: ________________
- Password: ________________ (keep secure!)
- Database: blog_db
- Port: 3306

---

## Backend Setup

### Initial Setup
- [ ] Navigated to backend directory: `cd backend`
- [ ] (Optional) Built project: `mvn clean install`
- [ ] Build succeeded without errors

### Running Backend
- [ ] Started backend with: `mvn spring-boot:run`
- [ ] Saw "Started BlogBackendApplication" message
- [ ] No red ERROR messages in console
- [ ] Backend running on port 8080
- [ ] Kept terminal window open

### Verification
- [ ] Can access: http://localhost:8080
- [ ] Can access: http://localhost:8080/api/blogs
- [ ] Tables created automatically (users, blogs, reviews)

**Backend Status:** 
- [ ] ✅ Running
- [ ] ❌ Not Running
- [ ] ⚠️ Errors (note below)

**Notes:** ________________________________

---

## Frontend Setup

### Initial Setup
- [ ] Opened NEW terminal window
- [ ] Navigated to frontend directory: `cd frontend`
- [ ] Installed dependencies: `npm install`
- [ ] Installation completed without errors

### Running Frontend
- [ ] Started frontend with: `npm start`
- [ ] Compilation succeeded
- [ ] Browser opened automatically
- [ ] Application loaded at http://localhost:3000
- [ ] Kept terminal window open

### Verification
- [ ] Homepage visible
- [ ] Navigation bar displays correctly
- [ ] Login/Register buttons visible
- [ ] No errors in browser console (F12 → Console)
- [ ] Can navigate between pages

**Frontend Status:**
- [ ] ✅ Running
- [ ] ❌ Not Running
- [ ] ⚠️ Errors (note below)

**Notes:** ________________________________

---

## User Account Setup

### Test User Account
- [ ] Clicked "Register" on homepage
- [ ] Filled registration form:
  - Username: ________________
  - Email: ________________
  - Password: ________________
- [ ] Successfully registered
- [ ] Successfully logged in
- [ ] Can see user dashboard

### Admin Account Creation

**Method 1: Promote Existing User**
- [ ] Logged into MySQL: `mysql -u root -p`
- [ ] Switched to blog_db: `USE blog_db;`
- [ ] Found user ID: `SELECT id, email, role FROM users;`
- [ ] Promoted user to admin with UPDATE query
- [ ] Verified: `SELECT * FROM users WHERE role = 'ADMIN';`
- [ ] Logged out and back in on web app
- [ ] Can access Admin Dashboard

**Method 2: Direct Insert**
- [ ] Logged into MySQL: `mysql -u root -p`
- [ ] Ran INSERT query for admin user
- [ ] Verified admin exists
- [ ] Logged in with: admin@blogapp.com / admin123
- [ ] Can access Admin Dashboard

**Admin Credentials:**
- Email: ________________
- Password: ________________

---

## Functional Testing

### Basic Functionality
- [ ] Can register new users
- [ ] Can login with correct credentials
- [ ] Can logout
- [ ] Can view homepage
- [ ] Can view blog list (may be empty)

### Reader Role Tests
- [ ] Login as Reader
- [ ] Can browse published blogs
- [ ] Can view individual blog posts
- [ ] Can add review to a blog (if blogs exist)
- [ ] Can edit own reviews
- [ ] Can delete own reviews

### Author Role Tests
- [ ] Login as Author (or request author access)
- [ ] Can access Author Dashboard
- [ ] Can create new blog post
- [ ] Can save as DRAFT
- [ ] Can submit for approval (PENDING)
- [ ] Can edit own DRAFT blogs
- [ ] Can view own blogs list

### Admin Role Tests
- [ ] Login as Admin
- [ ] Can access Admin Dashboard
- [ ] Can see all users list
- [ ] Can see pending author requests
- [ ] Can approve/reject author requests
- [ ] Can see pending blogs
- [ ] Can approve/reject blogs
- [ ] Can manage users (view, change roles, delete)

---

## Technical Verification

### Backend Health Check
- [ ] Backend console shows no errors
- [ ] Can see SQL queries in logs (if show-sql=true)
- [ ] Database connections working
- [ ] JWT token generation working
- [ ] API endpoints responding

### Frontend Health Check
- [ ] No console errors (check with F12)
- [ ] API calls succeeding (check Network tab)
- [ ] Authentication working (token stored)
- [ ] Routing working (can navigate pages)
- [ ] UI components rendering correctly

### Database Health Check
- [ ] Can connect to MySQL
- [ ] Database `blog_db` exists
- [ ] Tables created: users, blogs, reviews
- [ ] Can query tables: `SELECT * FROM users;`
- [ ] Foreign keys configured correctly
- [ ] Data persisting correctly

---

## Performance Check

- [ ] Homepage loads in < 2 seconds
- [ ] Login completes in < 1 second
- [ ] Blog list loads in < 2 seconds
- [ ] No lag when typing in forms
- [ ] No memory leaks (check browser memory)
- [ ] Backend using reasonable memory (check with `top`)

---

## Security Verification

- [ ] Passwords are hashed (not plain text in database)
- [ ] JWT tokens required for protected routes
- [ ] Cannot access admin routes without admin role
- [ ] Cannot access author routes without author role
- [ ] Cannot edit other users' content
- [ ] CORS configured correctly

---

## Development Environment

### Terminal Windows Open
- [ ] Terminal 1: Backend running (`mvn spring-boot:run`)
- [ ] Terminal 2: Frontend running (`npm start`)
- [ ] Terminal 3: Available for MySQL/commands

### Services Running
- [ ] MySQL service: ⬜ Running
- [ ] Backend server: ⬜ Running on 8080
- [ ] Frontend dev server: ⬜ Running on 3000

### Browser Setup
- [ ] Application open: http://localhost:3000
- [ ] Developer tools open (F12)
- [ ] Console tab visible for debugging
- [ ] Network tab for monitoring API calls

---

## Documentation Review

- [ ] Read QUICK_START.md
- [ ] Read SETUP_GUIDE.md (or bookmarked for reference)
- [ ] Read DATABASE_SCHEMA.md (or bookmarked)
- [ ] Understand project structure from README.md
- [ ] Bookmarked DOCUMENTATION.md for future reference

---

## Troubleshooting Reference

**If Backend Won't Start:**
- [ ] Checked MySQL is running
- [ ] Verified database credentials
- [ ] Checked port 8080 is available
- [ ] Reviewed SETUP_GUIDE.md troubleshooting

**If Frontend Won't Start:**
- [ ] Checked node_modules installed
- [ ] Verified port 3000 is available
- [ ] Cleared cache and reinstalled
- [ ] Reviewed SETUP_GUIDE.md troubleshooting

**If Database Connection Fails:**
- [ ] MySQL service running
- [ ] Credentials correct
- [ ] Database exists
- [ ] Reviewed DATABASE_SCHEMA.md

---

## Final Verification

### System Status
- [ ] All services running
- [ ] Can register users
- [ ] Can login/logout
- [ ] Can create content (as Author)
- [ ] Can manage content (as Admin)
- [ ] Can review content (as Reader)

### Ready for Development
- [ ] Environment fully configured
- [ ] Sample data created (optional)
- [ ] Admin account available
- [ ] All roles tested
- [ ] Documentation accessible
- [ ] IDE/editor configured

---

## Next Steps

After completing this checklist:

- [ ] Explore the codebase structure
- [ ] Review entity classes (User, Blog, Review)
- [ ] Understand API endpoints
- [ ] Review security configuration
- [ ] Start developing new features
- [ ] Set up version control (if not already)

---

## Setup Completion

**Setup Date:** _______________

**Setup Duration:** ___________ minutes

**Setup Completed By:** _______________

**Issues Encountered:** 
_________________________________________
_________________________________________
_________________________________________

**Solutions Applied:**
_________________________________________
_________________________________________
_________________________________________

---

## Quick Reference

**Ports:**
- MySQL: 3306
- Backend: 8080
- Frontend: 3000

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

**Start Commands:**
```bash
# Backend (Terminal 1)
cd backend && mvn spring-boot:run

# Frontend (Terminal 2)
cd frontend && npm start
```

**Stop Commands:**
```bash
# Both terminals: Ctrl + C
```

---

**✅ Setup Complete!**

Once all items are checked, your Blog Web Application is fully configured and ready for development or use.

For any issues, refer to:
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed troubleshooting
- **[QUICK_START.md](./QUICK_START.md)** - Quick fixes
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentation index

---

**Version:** 1.0  
**Last Updated:** November 2025

