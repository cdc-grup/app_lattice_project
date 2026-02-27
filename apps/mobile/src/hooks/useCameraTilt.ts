import { useState, useEffect } from 'react';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { Platform } from 'react-native';

export type ARState = '2D' | 'TRANSITION' | 'AR';

interface UseCameraTiltOptions {
  updateInterval?: number;
  lowThreshold?: number; 
  highThreshold?: number; 
}

export const useCameraTilt = (options: UseCameraTiltOptions = {}) => {
  const {
    updateInterval = 100,
    lowThreshold = 30,
    highThreshold = 75,
  } = options;

  const [pitch, setPitch] = useState(0);
  const [arState, setArState] = useState<ARState>('2D');

  useEffect(() => {
    let subscription: any;

    const _subscribe = async () => {
      // Set update interval
      DeviceMotion.setUpdateInterval(updateInterval);

      subscription = DeviceMotion.addListener((data: DeviceMotionMeasurement) => {
        if (!data.rotation) return;

        // In DeviceMotion, beta corresponds to pitch (X-axis rotation)
        // Range is [-pi, pi]. Convert to degrees.
        // We normalize so that 0 is flat and 90 is vertical.
        let pitchDegrees = (data.rotation.beta * 180) / Math.PI;
        
        // Adjust for Android/iOS differences if necessary
        // Typically, beta is 0 when flat and increases as top is tilted up.
        setPitch(pitchDegrees);

        if (pitchDegrees > highThreshold) {
          setArState('AR');
        } else if (pitchDegrees < lowThreshold) {
          setArState('2D');
        } else {
          setArState('TRANSITION');
        }
      });
    };

    _subscribe();

    return () => {
      subscription?.remove();
    };
  }, [updateInterval, lowThreshold, highThreshold]);

  return { pitch, arState };
};
