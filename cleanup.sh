#!/bin/bash

# Blog Project Cleanup Script
# Removes all build artifacts and dependencies for transfer

echo "🧹 Cleaning up Blog project..."

cd "$(dirname "$0")"

echo "📦 Removing frontend dependencies..."
sudo rm -rf frontend/node_modules
sudo rm -rf frontend/build
sudo rm -f frontend/package-lock.json

echo "☕ Removing backend build files..."
rm -rf backend/target
rm -rf backend/.mvn

echo "🗑️  Removing IDE files..."
rm -rf .idea
rm -rf .vscode
find . -name "*.iml" -delete
find . -name ".DS_Store" -delete

echo ""
echo "✅ Project cleaned successfully!"
echo ""
echo "📊 Project size:"
du -sh .
echo ""
echo "📝 To restore dependencies:"
echo "   Frontend: cd frontend && npm install"
echo "   Backend:  cd backend && mvn clean install"

