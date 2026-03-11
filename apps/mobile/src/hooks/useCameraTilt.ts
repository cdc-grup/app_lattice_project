import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

export const useCameraTilt = () => {
  const [heading, setHeading] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  
  // AR is active when in landscape
  const isVisible = isLandscape;

  useEffect(() => {
    // 1. Compass Heading Observer
    let locationSub: Location.LocationSubscription | null = null;
    
    const watchHeading = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      locationSub = await Location.watchHeadingAsync((data) => {
        setHeading(data.trueHeading !== -1 ? data.trueHeading : data.magHeading);
      });
    };

    if (isVisible) {
      watchHeading();
    }

    return () => {
      if (locationSub) {
        locationSub.remove();
      }
    };
  }, [isVisible]);

  useEffect(() => {
    // 2. Accelerometer Observer for physical device orientation (bypasses OS orientation locks)
    Accelerometer.setUpdateInterval(500); // 500ms is enough for orientation check
    const accelSub = Accelerometer.addListener(({ x, y, z }) => {
      // x approaches 1 or -1 when device is in landscape.
      // y approaches 1 or -1 when device is in portrait.
      // z approaches 1 or -1 when device is laying flat.
      
      const isLayingFlat = Math.abs(z) > 0.8;
      const isHorizontal = Math.abs(x) > 0.65;
      
      if (!isLayingFlat && isHorizontal) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    });

    return () => {
      accelSub.remove();
    };
  }, []);

  return { isVisible, isLandscape, heading };
};
