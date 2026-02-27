# Mobile Best Practices

## Expo & Development Builds

This project requires **Custom Development Builds** because it uses native modules that are not compatible with Expo Go (MMKV, Reanimated, Viro).

- **Build Command:** `npx expo run:android` or `npx expo run:ios`.
- **Pre-requisite:** Ensure you have the local development environment configured (Android Studio / Xcode).

## MapLibre GL Integration

We use `@maplibre/maplibre-react-native` for the map engine.

1. **Performance:** Always use `surfaceView={true}` for Android in the `MapView` component.
2. **Layering:** Use `MapLibre` layers (CircleLayer, SymbolLayer) for high-performance marker rendering.
3. **Selected State:** Use `MarkerView` only for the active/selected POI for better visual detail without sacrificing overall performance.

## State Management Patterns

- **Server Side:** Use `useQuery` for data fetching. Wrap results in custom hooks for business logic reuse.
- **Local Persistence:** Use `react-native-mmkv` for critical settings (Auth, Offline Cache). Avoid `AsyncStorage`.
- **Animation:** Use `react-native-reanimated` for all UI transitions.

## AR Activation (Orientation Based)

Transitions between 2D and AR are governed by device orientation to ensure a smooth, professional experience.

- **Trigger:** AR activates only when the device is held in **Landscape** mode (rotated horizontally).
- **Smooth Transitions:** Uses `react-native-reanimated` (opacity fade) and a small mounting delay to ensure GPU stability, especially on emulators.
- **Orientation Lock:** Ensure `AndroidManifest.xml` has `android:screenOrientation="unspecified"` to allow rotation.

## Clean Code & Scalability

- **SettingItem Pattern:** Use the `SettingItem` component for all list-based UI screens (Profile, Settings) to ensure consistent iconography and feedback.
- **StyleSheet.create:** Prefer `StyleSheet.create` over inline objects for shadows and complex compositions to improve rendering performance.
- **Conditional Rendering:** Always use ternary operators `condition ? <Component /> : null` instead of the `&&` short-circuit to avoid rendering unexpected `0` or `NaN` values in the UI.

## Accessibility

Always provide accessibility labels for interactive elements on the map and in the UI to ensure the app is usable by everyone at the circuit.
