import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Canvas } from '@react-three/fiber/native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';
import { MainARScene } from './MainARScene';
import { CameraPermissionView } from '../ui/CameraPermissionView';

interface AROverlayProps {
  isVisible: boolean;
}

export const AROverlay: React.FC<AROverlayProps> = ({ isVisible }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      opacity.value = withTiming(1, { duration: 500 });
    } else {
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [isVisible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!shouldRender && !isVisible) return null;

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
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <CameraView 
        style={styles.camera} 
        facing="back" 
        onCameraReady={() => setIsCameraReady(true)}
      />
      {isCameraReady && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <MainARScene />
          </Canvas>
        </View>
      )}
    </Animated.View>
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
