import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../src/hooks/useAuthStore';
import { colors } from '../src/styles/colors';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const { token, claimTicket, setPendingTicketCode } = useAuthStore();

  if (!permission) {
    // Camera permissions are still loading
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 bg-black items-center justify-center p-6">
        <MaterialCommunityIcons name="camera-off" size={64} color={colors.muted} />
        <Text className="text-white text-xl font-bold mt-4 text-center">Permís de Càmera Necessari</Text>
        <Text className="text-gray-400 text-center mt-2 mb-8">
          Necessitem accés a la càmera per poder escanejar el codi QR de la teva entrada.
        </Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-full"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-lg">Donar Permís</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setIsProcessing(true);

    if (token) {
      // User is logged in, claim directly
      const success = await claimTicket(data);
      setIsProcessing(false);
      
      if (success) {
        Alert.alert(
          "Entrada Afegida", 
          "La teva entrada s'ha associat correctament al teu compte.",
          [{ text: "Veure Perfil", onPress: () => router.push('/profile') }]
        );
      } else {
        Alert.alert(
          "Error", 
          "No s'ha pogut associar l'entrada. És possible que el codi no sigui vàlid o ja estigui en ús.",
          [{ text: "Tornar a intentar", onPress: () => setScanned(false) }]
        );
      }
    } else {
      // User is NOT logged in. Save code and redirect to register.
      setPendingTicketCode(data);
      setIsProcessing(false);
      
      Alert.alert(
        "Inicia Sessió", 
        "Has d'iniciar sessió o registrar-te per guardar la teva entrada.",
        [
          { text: "Cancel·lar", onPress: () => { setScanned(false); setPendingTicketCode(null); }, style: 'cancel' },
          { text: "Continuar", onPress: () => router.push('/register' as any) }
        ]
      );
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          {/* Viewfinder cutout frame */}
          <View className="w-64 h-64 border-2 border-primary rounded-xl relative justify-center items-center">
            {/* Corner styling */}
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl -m-[2px]" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl -m-[2px]" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl -m-[2px]" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl -m-[2px]" />
            
            {/* Custom Scan Line Animation could go here */}
            {isProcessing && <ActivityIndicator size="large" color={colors.primary} />}
          </View>

          <Text className="text-white text-lg mt-8 font-medium text-center px-8">
            Col·loca el codi QR de la teva entrada dins del quadre.
          </Text>

          {scanned && !isProcessing && (
            <TouchableOpacity 
              className="mt-8 bg-surface px-6 py-3 rounded-full border border-border"
              onPress={() => setScanned(false)}
            >
              <Text className="text-white font-medium">Tornar a escanejar</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}
