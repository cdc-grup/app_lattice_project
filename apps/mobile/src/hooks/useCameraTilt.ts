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
  const [isLandscape, setIsLandscape] = useState(false);
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
        
        // Gamma corresponds to orientation/roll on some sensors
        // We can also detect orientation via sensors or just use pitch thresholds
        // But the most reliable for "horizontal" (landscape) is checking if beta is used in a landscape context
        setPitch(pitchDegrees);

        // Simple orientation detection: if gamma (roll) is > 45 or < -45, it's likely landscape
        // Alternatively, we use pitch (beta) for tilt. 
        // For AR to trigger "horizontal", we want both tilt and landscape.
        const rollDegrees = (data.rotation.gamma * 180) / Math.PI;
        const landscape = Math.abs(rollDegrees) > 45;
        setIsLandscape(landscape);

        if (landscape && pitchDegrees > highThreshold) {
          setArState('AR');
        } else if (!landscape || pitchDegrees < lowThreshold) {
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

  return { pitch, arState, isLandscape };
};
