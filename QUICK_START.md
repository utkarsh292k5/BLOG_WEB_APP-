# Blog Application - Quick Start Reference

## 🚀 One-Page Setup Guide

### 1️⃣ Prerequisites Check
```bash
java -version    # Need 17+
mvn -version     # Need 3.6+
node -v          # Need 16+
npm -v           # Should be installed with Node
mysql --version  # Need 8.0+
```

---

### 2️⃣ Database Setup (5 minutes)

```bash
# Start MySQL
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
# Windows: net start mysql

# Create database
mysql -u root -p
```

```sql
CREATE DATABASE blog_db;
SHOW DATABASES;
EXIT;
```

**Configure Backend:** Edit `backend/src/main/resources/application.properties`
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD  # ⚠️ Change this!
```

---

### 3️⃣ Start Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

✅ **Wait for:** `Started BlogBackendApplication`

🌐 **Backend runs on:** http://localhost:8080

---

### 4️⃣ Start Frontend (Terminal 2)

```bash
cd frontend

# First time only:
npm install

# Start the app:
npm start
```

✅ **Wait for:** Browser opens automatically

🌐 **Frontend runs on:** http://localhost:3000

---

### 5️⃣ Create Admin User

**Option A: Register & Promote (Recommended)**
1. Go to http://localhost:3000 and register
2. Promote to admin:
```sql
mysql -u root -p
USE blog_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
EXIT;
```

**Option B: Direct Insert**
```sql
mysql -u root -p
USE blog_db;
INSERT INTO users (username, email, password, role, author_request_pending, created_at, updated_at) 
VALUES ('admin', 'admin@blogapp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', false, NOW(), NOW());
EXIT;
```
Login: `admin@blogapp.com` / `admin123`

---

## 🎯 Database Tables (Auto-Created)

Tables are created automatically by Hibernate when backend starts:

| Table | Description |
|-------|-------------|
| `users` | User accounts (username, email, password, role) |
| `blogs` | Blog posts (title, content, status, author) |
| `reviews` | Blog reviews and ratings |

**No manual table creation needed!** ✨

---

## 🔧 Common Issues & Quick Fixes

### Port 8080 in use
```bash
lsof -i :8080
kill -9 <PID>
```

### Port 3000 in use
```bash
lsof -i :3000
kill -9 <PID>
# Or press 'Y' when React asks to use another port
```

### MySQL connection failed
```bash
# Check MySQL is running
mysql --version

# Test connection
mysql -u root -p

# Verify credentials in application.properties
```

### Frontend shows errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

### Tables not created
```sql
# Verify setting in application.properties:
# spring.jpa.hibernate.ddl-auto=update

# Recreate database
DROP DATABASE blog_db;
CREATE DATABASE blog_db;

# Restart backend
```

---

## 📱 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main web application |
| Backend API | http://localhost:8080/api | REST API endpoints |
| MySQL | localhost:3306 | Database |

---

## 🎭 User Roles

| Role | Permissions |
|------|-------------|
| **Reader** | Browse blogs, add reviews (after login) |
| **Author** | Create blogs (requires admin approval) |
| **Admin** | Manage users, approve blogs, full access |

---

## 🛑 Stopping the Application

```bash
# Stop Backend (Terminal 1)
Ctrl + C

# Stop Frontend (Terminal 2)
Ctrl + C

# Stop MySQL (optional)
# macOS: brew services stop mysql
# Linux: sudo systemctl stop mysql
# Windows: net stop mysql
```

---

## 📊 Verification Checklist

- [ ] MySQL is running and `blog_db` exists
- [ ] Backend started without errors (port 8080)
- [ ] Frontend started and opened in browser (port 3000)
- [ ] No red errors in browser console (F12)
- [ ] Can see homepage with navigation bar
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Admin user can access admin dashboard

---

## 🚀 Next Steps

1. ✅ **Register users** with different roles
2. 🖋️ **Create blog posts** as an Author
3. ✔️ **Approve content** as an Admin
4. ⭐ **Add reviews** as a Reader
5. 🛠️ **Customize** the application to your needs

---

## 📚 Need More Help?

- **Detailed Setup:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Features & API:** See [README.md](./README.md)
- **Database Schema:** See `backend/database-setup.sql`

---

**💡 Pro Tip:** Keep this file open while setting up for quick reference!

---

## 🔑 Default Ports

```
MySQL:    3306
Backend:  8080
Frontend: 3000
```

## 📁 Important Files

```
backend/src/main/resources/application.properties  # Database config
frontend/src/services/api.js                        # API endpoints
backend/database-setup.sql                          # Database info
```

---

**Last Updated:** November 2025

