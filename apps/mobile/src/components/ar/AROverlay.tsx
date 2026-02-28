import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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

interface AROverlayProps {
  isVisible: boolean;
  onExitAR?: () => void;
}

export const AROverlay: React.FC<AROverlayProps> = ({ isVisible, onExitAR }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const hudOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible && isCameraReady) {
      // Small delay before mounting the 3D scene once camera is ready
      // Minimal delay to ensure camera view has rendered its native component
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

  if (!isVisible) return null;

  if (!permission) {
    return <View style={styles.permissionContainer} />;
  }

  if (!permission.granted) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraPermissionView onRequestPermission={requestPermission} />
      </View>
    );
  }

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
              <MainARScene />
            </Canvas>
          </View>
          <Animated.View style={[StyleSheet.absoluteFill, hudAnimatedStyle]} pointerEvents="box-none">
            <ARHUD onExit={onExitAR || (() => {})} />
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
});
