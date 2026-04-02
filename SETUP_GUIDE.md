# Blog Web Application - Complete Setup Guide

This guide will walk you through setting up and running the Blog Web Application from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Creating Initial Admin User](#creating-initial-admin-user)
7. [Verifying the Setup](#verifying-the-setup)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Java JDK** | 17 or higher | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/) |
| **Maven** | 3.6 or higher | [Maven](https://maven.apache.org/download.cgi) |
| **Node.js** | 16 or higher | [Node.js](https://nodejs.org/) |
| **MySQL** | 8.0 or higher | [MySQL](https://dev.mysql.com/downloads/mysql/) |

### Verify Installations

Run these commands in your terminal to verify installations:

```bash
# Check Java version
java -version
# Expected output: java version "17.x.x" or higher

# Check Maven version
mvn -version
# Expected output: Apache Maven 3.6.x or higher

# Check Node.js version
node -v
# Expected output: v16.x.x or higher

# Check npm version
npm -v
# Expected output: 8.x.x or higher

# Check MySQL version
mysql --version
# Expected output: mysql Ver 8.0.x or higher
```

---

## Database Setup

### Step 1: Start MySQL Service

**On macOS:**
```bash
# If installed via Homebrew
brew services start mysql

# Or using system preferences
# Go to System Preferences → MySQL → Start MySQL Server
```

**On Windows:**
```bash
# Open Services and start MySQL service
# Or use Command Prompt as Administrator
net start mysql
```

**On Linux:**
```bash
sudo systemctl start mysql
# Or
sudo service mysql start
```

### Step 2: Login to MySQL

Open your terminal and login to MySQL:

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

### Step 3: Create the Database

Once logged into MySQL, run the following commands:

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS blog_db;

-- Verify the database was created
SHOW DATABASES;

-- You should see 'blog_db' in the list
-- Exit MySQL
EXIT;
```

### Step 4: Configure Database Credentials

Navigate to the backend configuration file:

```
backend/src/main/resources/application.properties
```

Update the following properties with your MySQL credentials:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/blog_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# IMPORTANT: Replace 'YOUR_MYSQL_PASSWORD' with your actual MySQL root password
```

### Step 5: Understand Table Auto-Creation

**Important:** You don't need to manually create tables! 

The application uses **Hibernate/JPA** with `ddl-auto=update` setting, which means:
- Tables will be created automatically when you first run the backend
- The schema will be updated automatically if you modify entities

The following tables will be created automatically:
- `users` - Stores user information (username, email, password, role, etc.)
- `blogs` - Stores blog posts (title, content, status, author, etc.)
- `reviews` - Stores blog reviews and ratings

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd /Users/ayushtiwari/Desktop/BLOG/backend
```

### Step 2: Build the Project (Optional but Recommended)

This step downloads all dependencies and compiles the code:

```bash
mvn clean install
```

**Expected output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX.XXX s
```

If you encounter any errors, ensure:
- Java 17+ is installed
- Maven is properly configured
- Internet connection is active (for downloading dependencies)

### Step 3: Run the Backend

```bash
mvn spring-boot:run
```

**What to expect:**
- Maven will download dependencies (first time only)
- Spring Boot will start initializing
- Hibernate will create database tables automatically
- Server will start on port 8080

**Successful startup indicators:**
```
...
Hibernate: create table users ...
Hibernate: create table blogs ...
Hibernate: create table reviews ...
...
Started BlogBackendApplication in X.XXX seconds (JVM running for X.XXX)
```

**Keep this terminal window open** - the backend must remain running.

### Backend Endpoints

Once started, the backend will be available at:
- **Base URL:** `http://localhost:8080`
- **API Base:** `http://localhost:8080/api`
- **Health Check:** `http://localhost:8080/actuator/health` (if enabled)

---

## Frontend Setup

### Step 1: Open a New Terminal

**Important:** Open a **new terminal window/tab** while keeping the backend running.

### Step 2: Navigate to Frontend Directory

```bash
cd /Users/ayushtiwari/Desktop/BLOG/frontend
```

### Step 3: Install Dependencies

**First time setup:**

```bash
npm install
```

This will install all required packages (React, Ant Design, Axios, etc.).

**Expected output:**
```
added XXX packages in XXs
```

**If you encounter permission errors:**

```bash
# Remove existing node_modules and reinstall
sudo rm -rf node_modules package-lock.json
npm install
```

### Step 4: Start the Frontend

```bash
npm start
```

**What to expect:**
- Webpack dev server starts
- Browser opens automatically
- Application loads at `http://localhost:3000`

**Successful startup indicators:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

**Keep this terminal window open** - the frontend must remain running.

---

## Running the Application

### Quick Start Summary

You should now have **two terminal windows** running:

**Terminal 1 - Backend:**
```bash
cd /Users/ayushtiwari/Desktop/BLOG/backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd /Users/ayushtiwari/Desktop/BLOG/frontend
npm start
```

### Accessing the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the Blog homepage!

---

## Creating Initial Admin User

To fully manage the application, you need an admin user. There are two methods:

### Method 1: Register and Manually Promote (Recommended)

1. **Register a new user:**
   - Go to `http://localhost:3000`
   - Click "Sign Up" or "Register"
   - Fill in the registration form
   - Submit the form

2. **Promote user to Admin:**
   - Open terminal and login to MySQL:
     ```bash
     mysql -u root -p
     ```
   
   - Run the following SQL commands:
     ```sql
     USE blog_db;
     
     -- View all users
     SELECT id, username, email, role FROM users;
     
     -- Promote your user to ADMIN (replace 'your_email@example.com' with your actual email)
     UPDATE users SET role = 'ADMIN' WHERE email = 'your_email@example.com';
     
     -- Verify the change
     SELECT id, username, email, role FROM users;
     
     EXIT;
     ```

3. **Logout and Login again** in the web application to refresh your permissions.

### Method 2: Direct SQL Insert

Login to MySQL and run:

```sql
USE blog_db;

-- Insert admin user with password 'admin123'
-- (Password is already BCrypt hashed)
INSERT INTO users (username, email, password, role, author_request_pending, created_at, updated_at) 
VALUES (
  'admin',
  'admin@blogapp.com',
  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi',
  'ADMIN',
  false,
  NOW(),
  NOW()
);

-- Verify
SELECT * FROM users WHERE role = 'ADMIN';
```

**Login credentials:**
- Email: `admin@blogapp.com`
- Password: `admin123`

---

## Verifying the Setup

### 1. Check Backend is Running

Open a browser or use curl:

```bash
curl http://localhost:8080/api/blogs
```

**Expected response:** JSON array (may be empty initially)

```json
{
  "content": [],
  "totalElements": 0,
  "totalPages": 0
}
```

### 2. Check Frontend is Running

Open browser at `http://localhost:3000`

You should see:
- ✅ Blog homepage
- ✅ Navigation bar
- ✅ Login/Register buttons
- ✅ No console errors (F12 to check)

### 3. Test User Registration

1. Click "Register"
2. Fill in the form
3. Submit
4. You should be redirected to login or dashboard

### 4. Test User Login

1. Click "Login"
2. Enter your credentials
3. You should be redirected to the dashboard

### 5. Test Admin Features (if you created an admin)

1. Login as admin
2. Navigate to Admin Dashboard
3. You should see:
   - User management
   - Blog approval queue
   - Author request management

---

## Troubleshooting

### Backend Issues

#### Issue: Port 8080 already in use

**Error message:**
```
Web server failed to start. Port 8080 was already in use.
```

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or change the port in application.properties
server.port=8081
```

#### Issue: MySQL Connection Failed

**Error message:**
```
java.sql.SQLException: Access denied for user 'root'@'localhost'
```

**Solution:**
- Verify MySQL is running: `mysql --version`
- Check credentials in `application.properties`
- Ensure MySQL service is started
- Try logging in manually: `mysql -u root -p`

#### Issue: Database not found

**Error message:**
```
java.sql.SQLSyntaxErrorException: Unknown database 'blog_db'
```

**Solution:**
```sql
mysql -u root -p
CREATE DATABASE blog_db;
EXIT;
```

### Frontend Issues

#### Issue: Port 3000 already in use

**Solution:**
- Kill the process: `lsof -i :3000` then `kill -9 PID`
- Or use a different port when prompted (React will ask automatically)

#### Issue: npm install fails with EACCES

**Solution:**
```bash
# Fix permissions
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) /Users/ayushtiwari/Desktop/BLOG/frontend

# Then try again
npm install
```

#### Issue: React shows "Failed to fetch" error

**Causes:**
- Backend is not running
- Backend is running on wrong port
- CORS issue

**Solution:**
```bash
# 1. Verify backend is running
curl http://localhost:8080/api/blogs

# 2. Check browser console for specific errors (F12)

# 3. Verify API URL in frontend/src/services/api.js
# Should be: http://localhost:8080/api
```

#### Issue: White screen after npm start

**Solution:**
```bash
# Clear cache and restart
rm -rf node_modules
npm cache clean --force
npm install
npm start
```

### Database Issues

#### Issue: Tables not created automatically

**Solution:**
1. Check `application.properties` has:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```

2. Delete the database and recreate:
   ```sql
   DROP DATABASE blog_db;
   CREATE DATABASE blog_db;
   ```

3. Restart the backend

#### Issue: Can't connect to MySQL

**Solution:**

**macOS:**
```bash
brew services restart mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Windows:**
```bash
net start mysql
```

---

## Development Tips

### Hot Reload

**Backend:**
- Changes to Java files require restart
- Use Spring DevTools for faster restarts (already included)
- Press `Ctrl+C` to stop, then run `mvn spring-boot:run` again

**Frontend:**
- React hot-reloads automatically
- Just save your changes, browser will refresh

### Viewing Logs

**Backend logs:**
- Displayed in the terminal where backend is running
- SQL queries visible due to `spring.jpa.show-sql=true`

**Frontend logs:**
- Browser console (F12 → Console tab)
- Terminal shows webpack compilation status

### Stopping the Application

**Backend:**
```bash
# In the backend terminal
Press Ctrl+C
```

**Frontend:**
```bash
# In the frontend terminal
Press Ctrl+C
```

**MySQL:**
```bash
# macOS
brew services stop mysql

# Linux
sudo systemctl stop mysql

# Windows
net stop mysql
```

---

## Production Deployment

### Backend Production Build

```bash
cd backend
mvn clean package

# Run the JAR file
java -jar target/blog-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build

```bash
cd frontend
npm run build

# Output will be in 'build/' directory
# Serve with any static file server (nginx, Apache, etc.)
```

---

## Additional Resources

- **Spring Boot Documentation:** https://spring.io/projects/spring-boot
- **React Documentation:** https://react.dev/
- **Ant Design Components:** https://ant.design/components/overview/
- **MySQL Documentation:** https://dev.mysql.com/doc/

---

## Quick Reference Commands

```bash
# Start Backend
cd backend && mvn spring-boot:run

# Start Frontend
cd frontend && npm start

# Create Database
mysql -u root -p -e "CREATE DATABASE blog_db;"

# View Logs (Backend)
tail -f logs/spring-boot.log

# Build for Production
cd backend && mvn clean package
cd frontend && npm run build
```

---

## Support

If you encounter issues not covered in this guide:

1. Check the main README.md for feature documentation
2. Review error messages carefully
3. Check browser console for frontend errors (F12)
4. Verify all services are running (MySQL, Backend, Frontend)
5. Ensure all ports are available (3306, 8080, 3000)

---

**🎉 Congratulations!** If you've followed all steps, your Blog Web Application should now be running successfully!

**Next Steps:**
1. Register users and test different roles (Reader, Author, Admin)
2. Create blog posts as an Author
3. Approve blogs as an Admin
4. Add reviews as a Reader
5. Explore the codebase and customize as needed

Happy Blogging! 📝

