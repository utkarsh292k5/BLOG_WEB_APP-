-- Database setup script for Blog Web Application
-- Run this script in MySQL to create the database and initial admin user

-- Create database
CREATE DATABASE IF NOT EXISTS blog_db;
USE blog_db;

-- The tables will be created automatically by Hibernate/JPA when the Spring Boot application starts
-- This is because we have spring.jpa.hibernate.ddl-auto=update in application.properties

-- Optional: Create an initial admin user (you can also do this through the registration form)
-- Note: The password should be hashed using BCrypt in a real application
-- For testing purposes, you can register through the UI and then manually update the role to ADMIN

-- Example of how to manually create an admin user (password is 'admin123' hashed with BCrypt):
-- INSERT INTO users (username, email, password, role, author_request_pending, created_at, updated_at) 
-- VALUES ('admin', 'admin@blogapp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', false, NOW(), NOW());

-- The application will automatically create the following tables:
-- - users (id, username, email, password, role, author_request_pending, created_at, updated_at)
-- - blogs (id, title, content, excerpt, featured_image, tags, status, created_at, updated_at, published_at, author_id)
-- - reviews (id, content, rating, created_at, updated_at, user_id, blog_id)

-- Indexes will be created automatically for foreign keys and frequently queried fields
