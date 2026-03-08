# Testing & Quality Assurance

Protocol for ensuring the reliability of Lattice in hostile high-density environments.

## 1. Automated Testing Suite

### Unit & Logic Tests
- **Framework:** Vitest.
- **Focus:** Algorithms, data transformations, and custom hooks.
- **Command:** `npm test` (root) or `npm run test:logic -w mobile`.

### Component & UI Tests
- **Framework:** Jest + React Native Testing Library.
- **Focus:** Component rendering, user interaction, and state transitions.
- **Command:** `npm run test:components -w mobile`.

## 2. Environmental Testing (The Real World)

Simulators cannot recreate the Grand Prix environment. We test for:

1. **Magnetic Interference:** Steel grandstands can decalibrate compasses.
2. **GPS Shadow (Multipath):** High structures cause coordinate "jumps".
3. **Extreme Sun:** Checking visibility of AR elements under direct noon-day sun.
4. **Network Saturation:** Testing app behavior under extreme 4G/5G congestion using local "2G/Edge" throttling.

## 3. Bug Reporting Standards

When reporting issues from the field, testers must include:
- **Exact Coordinates** (from Debug mode).
- **Environment Conditions** (Sun/Clouds/Rain).
- **Device Orientation**.
- **Debug Screenshots** of AR anchor points.

---
> [!IMPORTANT]
> A successful test in the office does not guarantee success at the track. Always perform a field walk.
