import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { useSyncTicket, useLogin } from '../../src/services/auth';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';

export default function LoginScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { mode } = useLocalSearchParams();
  const [authMode, setAuthMode] = useState<'ticket' | 'account'>(mode === 'account' ? 'account' : 'ticket');
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [ticketId, setTicketId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const syncTicket = useSyncTicket();
  const login = useLogin();

  useEffect(() => {
    if (token) {
      router.replace('/(main)');
    }
  }, [token, router]);

  const handleSyncAccess = () => {
    if (authMode === 'ticket') {
      if (!ticketId) {
        Alert.alert('Error', 'Please enter a ticket ID');
        return;
      }
      const payload = JSON.stringify({ code: ticketId, email: `local_${ticketId.toLowerCase()}@example.com` });
      syncTicket.mutate(payload, {
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
    } else {
      if (!email || !password) {
        Alert.alert('Error', 'Email and password are required');
        return;
      }
      login.mutate({ email, password }, {
        onSuccess: () => {
          router.replace('/(main)');
        },
        onError: (error: any) => {
          Alert.alert('Login Failed', error.message);
        }
      });
    }
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

  const toggleAuthMode = (newMode: 'ticket' | 'account') => {
    if (newMode !== authMode) {
      Haptics.selectionAsync();
      setAuthMode(newMode);
    }
  };

  const isLoading = syncTicket.isPending || login.isPending;

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
    <AuthLayout showBack onBack={() => router.back()}>
      {/* Dynamic Header */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(200)}
        className="pt-12 pb-10 items-center"
      >
        <View className="w-20 h-20 mb-8 rounded-[22px] bg-white items-center justify-center shadow-2xl">
          <MaterialCommunityIcons 
            name={mode === 'account' ? "account-key" : (authMode === 'account' ? "account-key" : "speedometer")} 
            size={44} 
            color="#000" 
          />
        </View>
        <Text className="text-4xl font-bold text-white tracking-tight mb-3">
          {mode === 'account' ? 'Sign In' : (authMode === 'account' ? 'Sign In' : 'Grid Access')}
        </Text>
        <Text className="text-base text-white/50 text-center font-medium px-4">
          {mode === 'account' 
            ? 'Access your pilot profile to sync race data.'
            : (authMode === 'account' 
                ? 'Access your pilot profile to sync race data.' 
                : 'Connect your race pass or sign in to your pilot profile.')}
        </Text>
      </Animated.View>

      {/* Premium Segmented Control - Hidden if direct login */}
      {mode !== 'account' ? (
        <Animated.View 
          entering={FadeInDown.duration(800).delay(400)}
          className="bg-white/5 p-1.5 rounded-2xl mb-10 flex-row border border-white/10 overflow-hidden"
        >
          <Pressable
            onPress={() => toggleAuthMode('ticket')}
            className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'ticket' ? 'bg-white' : ''}`}
          >
            <Text className={`text-sm font-semibold ${authMode === 'ticket' ? 'text-black' : 'text-white/40'}`}>
              Ticket Sync
            </Text>
          </Pressable>
          <Pressable
            onPress={() => toggleAuthMode('account')}
            className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'account' ? 'bg-white' : ''}`}
          >
            <Text className={`text-sm font-semibold ${authMode === 'account' ? 'text-black' : 'text-white/40'}`}>
              Account
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}

      {/* Form Container */}
      <Animated.View 
        layout={Layout.springify()}
        entering={FadeIn.duration(600).delay(600)}
        className="mb-8"
      >
        {authMode === 'ticket' ? (
          <View>
            <View className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
              <View className="flex-row items-center px-4 py-4">
                <Feather name="tag" size={20} color="rgba(255,255,255,0.4)" />
                <TextInput 
                  className="flex-1 text-white text-lg font-medium ml-3"
                  placeholder="Enter Ticket Code"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={ticketId}
                  onChangeText={setTicketId}
                  editable={!isLoading}
                />
              </View>
            </View>

            <PremiumButton 
              onPress={handleSyncAccess} 
              label="Sync & Access" 
              isLoading={isLoading} 
              variant="secondary"
              className="mb-4"
            />
            
            <PremiumButton 
              onPress={() => {
                requestPermission();
                setIsScanning(true);
              }} 
              label="Scan QR Code" 
              variant="outline"
              icon="qrcode-scan"
            />
          </View>
        ) : (
          <View>
            <View className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
              <View className="flex-row items-center px-4 py-4 border-b border-white/5">
                <Feather name="mail" size={20} color="rgba(255,255,255,0.4)" />
                <TextInput 
                  className="flex-1 text-white text-lg font-medium ml-3"
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  placeholder="Email address"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>
              <View className="flex-row items-center px-4 py-4">
                <Feather name="lock" size={20} color="rgba(255,255,255,0.4)" />
                <TextInput 
                  className="flex-1 text-white text-lg font-medium ml-3"
                  secureTextEntry={!showPassword} 
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="rgba(255,255,255,0.4)" />
                </Pressable>
              </View>
            </View>

            <PremiumButton 
              onPress={handleSyncAccess} 
              label="Sign In" 
              isLoading={isLoading} 
              variant="primary"
            />
          </View>
        )}
      </Animated.View>

      {/* Footer */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(800)}
        className="items-center pb-12"
      >
        <Pressable 
          onPress={() => router.push('/(auth)/register')}
          className="active:opacity-70"
        >
          <Text className="text-white/40 text-sm font-medium">
            Don't have an account? <Text className="text-primary font-bold">Register here</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthLayout>
  );
}
