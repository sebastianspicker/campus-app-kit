#!/bin/bash
# Campus App Kit - Development Setup Script
# Run this script to set up the development environment

set -e

echo "🚀 Campus App Kit - Development Setup"
echo "======================================"

# Check for required tools
echo ""
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing..."
    npm install -g pnpm@9
fi
echo "✅ pnpm $(pnpm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Create .env files if they don't exist
echo ""
echo "⚙️  Setting up environment files..."

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
else
    echo "✅ .env already exists"
fi

if [ ! -f apps/mobile/.env ]; then
    echo "Creating apps/mobile/.env from apps/mobile/.env.example..."
    cp apps/mobile/.env.example apps/mobile/.env
else
    echo "✅ apps/mobile/.env already exists"
fi

# Build packages
echo ""
echo "🔨 Building packages..."
pnpm build

# Run typecheck
echo ""
echo "🔍 Running typecheck..."
pnpm typecheck

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env and set INSTITUTION_ID (default: hfmt)"
echo "   2. Run 'pnpm dev' to start BFF and mobile app"
echo "   3. Open the mobile app with Expo Go or a dev client"
echo ""
echo "📚 Documentation:"
echo "   - README.md for quick start"
echo "   - docs/runbook.md for detailed configuration"
echo "   - plans/comprehensive-improvement-plan-2026.md for roadmap"
