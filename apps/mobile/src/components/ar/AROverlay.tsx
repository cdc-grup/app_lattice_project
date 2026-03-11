import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Canvas } from '@react-three/fiber/native';
import { MainARScene } from './MainARScene';
import { CameraPermissionView } from '../ui/CameraPermissionView';
import { ARHUD } from './ARHUD';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
} from 'react-native-reanimated';
import { typography } from '../../styles/typography';

// Math helpers
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const l1 = lon1 * Math.PI / 180;
  const l2 = lon2 * Math.PI / 180;
  const y = Math.sin(l2 - l1) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1);
  const theta = Math.atan2(y, x);
  return (theta * 180 / Math.PI + 360) % 360;
};

interface AROverlayProps {
  isVisible: boolean;
  onExitAR?: () => void;
  userCoords?: number[] | null;
  heading?: number;
  pois?: any[];
  isLandscape?: boolean;
}

export const AROverlay: React.FC<AROverlayProps> = ({ isVisible, onExitAR, userCoords, heading = 0, pois = [], isLandscape }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const hudOpacity = useSharedValue(0);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (isVisible && isCameraReady) {
      const timer = setTimeout(() => {
        setMountScene(true);
        hudOpacity.value = withTiming(1, { duration: 600 });
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isVisible) {
      setMountScene(false);
      hudOpacity.value = 0;
    }
  }, [isVisible, isCameraReady, hudOpacity]);

  const hudAnimatedStyle = useAnimatedStyle(() => ({
    opacity: hudOpacity.value,
    transform: [{ translateY: withTiming(hudOpacity.value === 1 ? 0 : 20, { duration: 600 }) }]
  }));

  // Filter POIs by distance for AR - MUST BE AT TOP LEVEL BEFORE EARLY RETURNS
  const activePois = React.useMemo(() => {
    if (!userCoords || !pois.length) return [];
    const [userLon, userLat] = userCoords;
    // For debugging/testing, we increased radius to 1km
    return pois.filter(poi => {
      const [poiLon, poiLat] = poi.geometry.coordinates;
      const dist = getDistance(userLat, userLon, poiLat, poiLon);
      return dist < 1000;
    });
  }, [userCoords, pois]);

  if (!isVisible) return null;
  if (!permission) return <View style={styles.permissionContainer} />;
  if (!permission.granted) return <View style={StyleSheet.absoluteFill}><CameraPermissionView onRequestPermission={requestPermission} /></View>;

  const isScanning = activePois.length === 0;

  // Calculate 2D Screen Overlay Positions for Text Labels
  const render2DLabels = (poisToRender: any[]) => {
    if (!userCoords || poisToRender.length === 0) return null;
    const [userLon, userLat] = userCoords;
    const FOV = 60; // Camera Field of View
    
    return poisToRender.map((poi, idx) => {
      const [poiLon, poiLat] = poi.geometry.coordinates;
      const distance = getDistance(userLat, userLon, poiLat, poiLon);

      const bearing = getBearing(userLat, userLon, poiLat, poiLon);
      let angleDiff = bearing - heading;
      
      // Normalize to -180...180
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      // Only show if it's within the front hemisphere
      if (Math.abs(angleDiff) > 90) return null;

      // Map Angle to X Pixel Coordinates (center = width/2)
      let xPos = 0;
      let yPos = 0;
      let yOffset = (idx % 3) * 30 - 30; // Stagger to prevent overlaps
      
      if (isLandscape) {
        // When physically in landscape, horizontal movement (angleDiff) 
        // maps to the screen's long axis (Y in portrait layout).
        // Vertical staggering (yOffset) maps to the screen's short axis (X).
        
        // Physical horizontal center: center of long edge
        const centerOffset = (angleDiff / (FOV / 2)) * (height / 2);
        const screenYPos = (height / 2) + centerOffset;
        
        // Physical vertical center: center of short edge
        const screenXPos = (width / 2) + yOffset - 50;

        return (
          <View 
            key={`2d-label-${poi.properties.id}`} 
            style={{ 
              position: 'absolute', 
              top: screenYPos - 30, // center 60px height (horizontal bubble if rotated)
              left: screenXPos - 60, // center 120px width
              width: 120, 
              alignItems: 'center',
              transform: [{ rotate: '90deg' }]
            }}
          >
            <View style={styles.labelBubble}>
              <Text style={styles.labelText} numberOfLines={1}>{poi.properties.name}</Text>
              <Text style={styles.distanceText}>{Math.round(distance)}m</Text>
            </View>
          </View>
        );
      } else {
        xPos = (angleDiff / (FOV / 2)) * (width / 2) + (width / 2);
        yPos = (height / 2) + yOffset - 50;

        return (
          <View 
            key={`2d-label-${poi.properties.id}`} 
            style={{ 
              position: 'absolute', 
              left: xPos - 60, // center 120px width
              top: yPos,
              width: 120, 
              alignItems: 'center' 
            }}
          >
            <View style={styles.labelBubble}>
              <Text style={styles.labelText} numberOfLines={1}>{poi.properties.name}</Text>
              <Text style={styles.distanceText}>{Math.round(distance)}m</Text>
            </View>
          </View>
        );
      }
    });
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <CameraView 
        style={styles.camera} 
        facing="back" 
        onCameraReady={() => setIsCameraReady(true)}
      />
      {mountScene && (
        <>
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Canvas>
              <ambientLight intensity={Math.PI / 2} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
              <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
              <MainARScene 
                userCoords={userCoords}
                heading={heading}
                pois={activePois}
                isLandscape={isLandscape}
              />
            </Canvas>
          </View>
          
          {/* 2D Projection Overlay */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {render2DLabels(activePois)}
          </View>

          <Animated.View style={[StyleSheet.absoluteFill, hudAnimatedStyle]} pointerEvents="box-none">
            <ARHUD 
              onExit={onExitAR || (() => {})} 
              isLandscape={isLandscape}
              isScanning={isScanning}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  permissionContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  labelBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  labelText: {
    color: 'white',
    fontSize: 12,
    fontFamily: typography.primary.bold,
  },
  distanceText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontFamily: typography.primary.semiBold,
  }
});
