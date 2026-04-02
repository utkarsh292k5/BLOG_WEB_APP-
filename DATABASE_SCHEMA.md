# Database Schema Documentation

## Overview

The Blog Web Application uses **MySQL 8.0** with **JPA/Hibernate** for automatic schema generation. Tables are created automatically when the backend starts for the first time.

**Configuration:** `spring.jpa.hibernate.ddl-auto=update` (in application.properties)

---

## Database Connection

```properties
URL:      jdbc:mysql://localhost:3306/blog_db
Database: blog_db
User:     root (configurable)
Port:     3306
```

---

## Tables

### 1. `users` Table

Stores all user accounts with authentication and role information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | User's display name |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | User's email (used for login) |
| `password` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `role` | ENUM/VARCHAR | NOT NULL | User role: READER, AUTHOR, ADMIN |
| `author_request_pending` | BOOLEAN | DEFAULT FALSE | True if user requested author access |
| `created_at` | TIMESTAMP | NOT NULL | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:**
- `idx_email` on `email` (for login queries)
- `idx_role` on `role` (for role-based queries)
- `idx_author_request` on `author_request_pending` (for admin dashboard)

**Sample Data:**
```sql
INSERT INTO users (username, email, password, role, author_request_pending, created_at, updated_at)
VALUES 
  ('admin', 'admin@blog.com', '$2a$10$...', 'ADMIN', false, NOW(), NOW()),
  ('john_doe', 'john@example.com', '$2a$10$...', 'AUTHOR', false, NOW(), NOW()),
  ('jane_reader', 'jane@example.com', '$2a$10$...', 'READER', false, NOW(), NOW());
```

---

### 2. `blogs` Table

Stores all blog posts with content, metadata, and status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique blog identifier |
| `title` | VARCHAR(255) | NOT NULL | Blog post title |
| `content` | TEXT/LONGTEXT | NOT NULL | Full blog content (supports Markdown/HTML) |
| `excerpt` | VARCHAR(500) | NULL | Short description/preview |
| `featured_image` | VARCHAR(500) | NULL | URL to featured image |
| `tags` | VARCHAR(500) | NULL | Comma-separated tags |
| `status` | ENUM/VARCHAR | NOT NULL | DRAFT, PENDING, PUBLISHED, REJECTED |
| `created_at` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Last update timestamp |
| `published_at` | TIMESTAMP | NULL | Publication timestamp |
| `author_id` | BIGINT | NOT NULL, FOREIGN KEY | Reference to users.id |

**Foreign Keys:**
- `fk_blogs_author` → `users(id)` ON DELETE CASCADE

