import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout, SlideOutLeft } from 'react-native-reanimated';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { useSyncTicket } from '../../src/services/auth';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';

/**
 * Step Content Component
 * Encapsulates the visual representation of each step for scalability.
 */
interface StepProps {
  icon: string;
  iconLibrary: 'feather' | 'material';
  title: string;
  subtitle: string;
  primaryAction: {
    label: string;
    icon?: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

const WelcomeStep = ({ icon, iconLibrary, title, subtitle, primaryAction, secondaryAction }: StepProps) => (
  <Animated.View 
    entering={FadeInDown.duration(600)}
    exiting={SlideOutLeft.duration(400)}
    className="flex-1 justify-center"
  >
    <View className="items-center mb-12">
      <View className="w-24 h-24 mb-10 rounded-[28px] bg-white items-center justify-center shadow-2xl">
        {iconLibrary === 'material' ? (
          <MaterialCommunityIcons name={icon as any} size={48} color="#000" />
        ) : (
          <Feather name={icon as any} size={42} color="#000" />
        )}
      </View>
      <Animated.Text 
        entering={FadeInDown.delay(200).duration(600)}
        className="text-4xl font-bold text-white tracking-tighter mb-4 text-center"
      >
        {title}
      </Animated.Text>
      <Animated.Text 
        entering={FadeInDown.delay(300).duration(600)}
        className="text-lg text-white/50 text-center font-medium leading-7 px-4"
      >
        {subtitle}
      </Animated.Text>
    </View>

    <View className="gap-y-4">
      <PremiumButton
        onPress={primaryAction.onPress}
        label={primaryAction.label}
        icon={primaryAction.icon}
        variant="primary"
      />

      {secondaryAction ? (
        <PremiumButton
          onPress={secondaryAction.onPress}
          label={secondaryAction.label}
          variant="outline"
        />
      ) : null}
    </View>
  </Animated.View>
);

export default function WelcomeScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const syncTicket = useSyncTicket();

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
          router.replace('/(main)');
        }
      },
      onError: (error: any) => {
        Alert.alert('Sync Failed', error.message);
      }
    });
  };

  const currentStepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <WelcomeStep
            key="step-1"
            icon="flag-checkered"
            iconLibrary="material"
            title="Benvingut"
            subtitle="Estàs al Circuit de Barcelona-Catalunya. Prepara't per a la millor experiència de carrera."
            primaryAction={{
              label: 'COMENÇAR',
              onPress: () => setStep(2)
            }}
          />
        );
      case 2:
        return (
          <WelcomeStep
            key="step-2"
            icon="ticket-confirmation"
            iconLibrary="material"
            title="Tens la teva entrada?"
            subtitle="Escaneja el codi per activar el teu Copilot i trobar el teu seient ràpidament."
            primaryAction={{
              label: 'SÍ, LA TINC AQUÍ',
              icon: 'qrcode-scan',
              onPress: handleHaveTicket
            }}
            secondaryAction={{
              label: 'ENCARA NO LA TINC',
              onPress: () => setStep(3)
            }}
          />
        );
      case 3:
        return (
          <WelcomeStep
            key="step-3"
            icon="user"
            iconLibrary="feather"
            title="Accedeix al teu compte"
            subtitle="Inicia sessió o crea un compte per guardar les teves preferències i historial."
            primaryAction={{
              label: 'SOC NOU USUARI',
              onPress: () => router.push('/(auth)/register')
            }}
            secondaryAction={{
              label: 'JA TINC COMPTE',
              onPress: () => router.push({ pathname: '/(auth)/login', params: { mode: 'account' } })
            }}
          />
        );
      default:
        return null;
    }
  }, [step]);

  if (isScanning) {
    return (
      <View style={StyleSheet.absoluteFill} className="bg-black">
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <AuthLayout 
          showBack 
          onBack={() => setIsScanning(false)} 
          isScrollable={false}
          transparent
        >
          <View className="items-center mb-24 flex-1 justify-center">
            <View className="w-64 h-64 border-2 border-[#FF3B30]/50 rounded-[40px] items-center justify-center">
               <View className="w-48 h-48 border border-white/20 rounded-3xl border-dashed" />
            </View>
            <Text className="text-white/80 text-center mt-8 bg-black/60 px-6 py-3 rounded-full overflow-hidden border border-white/5">
              Center the QR code in the frame
            </Text>
          </View>
        </AuthLayout>
      </View>
    );
  }

  return (
    <AuthLayout 
      step={step} 
      totalSteps={3} 
      showBack={step > 1} 
      onBack={() => {
        if (step === 3) useAuthStore.getState().clearRegistrationData();
        setStep((prev) => (prev - 1) as 1 | 2 | 3);
      }}
    >
      <Animated.View layout={Layout.springify()} className="flex-1">
        {currentStepContent}
      </Animated.View>

      {syncTicket.isPending ? (
        <View style={StyleSheet.absoluteFill} className="bg-black/80 items-center justify-center">
          <ActivityIndicator size="large" color="#FF3B30" />
          <Text className="text-white mt-4 font-semibold">Verificant entrada...</Text>
        </View>
      ) : null}
    </AuthLayout>
  );
}
