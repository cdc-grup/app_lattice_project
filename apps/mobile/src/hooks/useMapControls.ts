import { useState, useCallback, useRef } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';

interface MapControlsState {
  camera: React.RefObject<MapLibreGL.CameraRef>;
  followUser: boolean;
  setFollowUser: (follow: boolean) => void;
  handleRecenter: () => Promise<void>;
}

/**
 * Hook to manage map camera controls and user tracking state.
 */
export const useMapControls = (
  userCoords: number[] | null,
  requestPermission: () => Promise<boolean>
): MapControlsState => {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  const [followUser, setFollowUser] = useState(false);

  const handleRecenter = useCallback(async () => {
    try {
      const granted = await requestPermission();
      if (!granted) return;

      // Use independently verified coords if available
      if (userCoords && camera.current) {
        camera.current.setCamera({
          centerCoordinate: userCoords,
          zoomLevel: 19,
          animationDuration: 1000,
        });
        setFollowUser(true);
        return;
      }

      // Fallback: manually get location if no coords yet
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      }).catch(() => null);

      if (location && camera.current) {
        camera.current.setCamera({
          centerCoordinate: [location.coords.longitude, location.coords.latitude],
          zoomLevel: 19,
          animationDuration: 1000,
        });
        setFollowUser(true);
      } else {
        setFollowUser(true);
      }
    } catch (err) {
      console.warn('Manual recenter failed:', err);
      setFollowUser(true);
    }
  }, [requestPermission, userCoords]);

  return {
    camera: camera as React.RefObject<MapLibreGL.CameraRef>,
    followUser,
    setFollowUser,
    handleRecenter,
  };
};
