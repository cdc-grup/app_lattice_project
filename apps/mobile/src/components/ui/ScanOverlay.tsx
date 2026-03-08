import React from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../styles/colors';

interface ScanOverlayProps {
  isProcessing: boolean;
  scanned: boolean;
  onReset: () => void;
}

export const ScanOverlay = ({ isProcessing, scanned, onReset }: ScanOverlayProps) => {
  const router = useRouter();

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center">
      {/* Viewfinder cutout frame */}
      <View className="w-64 h-64 border-2 border-primary rounded-xl relative justify-center items-center">
        {/* Corner styling */}
        <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl -m-[2px]" />
        <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl -m-[2px]" />
        <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl -m-[2px]" />
        <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl -m-[2px]" />
        
        {isProcessing && <ActivityIndicator size="large" color={colors.primary} />}
      </View>

      <Text className="text-white text-lg mt-8 font-medium text-center px-8">
        Col·loca el codi QR de la teva entrada dins del quadre.
      </Text>

      <Pressable 
        onPress={() => router.back()} 
        className="absolute top-12 left-6 w-10 h-10 rounded-full items-center justify-center bg-black/50 active:opacity-70"
      >
        <Feather name="x" size={24} color="white" />
      </Pressable>

      {scanned && !isProcessing && (
        <Pressable 
          className="mt-8 bg-surface px-6 py-3 rounded-full border border-border active:opacity-90"
          onPress={onReset}
        >
          <Text className="text-white font-medium">Tornar a escanejar</Text>
        </Pressable>
      )}
    </View>
  );
};
