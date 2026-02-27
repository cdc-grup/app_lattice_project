import React, { useState } from 'react';
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

  if (!isVisible) return null;

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.permissionContainer} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet. Use the existing shared component.
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
