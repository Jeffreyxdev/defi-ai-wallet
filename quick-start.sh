#!/bin/bash
# Quick Start Script for Scentree

set -e

echo " Scentree Quick Start"
echo "======================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo " Node.js not found. Please install Node.js 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo " npm not found"; exit 1; }
echo " Node.js $(node -v)"
echo " npm $(npm -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install 2>&1 | tail -5
echo " Root dependencies installed"
echo ""

echo "Installing frontend dependencies..."
cd frontend
npm install 2>&1 | tail -5
echo "- Frontend dependencies installed"
cd ..
echo ""

echo "Installing backend dependencies..."
cd backend
npm install 2>&1 | tail -5
echo "- Backend dependencies installed"
cd ..
echo ""

# Create .env files if they don't exist
echo "Setting up environment files..."
if [ ! -f frontend/.env.local ]; then
  cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_NETWORK=devnet
EOF
  echo "- Created frontend/.env.local"
fi

if [ ! -f backend/.env ]; then
  cat > backend/.env << EOF
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/scentree"

# Server
PORT=3001

# Solana
SOLANA_RPC_URL="https://api.devnet.solana.com"

# External APIs
HELIUS_API_KEY="your_helius_key"
XAI_GROK_API_KEY="your_xai_key"
JUPITER_API_URL="https://quote-api.jup.ag/v6"

# Trading Parameters
MAX_ALLOCATION=0.1
DAILY_TRADE_LIMIT=5
DEFAULT_STOP_LOSS=10.0
EOF
  echo "- Created backend/.env"
fi
echo ""

# Build check
echo "Verifying builds..."
cd backend
npm run build > /dev/null 2>&1 && echo "- Backend builds successfully" || echo "x Backend build failed"
cd ..

cd frontend
npm run build > /dev/null 2>&1 && echo "- Frontend builds successfully" || echo "x Frontend build failed"
cd ..
echo ""

# Database check
echo "Database Setup (Optional):"
echo "If you have PostgreSQL installed:"
echo "  1. createdb scentree"
echo "  2. cd backend && npx prisma migrate deploy"
echo ""

echo " Ready to start development!"
echo ""
echo "In Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "In Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit http://localhost:3000"
echo ""
echo "For detailed setup, see README.md and DEVELOPMENT.md"
