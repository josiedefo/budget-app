#!/bin/bash

echo "🚀 Starting Budget App Development Environment"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL database
echo "📦 Starting PostgreSQL database..."
docker-compose -f docker-compose.dev.yml up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready
if docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U budget_user -d budget_app > /dev/null 2>&1; then
    echo "✅ Database is ready!"
else
    echo "❌ Database failed to start. Check logs with: docker-compose -f docker-compose.dev.yml logs postgres"
    exit 1
fi

# Update backend environment for local development
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    sed -i 's/DB_HOST=postgres/DB_HOST=localhost/' backend/.env
fi

# Update frontend environment for local development
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
fi

echo ""
echo "🎯 Development environment is ready!"
echo ""
echo "Next steps:"
echo "1. Start the backend API:"
echo "   cd backend && npm run dev"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Open your browser to http://localhost:5173"
echo ""
echo "To stop the database:"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""
echo "To view database logs:"
echo "   docker-compose -f docker-compose.dev.yml logs postgres"