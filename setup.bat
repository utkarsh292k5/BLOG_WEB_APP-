@echo off
REM Blog Web Application Setup Script for Windows
REM This script helps you get started with the blog application

echo 🚀 Blog Web Application Setup
echo ==============================

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Database setup
echo.
echo 📊 Setting up database...
set /p mysql_user="Enter MySQL username (default: root): "
if "%mysql_user%"=="" set mysql_user=root

set /p mysql_password="Enter MySQL password: "

REM Create database
mysql -u %mysql_user% -p%mysql_password% -e "CREATE DATABASE IF NOT EXISTS blog_db;" 2>nul

if %errorlevel% equ 0 (
    echo ✅ Database 'blog_db' created successfully!
) else (
    echo ❌ Failed to create database. Please check your MySQL credentials.
    pause
    exit /b 1
)

REM Update application.properties
echo.
echo 🔧 Updating backend configuration...
powershell -Command "(Get-Content backend\src\main\resources\application.properties) -replace 'spring.datasource.username=root', 'spring.datasource.username=%mysql_user%' | Set-Content backend\src\main\resources\application.properties"
powershell -Command "(Get-Content backend\src\main\resources\application.properties) -replace 'spring.datasource.password=password', 'spring.datasource.password=%mysql_password%' | Set-Content backend\src\main\resources\application.properties"

echo ✅ Backend configuration updated!

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo ✅ Frontend dependencies installed!

echo.
echo 🎉 Setup completed successfully!
echo.
echo To start the application:
echo 1. Start the backend:
echo    cd backend ^&^& mvn spring-boot:run
echo.
echo 2. Start the frontend (in a new command prompt):
echo    cd frontend ^&^& npm start
echo.
echo 3. Open your browser and go to: http://localhost:3000
echo.
echo 📝 Note: You can register a new user and request author access,
echo    or manually update a user's role to ADMIN in the database.
echo.
pause
