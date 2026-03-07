#!/bin/bash

# Setup Server for Lattice Project
# This script installs Docker, Docker Compose and prepares the environment.

set -e

echo "🚀 Starting server setup..."

# 1. Update system
echo "📦 Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker is already installed."
fi

# 3. Install Docker Compose (V2 is included in latest Docker, but check)
if ! docker compose version &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo apt-get install -y docker-compose-plugin
else
    echo "✅ Docker Compose is already installed."
fi

# 4. Configure permissions
echo "👤 Configuring user permissions for Docker..."
sudo usermod -aG docker $USER
echo "⚠️  Note: You might need to log out and log back in for Group changes to take effect."

# 5. Create project directory
echo "📁 Creating project directory..."
mkdir -p ~/lattice-deploy
cd ~/lattice-deploy

echo "✅ Server setup complete!"
echo "Next step: Configure the GitHub Runner."
