# Developer Setup Guide

Welcome to the Lattice development team. This guide will help you get your local environment running.

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
   Copy `.env.example` to `.env` in `apps/mobile/` and each service folder under `apps/server/` (e.g., `auth`, `geo`, `social`, `gateway`).

3. **Start Infrastructure:**
   ```bash
   docker compose up -d db
   ```

4. **Prepare Database:**
   ```bash
   npm run db:migrate
   npm run db:clean          # Optional: Start with a fresh DB
   npm run db:seed-montmelo  # Feed Montmeló POIs (Standard)
   # OR
   npm run db:seed-pedralbes # Feed Pedralbes POIs (Testing)
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   This command starts the API Gateway and the Mobile Metro bundler simultaneously.

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
3.  **Run the Tunnel Command (Root):**
    ```bash
    npm run dev:zrok
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

## Authentication & Onboarding Flow

The application features a premium onboarding experience designed to bridge physical tickets with digital accounts.

### The Welcome Flow
When a user launches the app for the first time:
1.  **Welcome Screen**: Asks "Do you have a ticket?".
2.  **With Ticket**: Opens the QR scanner.
    -   **Existing Account**: If the ticket email is linked to a full account, the user is logged in immediately.
    -   **New Account**: If the email is new, the user is sent to the Register screen with their email pre-filled to set a password.
3.  **Without Ticket**: Asks if the user is new or returning, leading to Register or Login respectively.

### Testing the Flow
To test ticket-based onboarding, you can generate test QR codes directly in your terminal:

```bash
# Generate test tickets (with Paddock Club and Grandstand G examples)
npm run qrs -w @app/db
```

Scan the generated QR codes with your physical device's camera inside the app to verify the redirection logic.

---
> For contribution guidelines, see [**Contribution Standards**](./standards.md).
