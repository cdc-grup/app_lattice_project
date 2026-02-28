#!/bin/bash

# Configuration
API_PORT=3000
METRO_PORT=8081
ENV_FILE=".env"

echo "🚀 Starting zrok tunnels for Circuit Copilot Mobile..."

# Check if zrok is installed
if ! command -v zrok &> /dev/null; then
    echo "❌ zrok is not installed. Please install it from https://zrok.io"
    exit 1
fi

# Function to stop tunnels on exit
cleanup() {
    echo "🛑 Stopping tunnels..."
    kill $(jobs -p)
    exit
}
trap cleanup SIGINT SIGTERM

# Function to wait for a zrok URL in a log file
wait_for_url() {
    local log_file=$1
    local name=$2
    local max_attempts=20
    local attempt=1
    local url=""

    echo "⏳ Waiting for $name URL to appear in $log_file..." >&2
    while [ $attempt -le $max_attempts ]; do
        # Use a more permissive regex and handle potential escaping/JSON
        url=$(grep -oE "https://[a-zA-Z0-9\.-]+\.share\.zrok\.io" "$log_file" | head -n 1)
        if [ -n "$url" ]; then
            echo "$url"
            return 0
        fi
        
        # Check if zrok process is still running
        if ! pgrep -f "zrok share public" > /dev/null; then
            echo "❌ zrok process for $name died prematurely. Check $log_file" >&2
            return 1
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
    echo "❌ Timeout waiting for $name URL in $log_file" >&2
    return 1
}

# Start API tunnel
echo "📡 Starting API tunnel on port $API_PORT..."
# Remove old log if exists
rm -f api_zrok.log
zrok share public http://localhost:$API_PORT --headless > api_zrok.log 2>&1 &
API_URL=$(wait_for_url api_zrok.log "API")

if [ $? -ne 0 ]; then
    cleanup
fi
echo "✅ API Tunnel: $API_URL"

# Start Metro tunnel
echo "📡 Starting Metro tunnel on port $METRO_PORT..."
# Remove old log if exists
rm -f metro_zrok.log
zrok share public http://localhost:$METRO_PORT --headless > metro_zrok.log 2>&1 &
METRO_URL=$(wait_for_url metro_zrok.log "Metro")

if [ $? -ne 0 ]; then
    cleanup
fi
echo "✅ Metro Tunnel: $METRO_URL"

# Update .env file
echo "📝 Updating $ENV_FILE with new API URL..."
if [ -f "$ENV_FILE" ]; then
    # Backup .env
    cp "$ENV_FILE" "$ENV_FILE.bak"
    # Update or add EXPO_PUBLIC_API_URL
    # Escaping / for sed
    SAFE_API_URL=$(echo "$API_URL" | sed 's/\//\\\//g')
    if grep -q "EXPO_PUBLIC_API_URL=" "$ENV_FILE"; then
        sed -i "s/EXPO_PUBLIC_API_URL=.*/EXPO_PUBLIC_API_URL=$SAFE_API_URL\/api\/v1/" "$ENV_FILE"
    else
        echo "EXPO_PUBLIC_API_URL=$API_URL/api/v1" >> "$ENV_FILE"
    fi
else
    echo "EXPO_PUBLIC_API_URL=$API_URL/api/v1" > "$ENV_FILE"
fi

# Run Metro Bundler with proxy settings
echo "📦 Starting Metro Bundler..."
# Note: expo run:android doesn't support --clear easily via npm scripts sometimes
# We use EXPO_PACKAGER_PROXY_URL and start the dev server
export EXPO_PACKAGER_PROXY_URL="$METRO_URL"
npx expo start --android --clear

# Wait for background processes
wait
