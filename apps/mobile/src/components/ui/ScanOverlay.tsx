import React from 'react';
import { View } from 'react-native';

interface ScanOverlayProps {
  isScanning: boolean;
}

export const ScanOverlay: React.FC<ScanOverlayProps> = ({ isScanning }) => {
  if (!isScanning) return null;

  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      <View 
        className="w-64 h-64 border-2 border-primary rounded-3xl opacity-50"
        style={{
          borderStyle: 'dashed',
        }}
      />
    </View>
  );
};
