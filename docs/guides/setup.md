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

## Local Tunneling (Zrok)

To test on a physical device outside your local network:
1. Install Zrok from [zrok.io](https://zrok.io).
2. Authenticate: `zrok enable <your_token>`.
3. Share the Gateway: `zrok share public http://localhost:3000`.
4. Update `EXPO_PUBLIC_API_URL` in your mobile `.env.development` with the provided Zrok URL.

---
> For contribution guidelines, see [**Contribution Standards**](./standards.md).
