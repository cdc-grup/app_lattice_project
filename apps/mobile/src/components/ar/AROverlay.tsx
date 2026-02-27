import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Canvas } from '@react-three/fiber/native';
import { MainARScene } from './MainARScene';
import { CameraPermissionView } from '../ui/CameraPermissionView';

interface AROverlayProps {
  isVisible: boolean;
}

export const AROverlay: React.FC<AROverlayProps> = ({ isVisible }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);

  useEffect(() => {
    if (isVisible && isCameraReady) {
      // Small delay before mounting the 3D scene once camera is ready
      const timer = setTimeout(() => setMountScene(true), 300);
      return () => clearTimeout(timer);
    } else if (!isVisible) {
      setMountScene(false);
    }
  }, [isVisible, isCameraReady]);

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
      {/* {mountScene && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <MainARScene />
          </Canvas>
        </View>
      )} */}
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
