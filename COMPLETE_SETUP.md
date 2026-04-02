# Complete Setup Guide - Blog Web Application
## From Zero to Running - Every Single Step

This guide assumes you're starting with a fresh computer. Follow every step in order.

---

## 📋 Table of Contents
1. [Prerequisites Installation](#step-1-install-prerequisites)
2. [MySQL Setup](#step-2-mysql-setup)
3. [Project Download/Clone](#step-3-get-the-project)
4. [Backend Configuration](#step-4-configure-backend)
5. [Backend Startup](#step-5-start-backend)
6. [Frontend Setup](#step-6-setup-frontend)
7. [Frontend Startup](#step-7-start-frontend)
8. [Create Admin User](#step-8-create-admin-user)
9. [Access Application](#step-9-access-application)
10. [Troubleshooting](#troubleshooting)

---

## STEP 1: Install Prerequisites

### 1.1 Install Java 17

**Windows:**
1. Download Amazon Corretto 17: https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html
2. Run the installer (`.msi` file)
3. Follow the wizard, keep default settings
4. Verify installation:
   ```cmd
   java -version
   ```
   Should show: `openjdk version "17.x.x"`

**macOS:**
1. Download Amazon Corretto 17: https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html
2. Run the `.pkg` installer
3. Follow the wizard
4. Verify:
   ```bash
   java -version
   ```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
java -version
```

---

### 1.2 Install Maven

**Windows:**
1. Download Maven: https://maven.apache.org/download.cgi (Binary zip archive)
2. Extract to `C:\Program Files\Apache\maven`
3. Add to PATH:
   - Right-click "This PC" → Properties → Advanced → Environment Variables
   - Under System Variables, find "Path" → Edit → New
   - Add: `C:\Program Files\Apache\maven\bin`
   - Click OK
4. Verify:
   ```cmd
   mvn -version
   ```

**macOS:**
```bash
brew install maven
mvn -version
```

**Linux:**
```bash
sudo apt install maven -y
mvn -version
```

---

### 1.3 Install Node.js

**Windows:**
1. Download Node.js 20 LTS: https://nodejs.org/
2. Run the installer (`.msi`)
3. Check both boxes (npm, PATH)
4. Verify:
   ```cmd
   node -v
   npm -v
   ```

**macOS:**
```bash
brew install node
node -v
npm -v
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

---

### 1.4 Install MySQL 8.0

**Windows:**
1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Choose "MySQL Installer Community"
3. Run installer
4. Select "Developer Default"
5. Click Next through installation
6. **IMPORTANT**: When asked, set root password (remember this!)
7. Complete installation
8. Verify MySQL is running:
   - Open Services (Win + R, type `services.msc`)
   - Find "MySQL80" - should be "Running"

**macOS:**
1. Download MySQL: https://dev.mysql.com/downloads/mysql/
2. Choose macOS version
3. Download DMG file
4. Install the package
5. **IMPORTANT**: Note the temporary root password shown!
6. Start MySQL:
   - Go to System Preferences → MySQL
   - Click "Start MySQL Server"
7. Or via Homebrew:
   ```bash
   brew install mysql
   brew services start mysql
   ```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
```

---

## STEP 2: MySQL Setup

### 2.1 Set/Reset MySQL Root Password

**Windows:**
Open Command Prompt as Administrator:
```cmd
mysql -u root -p
```
Enter the password you set during installation.

**macOS/Linux:**
```bash
mysql -u root -p
```

**If you forgot the password or it doesn't work:**

**Windows:**
```cmd
# Stop MySQL service first
net stop MySQL80

# Start in safe mode
mysqld --skip-grant-tables

# In another command prompt:
mysql -u root
```

**macOS:**
```bash
# Stop MySQL
sudo /usr/local/mysql/support-files/mysql.server stop

# Start safe mode
sudo /usr/local/mysql/bin/mysqld_safe --skip-grant-tables &

# Connect
mysql -u root
```

**Linux:**
```bash
sudo systemctl stop mysql
sudo mysqld_safe --skip-grant-tables &
mysql -u root
```

**Once connected in safe mode, reset password:**
```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123';
FLUSH PRIVILEGES;
EXIT;
```

**Restart MySQL normally:**

Windows: `net start MySQL80`  
macOS: `sudo /usr/local/mysql/support-files/mysql.server start`  
Linux: `sudo systemctl start mysql`

---

### 2.2 Create Database

Connect to MySQL:
```bash
mysql -u root -p
```
Enter password: `admin123` (or whatever you set)

Run these commands:
```sql
CREATE DATABASE blog_db;
SHOW DATABASES;
EXIT;
```

You should see `blog_db` in the list.

---

## STEP 3: Get the Project

### Option A: Download ZIP
1. Download the project ZIP file
2. Extract to a location (e.g., `C:\Projects\BLOG` or `~/Desktop/BLOG`)

### Option B: Git Clone
```bash
git clone <repository-url>
cd BLOG
```

---

## STEP 4: Configure Backend

### 4.1 Update Database Password

Navigate to project:
```bash
cd BLOG/backend/src/main/resources
```

Open `application.properties` in any text editor.

**Find this line:**
```properties
spring.datasource.password=admin123
```

**Change `admin123` to YOUR MySQL root password.**

**Save the file.**

---

### 4.2 Build Backend (Optional but Recommended)

```bash
cd BLOG/backend
mvn clean install
```

Wait for "BUILD SUCCESS"

---

## STEP 5: Start Backend

### 5.1 Open Terminal/Command Prompt

**Windows:** Open Command Prompt or PowerShell  
**macOS/Linux:** Open Terminal

### 5.2 Navigate to Backend

```bash
cd BLOG/backend
```

### 5.3 Start the Server

```bash
mvn spring-boot:run
```

**Wait for this message:**
```
Started BlogBackendApplication in X.XXX seconds
```

**KEEP THIS WINDOW OPEN!**

Backend is now running on: **http://localhost:8081**

### 5.4 Verify Backend is Running

Open browser, go to: **http://localhost:8081**

You should see a message (not an error).

---

## STEP 6: Setup Frontend

### 6.1 Open NEW Terminal/Command Prompt

**IMPORTANT:** Don't close the backend terminal! Open a NEW one.

### 6.2 Navigate to Frontend

```bash
cd BLOG/frontend
```

### 6.3 Install Dependencies

**This will take 3-5 minutes:**

```bash
npm install
```

Wait for "added XXX packages" message.

### 6.4 Install TailwindCSS PostCSS Plugin

```bash
npm install @tailwindcss/postcss --save-dev
```

---

## STEP 7: Start Frontend

### 7.1 Start Development Server

```bash
npm start
```

### 7.2 Wait for Browser

Browser should open automatically to: **http://localhost:3000**

If not, manually open: **http://localhost:3000**

---

## STEP 8: Create Admin User

### Option A: Register via UI, then Promote

1. Go to **http://localhost:3000**
2. Click "Register" or "Sign Up"
3. Fill the form:
   - Username: `admin`
   - Email: `admin@blog.com`
   - Password: `admin123`
4. Click Register

**Then promote to admin:**

Open new terminal:
```bash
mysql -u root -p
```

Password: `admin123` (your MySQL password)

```sql
USE blog_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@blog.com';
SELECT username, email, role FROM users;
EXIT;
```

5. Logout and login again in the web app

---

### Option B: Direct SQL Insert

```bash
mysql -u root -p
```

Password: `admin123`

```sql
USE blog_db;

INSERT INTO users (username, email, password, role, author_request_pending, created_at, updated_at)
VALUES (
  'admin',
  'admin@blog.com',
  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi',
  'ADMIN',
  false,
  NOW(),
  NOW()
);

SELECT * FROM users;
EXIT;
```

**Login credentials:**
- Email: `admin@blog.com`
- Password: `admin123`

---

## STEP 9: Access Application

### 9.1 Open Browser

Go to: **http://localhost:3000**

### 9.2 Login

Use the admin credentials you created:
- Email: `admin@blog.com`
- Password: `admin123`

### 9.3 Test Features

**As Admin:**
- Access Admin Dashboard
- View all users
- Approve/reject blogs
- Manage author requests

**As Author (create another user):**
- Register new user
- Request author access
- Approve as admin
- Create blog posts

**As Reader:**
- Browse published blogs
- Add reviews and ratings

---

## 🎉 SUCCESS! Your Application is Running!

**You should have:**
- ✅ Backend running on port 8081
- ✅ Frontend running on port 3000  
- ✅ MySQL database with blog_db
- ✅ Admin user created
- ✅ Application accessible in browser

---

## Troubleshooting

### Issue: "Port 8081 already in use"

**Windows:**
```cmd
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F
```

**macOS/Linux:**
```bash
lsof -i :8081
kill -9 <PID>
```

**Or change backend port:**
Edit `backend/src/main/resources/application.properties`:
```properties
server.port=8082
```

And `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = "http://localhost:8082/api";
```

---

### Issue: "Cannot connect to MySQL"

**Check MySQL is running:**

**Windows:**
```cmd
net start MySQL80
```

**macOS:**
```bash
sudo /usr/local/mysql/support-files/mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Test connection:**
```bash
mysql -u root -p
```

If password doesn't work, follow Step 2.1 to reset it.

---

### Issue: "Frontend fails to compile - TailwindCSS error"

**Solution:**
```bash
cd frontend
npm install @tailwindcss/postcss --save-dev
npm start
```

---

### Issue: "Java version wrong"

Check your Java version:
```bash
java -version
```

Should show version 17.

**If not:**

**Windows:**
- Set JAVA_HOME environment variable to Java 17 installation path
- Add `%JAVA_HOME%\bin` to PATH

**macOS:**
Add to `~/.zshrc` or `~/.bash_profile`:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/amazon-corretto-17.jdk/Contents/Home
```

**Linux:**
```bash
sudo update-alternatives --config java
```
Select Java 17.

---

### Issue: "mvn command not found"

Maven not installed or not in PATH.

**Windows:** Add Maven bin folder to PATH (see Step 1.2)

**macOS/Linux:**
```bash
# macOS
brew install maven

# Linux
sudo apt install maven -y
```

---

### Issue: "npm command not found"

Node.js not installed or not in PATH.

Re-install Node.js from Step 1.3.

---

### Issue: "Database blog_db does not exist"

```bash
mysql -u root -p
```

```sql
CREATE DATABASE blog_db;
EXIT;
```

Restart backend.

---

### Issue: "Access denied for user 'root'@'localhost'"

**Password is wrong in application.properties.**

1. Check your actual MySQL password
2. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.password=YOUR_ACTUAL_PASSWORD
   ```
3. Restart backend

---

### Issue: "Frontend shows blank page"

**Open browser console (F12):**

Look for errors. Common fixes:

**Clear cache and restart:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### Issue: "Cannot access Admin Dashboard"

Your user is not an admin.

```bash
mysql -u root -p
```

```sql
USE blog_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
EXIT;
```

Logout and login again.

---

## 📝 Quick Command Reference

### Start Everything

**Terminal 1 (Backend):**
```bash
cd BLOG/backend
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd BLOG/frontend
npm start
```

**Terminal 3 (MySQL - if needed):**
```bash
mysql -u root -p
```

---

### Stop Everything

**Backend:** Press `Ctrl + C` in backend terminal

**Frontend:** Press `Ctrl + C` in frontend terminal

**MySQL:**
- Windows: `net stop MySQL80`
- macOS: `sudo /usr/local/mysql/support-files/mysql.server stop`
- Linux: `sudo systemctl stop mysql`

---

## 🔐 Default Credentials

**MySQL:**
- User: `root`
- Password: `admin123` (or what you set)
- Database: `blog_db`

**Application Admin:**
- Email: `admin@blog.com`
- Password: `admin123`

**Ports:**
- MySQL: `3306`
- Backend: `8081`
- Frontend: `3000`

---

## 📂 Project Structure

```
BLOG/
├── backend/                    # Spring Boot application
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Configuration files
│   │   └── application.properties  # ⚠️ Edit this file
│   ├── pom.xml                # Maven dependencies
│   └── target/                # Compiled files (auto-generated)
│
├── frontend/                  # React application
│   ├── src/                  # React source code
│   │   └── services/api.js   # API configuration
│   ├── node_modules/         # Dependencies (auto-generated)
│   ├── package.json          # NPM dependencies
│   └── build/                # Production build (auto-generated)
│
├── SETUP_GUIDE.md           # Detailed setup guide
├── QUICK_START.md           # Quick reference
├── DATABASE_SCHEMA.md       # Database documentation
└── COMPLETE_SETUP.md        # This file
```

---

## 🎯 Verification Checklist

Use this to verify your setup is complete:

- [ ] Java 17 installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] Node.js installed (`node -v`)
- [ ] MySQL installed and running
- [ ] MySQL root password set and known
- [ ] Database `blog_db` created
- [ ] Backend `application.properties` updated with correct password
- [ ] Backend starts without errors
- [ ] Backend accessible at http://localhost:8081
- [ ] Frontend dependencies installed (`npm install` completed)
- [ ] Frontend starts without errors
- [ ] Frontend accessible at http://localhost:3000
- [ ] Admin user created
- [ ] Can login to application
- [ ] Can access admin dashboard

---

## 🚀 After Setup

### Create Test Data

**Register users with different roles:**

1. **Reader Account:**
   - Email: `reader@test.com`
   - Password: `test123`
   - Don't check "Request Author Access"

2. **Author Account:**
   - Email: `author@test.com`
   - Password: `test123`
   - Check "Request Author Access"
   - Login as admin and approve the request

### Test Features

**As Reader:**
- Browse blogs
- Read blog posts
- Add reviews

**As Author:**
- Create blog posts
- Submit for approval
- View own blogs

**As Admin:**
- Approve/reject blogs
- Manage users
- Approve author requests

---

## 📞 Getting Help

If you're stuck:

1. **Check the error message** - Read it carefully
2. **Check the Troubleshooting section** above
3. **Verify all steps** were completed in order
4. **Check logs**:
   - Backend: Look at the terminal where backend is running
   - Frontend: Press F12 in browser, check Console tab
   - MySQL: Check if service is running

---

## 💡 Tips

1. **Keep terminals open** - Don't close backend/frontend terminals while using the app
2. **Use admin account first** - Set up admin before testing other features
3. **Check ports** - Make sure 3000, 8081, and 3306 are not used by other apps
4. **Clear browser cache** - If frontend doesn't update, try Ctrl+F5
5. **Check Java version** - Must be Java 17, not 8 or 11
6. **MySQL password** - Write it down! You'll need it

---

## 🔄 Resetting Everything

If you want to start fresh:

**Stop all services**

**Delete database:**
```sql
mysql -u root -p
DROP DATABASE blog_db;
CREATE DATABASE blog_db;
EXIT;
```

**Clean backend:**
```bash
cd backend
mvn clean
```

**Clean frontend:**
```bash
cd frontend
rm -rf node_modules build
npm install
```

**Start again from Step 5**

---

## ✅ You're Done!

If you completed all steps, your Blog Web Application is now running!

**Access it at:** http://localhost:3000

**Happy Blogging!** 📝

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Tech Stack:** React 19 + Spring Boot 3.2 + MySQL 8.0

