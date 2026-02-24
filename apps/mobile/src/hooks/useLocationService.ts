import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationPermission, PermissionStatus } from './useLocationPermission';

export interface LocationState {
  coords: number[] | null;
  status: PermissionStatus;
  requestPermission: () => Promise<boolean>;
}

/**
 * Hook to handle location tracking and permissions.
 * Provides a reliable coordinate stream even when MapLibre's native tracking fails.
 */
export const useLocationService = (): LocationState => {
  const { status, requestPermission } = useLocationPermission();
  const [userCoords, setUserCoords] = useState<number[] | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    if (status === 'granted') {
      (async () => {
        try {
          // 1. Try to get last known position first (fastest)
          const lastKnown = await Location.getLastKnownPositionAsync();
          if (lastKnown) {
            setUserCoords([lastKnown.coords.longitude, lastKnown.coords.latitude]);
          }

          // 2. Try to get current position (forces a refresh)
          const initial = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          }).catch(() => null);
          
          if (initial) {
            setUserCoords([initial.coords.longitude, initial.coords.latitude]);
          }

          // 3. Start watching for changes
          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000,
              distanceInterval: 1,
            },
            (location) => {
              setUserCoords([location.coords.longitude, location.coords.latitude]);
            }
          );
        } catch (err) {
          console.warn('Location tracking failed to start:', err);
        }
      })();
    }

    return () => {
      subscription?.remove();
    };
  }, [status]);

  return {
    coords: userCoords,
    status,
    requestPermission,
  };
};
