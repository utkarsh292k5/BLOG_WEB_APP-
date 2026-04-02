#!/bin/bash

# Blog Web Application Startup Script
# This script helps you get started with the blog application

echo "🚀 Blog Web Application Setup"
echo "=============================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL 8.0 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Database setup
echo ""
echo "📊 Setting up database..."
read -p "Enter MySQL username (default: root): " mysql_user
mysql_user=${mysql_user:-root}

read -s -p "Enter MySQL password: " mysql_password
echo ""

# Create database
mysql -u "$mysql_user" -p"$mysql_password" -e "CREATE DATABASE IF NOT EXISTS blog_db;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'blog_db' created successfully!"
else
    echo "❌ Failed to create database. Please check your MySQL credentials."
    exit 1
fi

# Update application.properties
echo ""
echo "🔧 Updating backend configuration..."
sed -i "s/spring.datasource.username=root/spring.datasource.username=$mysql_user/" backend/src/main/resources/application.properties
sed -i "s/spring.datasource.password=password/spring.datasource.password=$mysql_password/" backend/src/main/resources/application.properties

echo "✅ Backend configuration updated!"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Frontend dependencies installed!"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend:"
echo "   cd backend && mvn spring-boot:run"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend && npm start"
echo ""
echo "3. Open your browser and go to: http://localhost:3000"
echo ""
echo "📝 Note: You can register a new user and request author access,"
echo "   or manually update a user's role to ADMIN in the database."
