# Developer Setup Guide

Welcome to the Circuit Copilot development team. This guide will help you get your local environment running.

## Prerequisites

- **Node.js (LTS):** v18.0.0 or higher.
- **Docker Desktop:** Running and updated (Required for PostGIS).
- **Mobile SDKs:** 
  - Xcode (macOS only) for iOS.
  - Android Studio + SDK Platform Tools for Android.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env.development` in Each service folder under `apps/server/` and `apps/mobile/`.

3. **Start Infrastructure:**
   ```bash
   docker compose up -d db
   ```

4. **Prepare Database:**
   ```bash
   npm run migrate
   npm run seed:pedralbes # Feed testing POIs
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Mobile Development (Custom Builds)

> [!IMPORTANT]
> This project is **not compatible with Expo Go**. You must use Development Builds.

```bash
# For Android
npm run android -w mobile

# For iOS
npm run ios -w mobile
```

## Local Tunneling (Remote & Physical Devices)

To test on a physical device, you have two main options:

### Option A: Using Zrok (Remote/Wireless)

This is best for testing without a cable or when someone else needs to see your work.

1.  **Install Zrok:** [zrok.io](https://zrok.io).
2.  **Authenticate:** `zrok enable <token>`.
3.  **Run the Helper Script:**
    ```bash
    ./apps/mobile/zrok-tunnel.sh
    ```
    This script will:
    - Create public tunnels for both Metro (8081) and the API (3000).
    - Automatically update your `EXPO_PUBLIC_API_URL` in `.env`.
    - Set `EXPO_PACKAGER_PROXY_URL` so Expo uses the tunnel.

### Option B: Using ADB Reverse (USB Cable - Recommended)

This is the fastest, most stable, and preferred method for local testing.

1.  **Connect Device:** Ensure USB Debugging is enabled.
2.  **Run Port Forwarding:**
    ```bash
    adb reverse tcp:8081 tcp:8081
    adb reverse tcp:3000 tcp:3000
    ```
3.  **Update .env:** Ensure `EXPO_PUBLIC_API_URL` points to `http://localhost:3000/api/v1`.
4.  **Start App:**
    ```bash
    npm run android -w mobile
    ```

> [!NOTE]
> When using `adb reverse`, the device acts as if the server is running on its own `localhost`.

---
> For contribution guidelines, see [**Contribution Standards**](./standards.md).