**Indexes:**
- `idx_status` on `status` (for filtering published/pending blogs)
- `idx_author_id` on `author_id` (for author's blogs)
- `idx_published_at` on `published_at` (for sorting by date)
- `idx_created_at` on `created_at` (for recent blogs)

**Sample Data:**
```sql
INSERT INTO blogs (title, content, excerpt, status, author_id, created_at, updated_at, published_at)
VALUES 
  ('Getting Started with Spring Boot', 'Full content here...', 'Learn Spring Boot basics', 'PUBLISHED', 2, NOW(), NOW(), NOW()),
  ('React Hooks Explained', 'Full content here...', 'Understanding React Hooks', 'PENDING', 2, NOW(), NOW(), NULL);
```

---

### 3. `reviews` Table

Stores user reviews and ratings for blog posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique review identifier |
| `content` | TEXT | NOT NULL | Review text/comment |
| `rating` | INT | NOT NULL, CHECK(1-5) | Rating from 1 to 5 stars |
| `created_at` | TIMESTAMP | NOT NULL | Review creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Last update timestamp |
| `user_id` | BIGINT | NOT NULL, FOREIGN KEY | Reference to users.id |
| `blog_id` | BIGINT | NOT NULL, FOREIGN KEY | Reference to blogs.id |

**Foreign Keys:**
- `fk_reviews_user` → `users(id)` ON DELETE CASCADE
- `fk_reviews_blog` → `blogs(id)` ON DELETE CASCADE

**Indexes:**
- `idx_blog_id` on `blog_id` (for getting all reviews of a blog)
- `idx_user_id` on `user_id` (for getting user's reviews)
- `idx_rating` on `rating` (for filtering by rating)

**Unique Constraint:**
- `unique_user_blog_review` on `(user_id, blog_id)` - One review per user per blog

**Sample Data:**
```sql
INSERT INTO reviews (content, rating, user_id, blog_id, created_at, updated_at)
VALUES 
  ('Great article! Very helpful.', 5, 3, 1, NOW(), NOW()),
  ('Good content but needs more examples.', 4, 3, 2, NOW(), NOW());
```

---

## Relationships

```
users (1) ──────< (N) blogs
  │
  └──────< (N) reviews

blogs (1) ──────< (N) reviews
```

**Diagram:**
```
┌──────────┐
│  users   │
│  ────────│
│  id (PK) │───┐
│  username│   │
│  email   │   │ (author_id)
│  password│   │
│  role    │   ├──────────────> ┌──────────┐
└──────────┘   │                │  blogs   │
               │                │  ────────│
               │                │  id (PK) │───┐
               │                │  title   │   │
               │                │  content │   │
               │                │  status  │   │ (blog_id)
               │                │  author_id    │
               │                └──────────┘   │
               │ (user_id)                     │
               │                               │
               └──────────────> ┌──────────┐  │
                                │ reviews  │<─┘
                                │ ──────── │
                                │ id (PK)  │
                                │ content  │
                                │ rating   │
                                │ user_id  │
                                │ blog_id  │
                                └──────────┘
```

---

## Enumerations

### Role (users.role)
- `READER` - Can read blogs and post reviews
- `AUTHOR` - Can create blogs (requires approval)
- `ADMIN` - Full access to manage users and content

### BlogStatus (blogs.status)
- `DRAFT` - Author is still writing
- `PENDING` - Submitted for admin review
- `PUBLISHED` - Approved and visible to all
- `REJECTED` - Rejected by admin

---

## Common Queries

### Get all published blogs with author info
```sql
SELECT b.*, u.username as author_name, u.email as author_email
FROM blogs b
INNER JOIN users u ON b.author_id = u.id
WHERE b.status = 'PUBLISHED'
ORDER BY b.published_at DESC;
```

### Get blog with average rating
```sql
SELECT b.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
FROM blogs b
LEFT JOIN reviews r ON b.id = r.blog_id
WHERE b.id = ?
GROUP BY b.id;
```

### Get pending author requests
```sql
SELECT id, username, email, created_at
FROM users
WHERE author_request_pending = true
ORDER BY created_at ASC;
```

### Get user's blogs with review stats
```sql
SELECT b.*, 
       COUNT(DISTINCT r.id) as review_count,
       AVG(r.rating) as avg_rating
FROM blogs b
LEFT JOIN reviews r ON b.id = r.blog_id
WHERE b.author_id = ?
GROUP BY b.id
ORDER BY b.created_at DESC;
```

### Get pending blogs for admin approval
```sql
SELECT b.*, u.username as author_name
FROM blogs b
INNER JOIN users u ON b.author_id = u.id
WHERE b.status = 'PENDING'
ORDER BY b.created_at ASC;
```

---

## Data Integrity Rules

### Cascade Deletes
- Deleting a user → Deletes all their blogs and reviews
- Deleting a blog → Deletes all its reviews

### Business Rules (Enforced in Application Layer)
1. Only AUTHOR and ADMIN can create blogs
2. Only ADMIN can approve/reject blogs
3. Users can only edit/delete their own reviews
4. Authors can only edit their own DRAFT or REJECTED blogs
5. One review per user per blog
6. Rating must be between 1 and 5

---

## Initial Setup

### Create Database
```sql
CREATE DATABASE IF NOT EXISTS blog_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Create Admin User (After Tables Auto-Generated)
```sql
USE blog_db;

-- Password is 'admin123' (already BCrypt hashed)
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
```

### Verify Tables
```sql
USE blog_db;
SHOW TABLES;
DESCRIBE users;
DESCRIBE blogs;
DESCRIBE reviews;
```

---

## Backup & Restore

### Backup Database
```bash
mysqldump -u root -p blog_db > blog_db_backup.sql
```

### Restore Database
```bash
mysql -u root -p blog_db < blog_db_backup.sql
```

### Backup Specific Table
```bash
mysqldump -u root -p blog_db users > users_backup.sql
```

---

## Performance Considerations

### Indexes
All foreign keys and frequently queried columns are automatically indexed by Hibernate.

### Recommended Additional Indexes (if needed)
```sql
-- For full-text search on blog titles and content
CREATE FULLTEXT INDEX idx_blog_search ON blogs(title, content);

-- For tag-based filtering
CREATE INDEX idx_tags ON blogs(tags);
```

### Query Optimization
- Use pagination for blog lists (Spring Data provides this)
- Cache frequently accessed blogs (e.g., top 10 published)
- Use `LIMIT` in queries to prevent large result sets

---

## Monitoring

### Check Table Sizes
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'blog_db'
ORDER BY (data_length + index_length) DESC;
```

### Check Record Counts
```sql
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM blogs) AS total_blogs,
    (SELECT COUNT(*) FROM reviews) AS total_reviews;
```

### Check Database Status
```sql
SELECT 
    COUNT(CASE WHEN role = 'READER' THEN 1 END) AS readers,
    COUNT(CASE WHEN role = 'AUTHOR' THEN 1 END) AS authors,
    COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) AS admins,
    COUNT(CASE WHEN author_request_pending = true THEN 1 END) AS pending_requests
FROM users;
```

---

## Migration Notes

### From Development to Production
1. Export schema: `mysqldump --no-data blog_db > schema.sql`
2. Export data: `mysqldump --no-create-info blog_db > data.sql`
3. Change `ddl-auto` to `validate` in production
4. Use database migration tools (Flyway/Liquibase) for version control

### Schema Versioning
Consider using Flyway or Liquibase for production environments:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

---

## Troubleshooting

### Tables not created?
Check `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Foreign key constraints failing?
Ensure MySQL InnoDB engine:
```sql
ALTER TABLE blogs ENGINE=InnoDB;
ALTER TABLE reviews ENGINE=InnoDB;
```

### Character encoding issues?
Set UTF-8 everywhere:
```sql
ALTER DATABASE blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE blogs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

**Last Updated:** November 2025
**Schema Version:** 1.0
**Compatible With:** Spring Boot 3.2.0, MySQL 8.0+

