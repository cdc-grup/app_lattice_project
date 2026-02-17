# Quality Control (QA) Protocol and Physical Testing: Circuit Copilot

## 1. The Challenge of the Environment

This application cannot be validated only with simulators. The Circuit de Barcelona-Catalunya presents hostile conditions for mobile hardware:

1. **Direct Sunlight:** Affects screen visibility and camera sensors (AR).
2. **Magnetic Interference:** Grandstands are made of steel and concrete, which decalibrates the digital compass.
3. **GPS Shadow (Multipath):** Tall structures bounce the GPS signal.
4. **Network Saturation:** 100,000 people competing for 4G/5G bandwidth.

## 2. Testing Pyramid: Automated Strategy

_Before leaving the office, the code must pass these filters:_

### A. Unit and Logic Tests (Shared & API)

- **Framework:** [Vitest](https://vitest.dev/).
- **Objective:** Validate critical algorithms without external dependencies.
- **Examples:**
  - Distance calculation between coordinates (POI proximity logic).
  - Validation of GPS telemetry formats.
  - Data transformation for Socket.io (MessagePack).

### B. Endpoint Tests (API Integration)

- **Framework:** Vitest + [Supertest](https://github.com/ladjs/supertest).
- **Objective:** Ensure API routes respond correctly with expected HTTP codes and data schemas.

### C. Component Tests (Mobile)

- **Framework:** [Jest](https://jestjs.io/) + [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/).
- **Objective:** Check that screens and UI components react correctly to different states (without needing a real device).
- **Example:** Verify that the AR button deactivates if `compass_accuracy` is null.

## 3. Phase 1: Laboratory Simulations (Office)

_Before going to the circuit, check this:_

| Test Case                 | Action                                                                   | Expected Result                                                                                     |
| ------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **GPX Simulation**        | Load a `.gpx` file with a full lap of the circuit in the emulator.       | The blue dot moves smoothly along the track without jumps.                                         |
| **Network Throttling**    | Set the phone to "2G / Edge" (Developer settings).                       | The base map loads (because it is in the offline cache) and the route is calculated in <3s.         |
| **Compass Noise**         | Shake the phone violently while using AR.                                | Arrows should try to remain stable, not spin like crazy.                                            |

## 3. Phase 2: Field Tests (In Situ)

_Mandatory tests on real ground._

### A. The "Metal Grandstand" Test (Magnetic Interference)

**Context:** Mobile compasses fail near large masses of metal.

- **Location:** Under the Main Grandstand or in front of the straight fence.
- **Action:** Open AR Mode.
- **Observation:** Where does the arrow point?
- **Critical Error:** The arrow points to the wall instead of the path.
- **Solution:** If it fails, the app must detect `compass_accuracy_low` and suggest: _"Move 2 meters away from the metal structure"_ or automatically switch to 2D Map.

### B. The "Multipath" Test (GPS Signal Bounce)

**Context:** The GPS signal bounces off the stands and the phone thinks you are on the track.

- **Location:** Narrow corridor between Grandstand G and Grandstand H.
- **Action:** Walk in a straight line.
- **Observation:** Check if the avatar on the map jumps from side to side (Zig-Zag).
- **Validation:** The "Map Matching" algorithm (snapping to path) must keep the user on the pedestrian path, ignoring impossible coordinate jumps.

### C. "Extreme Sunlight" Test (AR Visibility)

**Context:** Direct sun "blinds" the camera and overheats the mobile.

- **Time:** 12:00 PM - 02:00 PM (Zenithal Sun).
- **Action:** Use AR for 5 continuous minutes pointing at the asphalt.
- **Risks to measure:**

1. **Contrast Loss:** Are virtual arrows visible on light gray asphalt? (They should have a black border or a strong shadow).
2. **Tracking Loss:** If the ground has no texture (it is very smooth and shiny), ViroReact will lose its anchor.
3. **Overheating:** Does the phone issue a temperature warning?

## 4. Phase 3: Stress Tests (Race Simulation)

### The 1 km Journey

A tester must complete this entire journey without closing the app:

1. **Start:** Parking F.
2. **Destination:** Seat in Grandstand N.
3. **Conditions:**
  - 100% screen brightness.
  - Mobile data deactivated (Simulating network collapse).
  - Bluetooth activated (Headphones).

4. **Acceptance Criteria:**
  - **Battery:** Should not drop more than 8% during this journey (~15 minutes).
  - **Navigation:** Should not require restarting the app.
  - **Audio:** Voice instructions ("Turn right") must be audible above ambient noise (simulates engine noise or crowds).

## 5. Error Report (Standard Format)

When testers report failures from the circuit, they must include:

- **Exact Coordinates:** (Copy and paste from debug mode).
- **Sky Conditions:** (Sun / Clouds / Rain). _Rain affects the touch screen._
- **Device Orientation:** (Portrait / Landscape).
- **Screenshot of the AR debug world:** (To see virtual anchor points detected by the system).
