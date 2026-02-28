import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { useSyncTicket } from '../../src/services/auth';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const syncTicket = useSyncTicket();
  const { registrationRequired, prefilledEmail } = useAuthStore();

  const handleHaveTicket = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to scan tickets.');
        return;
      }
    }
    setIsScanning(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setIsScanning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    syncTicket.mutate(data, {
      onSuccess: (response) => {
        if (response.requires_setup) {
          router.push('/(auth)/register');
        } else {
          router.replace('/(tabs)');
        }
      },
      onError: (error: any) => {
        Alert.alert('Sync Failed', error.message);
      }
    });
  };

  if (isScanning) {
    return (
      <View style={StyleSheet.absoluteFill} className="bg-black">
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <SafeAreaView className="flex-1 justify-between p-6">
          <View className="flex-row justify-between items-center mt-4">
            <Pressable 
              onPress={() => setIsScanning(false)} 
              className="bg-black/60 w-12 h-12 items-center justify-center rounded-full border border-white/10 active:opacity-70"
            >
              <Feather name="x" size={24} color="white" />
            </Pressable>
            <View className="bg-black/60 px-5 py-2.5 rounded-full border border-white/10">
              <Text className="text-white font-semibold">Scan Ticket QR</Text>
            </View>
            <View className="w-12" />
          </View>
          <View className="items-center mb-24">
            <View className="w-64 h-64 border-2 border-primary/50 rounded-[40px] items-center justify-center">
               <View className="w-48 h-48 border border-white/20 rounded-3xl border-dashed" />
            </View>
            <Text className="text-white/80 text-center mt-8 bg-black/60 px-6 py-3 rounded-full overflow-hidden border border-white/5">
              Center the QR code in the frame
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 px-8">
        
        {/* Progress indicator - Top of screen */}
        <View className="flex-row gap-x-2 mt-4 mb-6">
          <View className={`h-1.5 rounded-full flex-1 ${step >= 1 ? 'bg-primary' : 'bg-white/10'}`} />
          <View className={`h-1.5 rounded-full flex-1 ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
        </View>

        {/* Back Button Row - Below progress bar */}
        <View className="h-12 mb-4">
          {step === 2 && (
            <Pressable 
              onPress={() => {
                Haptics.selectionAsync();
                useAuthStore.getState().clearRegistrationData();
                setStep(1);
              }}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/5 border border-white/10 active:opacity-70"
            >
              <Feather name="chevron-left" size={28} color="white" />
            </Pressable>
          )}
        </View>

        <Animated.View 
          key={step}
          entering={FadeInDown.duration(600)}
          className="flex-1"
        >
          {step === 1 ? (
            <View className="flex-1 justify-center -mt-20">
              <View className="items-center mb-12">
                <View className="w-24 h-24 mb-10 rounded-[28px] bg-white items-center justify-center shadow-2xl">
                  <MaterialCommunityIcons name="ticket-confirmation" size={48} color="#000" />
                </View>
                <Text className="text-5xl font-bold text-white tracking-tighter mb-4 text-center">
                  Circuit Copilot
                </Text>
                <Text className="text-xl text-white/50 text-center font-medium leading-7">
                  Benvingut al circuit. Comencem el teu viatge.
                </Text>
              </View>

              <View className="gap-y-4">
                <Text className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2 text-center">
                  Tens entrada per l'esdeveniment?
                </Text>
                
                <Pressable
                  onPress={handleHaveTicket}
                  className="bg-[#FF3B30] h-16 rounded-2xl flex-row items-center justify-center px-6 active:opacity-90"
                  style={{ shadowColor: '#FF3B30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 }}
                >
                  <MaterialCommunityIcons name="qrcode-scan" size={22} color="white" />
                  <Text className="text-white text-lg font-bold ml-3">SÍ, TINC ENTRADA</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setStep(2);
                  }}
                  className="bg-white/5 border border-white/10 h-16 rounded-2xl items-center justify-center active:bg-white/10"
                >
                  <Text className="text-white/80 text-lg font-bold">NO, ENCARA NO</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="flex-1 justify-center -mt-16">
              <View className="items-center mb-12">
                <View className="w-24 h-24 mb-10 rounded-[28px] bg-white/5 border border-white/10 items-center justify-center shadow-2xl">
                  <Feather name="user" size={42} color="white" />
                </View>
                <Text className="text-4xl font-bold text-white tracking-tighter mb-4 text-center">
                  Ets nou aquí?
                </Text>
                <Text className="text-lg text-white/50 text-center font-medium leading-7">
                  Tria com vols accedir al teu perfil.
                </Text>
              </View>

              <View className="gap-y-4">
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/(auth)/register');
                  }}
                  className="bg-[#FF3B30] h-16 rounded-2xl items-center justify-center active:opacity-90"
                >
                  <Text className="text-white text-lg font-bold">SOC NOU USUARI</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(auth)/login');
                  }}
                  className="bg-white/5 border border-white/10 h-16 rounded-2xl items-center justify-center active:bg-white/10"
                >
                  <Text className="text-white/80 text-lg font-bold">JA TINC COMPTE</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>

        {syncTicket.isPending && (
          <View style={StyleSheet.absoluteFill} className="bg-black/80 items-center justify-center">
            <ActivityIndicator size="large" color="#FF3B30" />
            <Text className="text-white mt-4 font-semibold">Verificant entrada...</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
