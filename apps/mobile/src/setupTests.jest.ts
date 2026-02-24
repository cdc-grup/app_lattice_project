import { jest } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { LocationCallback, LocationOptions } from 'expo-location';

// General react-native mocks
// Removed the problematic NativeAnimatedHelper mock since jest-expo handles most of this

// Expo Location Mock
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', canAskAgain: true })
  ),
  getForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 41.3863, longitude: 2.106 },
    })
  ),
  watchPositionAsync: jest.fn((options: LocationOptions, callback: LocationCallback) => {
    callback({
      coords: {
        latitude: 41.3863,
        longitude: 2.106,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
    return Promise.resolve({ remove: jest.fn() });
  }),
  getLastKnownPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 41.3863, longitude: 2.106 },
    })
  ),
  Accuracy: { High: 4 },
}));

// Expo Haptics Mock
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

// MapLibre Mock
jest.mock('@maplibre/maplibre-react-native', () => ({
  MapView: ({ children }: { children: React.ReactNode }) => children,
  Camera: ({ children }: { children: React.ReactNode }) => children,
  UserLocation: () => null,
  MarkerView: ({ children }: { children: React.ReactNode }) => children,
  setAccessToken: jest.fn(),
  Logger: { setLogCallback: jest.fn() },
  UserTrackingMode: { FollowWithHeading: 'FollowWithHeading' },
}));

// Vector Icons Mock
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// Global fetch mock
global.fetch = jest.fn() as any;
