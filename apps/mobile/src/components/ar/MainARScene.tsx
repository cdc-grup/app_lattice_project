import React, { useMemo } from 'react';
import { Float } from '@react-three/drei/native';
import { getCategoryMetadata } from '../../utils/poiUtils';

// Haversine distance formula in meters
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Bearing from origin to destination in degrees
const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const l1 = lon1 * Math.PI / 180;
  const l2 = lon2 * Math.PI / 180;

  const y = Math.sin(l2 - l1) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) -
            Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1);
  const theta = Math.atan2(y, x);
  return (theta * 180 / Math.PI + 360) % 360;
};

interface MainARSceneProps {
  userCoords?: number[] | null;
  heading?: number;
  pois?: any[];
  isLandscape?: boolean;
}

export const MainARScene: React.FC<MainARSceneProps> = ({ userCoords, heading = 0, pois = [], isLandscape = false }) => {
  const poiNodes = useMemo(() => {
    if (!userCoords || pois.length === 0) return [];

    const [userLon, userLat] = userCoords;
    const MAX_DISTANCE = 500; // Only show POIs within 500 meters

    return pois.map((poi, idx) => {
      const [poiLon, poiLat] = poi.geometry.coordinates;
      const distance = getDistance(userLat, userLon, poiLat, poiLon);
      
      if (distance > MAX_DISTANCE) return null;

      const bearing = getBearing(userLat, userLon, poiLat, poiLon);
      const angleDiff = bearing - heading;
      const rad = angleDiff * (Math.PI / 180);
      
      // Calculate depth based on distance
      const scaledDistance = Math.min(Math.max(distance / 5, 2), 20); 

      let x = 0;
      let y = (idx % 3) * 0.5 - 0.5; // Stagger to prevent overlaps
      let z = 0;

      // In Three.js: -Z is forward, X is right, Y is up.
      // If the app is locked in portrait but held horizontally (rotated 90deg CW):
      // Physical "Right" is now Screen "Down" (+Y in Three.js terms if not rotated)
      // Physical "Left" is now Screen "Up" (-Y in Three.js terms if not rotated)
      // Physical "Up" is now Screen "Right" (+X)
      // Wait, let's simplify: if we rotate the whole Camera or Group by 90deg, the logic stays the same.
      
      if (isLandscape) {
        // When held in landscape (rotated 90deg clockwise), 
        // the physical "Left/Right" sweep (yaw) moves objects along the screen's long axis (Y in portrait).
        // Since we want them to stay at 'eye level' relative to the Horizon,
        // we map the horizontal angle to the Y axis and keep distance on Z.
        x = 0; 
        y = Math.sin(rad) * scaledDistance; 
        z = -Math.cos(rad) * scaledDistance;
      } else {
        // Portrait: Yaw moves objects along X axis.
        x = Math.sin(rad) * scaledDistance;
        y = (idx % 3) * 0.5 - 0.5;
        z = -Math.cos(rad) * scaledDistance;
      }

      const metadata = getCategoryMetadata(poi.properties.category);
      const color = metadata.color || '#3b82f6';

      return (
        <group key={poi.properties.id || idx} position={[x, y, z]}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </Float>
        </group>
      );
    }).filter(Boolean);
  }, [userCoords, heading, pois, isLandscape]);

  return (
    <group>
      {poiNodes}
    </group>
  );
};
