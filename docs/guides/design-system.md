# Design System

Our design language is a fusion of **Cupertino (Apple)** and **Material (Google)** styles, aiming for a premium, high-tech look.

## Color Palette

We use vibrant, functional colors inspired by the circuit environment and Formula 1 aesthetics.

| Use Case | Color Hex | Description |
| :--- | :--- | :--- |
| **Primary** | `#E10600` | F1 Red - Action buttons, highlights. |
| **Success** | `#34C759` | Circuit Green - Entry points, navigation. |
| **Warning** | `#FF9500` | Caution Orange - Minor alerts. |
| **Danger** | `#FF3B30` | Alert Red - Critical errors. |
| **Background** | `#000000` | Deep Black - OLED optimized. |
| **Surface** | `#1C1C1E` | Card Grey - Secondary containers. |

## Typography

- **Primary Font:** Inter (via Google Fonts).
- **Secondary Font:** System Default (San Francisco / Roboto).

| Style | Size | Weight | Use Case |
| :--- | :--- | :--- | :--- |
| **Heading 1** | 32px | Bold | Page titles. |
| **Heading 2** | 24px | Semibold | Section headers. |
| **Body** | 16px | Regular | General text. |
| **Caption** | 12px | Regular | Secondary info. |

## Glassmorphism

Used for overlays and floating cards to maintain context of the background map.

- **Background:** `rgba(28, 28, 30, 0.7)`
- **Blur:** `15px`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`

## Iconography

- **Primary Library:** [Expo Symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) (SF Symbols on iOS).
- **Secondary Library:** [@expo/vector-icons](https://docs.expo.dev/guides/icons/) (MaterialDesign / Ionicons for cross-platform fallback).
- **Style:** Minimalist, consistent weight, Apple-inspired aesthetics.
