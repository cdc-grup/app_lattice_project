import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

interface CameraPermissionViewProps {
  onRequestPermission: () => void;
}

export const CameraPermissionView = ({ onRequestPermission }: CameraPermissionViewProps) => (
  <View className="flex-1 bg-black items-center justify-center p-6">
    <Feather name="camera-off" size={64} color={colors.muted} />
    <Text className="text-white text-xl font-bold mt-4 text-center">Permís de Càmera Necessari</Text>
    <Text className="text-gray-400 text-center mt-2 mb-8">
      Necessitem accés a la càmera per poder escanejar el codi QR de la teva entrada.
    </Text>
    <Pressable 
      className="bg-primary px-6 py-3 rounded-full active:opacity-90"
      onPress={onRequestPermission}
    >
      <Text className="text-white font-bold text-lg">Donar Permís</Text>
    </Pressable>
  </View>
);
