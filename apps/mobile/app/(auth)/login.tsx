import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useSyncTicket, useLogin } from '../../src/services/auth';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [authMode, setAuthMode] = useState<'ticket' | 'account'>('ticket');
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
      router.replace('/(tabs)');
    }
  }, [token, router]);

  const handleSyncAccess = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (authMode === 'ticket') {
      if (!ticketId) {
        Alert.alert('Error', 'Please enter a ticket ID');
        return;
      }

      // Automatically format it as JSON with a mock email for manual ID entry testing
      const payload = JSON.stringify({ code: ticketId, email: `local_${ticketId.toLowerCase()}@example.com` });

      syncTicket.mutate(payload, {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace('/(tabs)');
        },
        onError: (error: any) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Sync Failed', error.message);
        },
      });
    } else {
      if (!email || !password) {
        Alert.alert('Error', 'Email and password are required');
        return;
      }

      login.mutate(
        { email, password },
        {
          onSuccess: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/(tabs)');
          },
          onError: (error: any) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Login Failed', error.message);
          },
        }
      );
    }
  };

  const toggleAuthMode = (mode: 'ticket' | 'account') => {
    Haptics.selectionAsync();
    setAuthMode(mode);
  };

  const isLoading = syncTicket.isPending || login.isPending;

  const handleStartScan = async () => {
    Haptics.selectionAsync();
    if (!permission) {
      await requestPermission();
    }
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
    if (data) {
      setTicketId(data); // Display whatever string we scanned for visual feedback
      syncTicket.mutate(data, {
        onSuccess: () => {
          router.replace('/(tabs)');
        },
        onError: (error: any) => {
          Alert.alert('Sync Failed', error.message);
        }
      });
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Mock QR data
      const mockPayload = JSON.stringify({ code: 'CIRCUIT25', email: 'test_auto_create@example.com' });
      setTicketId('CIRCUIT25 (Mock)');
      syncTicket.mutate(mockPayload, {
        onSuccess: () => {
          router.replace('/(tabs)');
        },
        onError: (error: any) => {
          Alert.alert('Sync Failed', error.message);
        }
      });
    }
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
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28 }} 
            showsVerticalScrollIndicator={false}
          >
            {/* Header section with refined Apple aesthetic */}
            <Animated.View 
              entering={FadeInDown.duration(800).delay(200)}
              className="pt-12 pb-10 items-center"
            >
              <View className="w-20 h-20 mb-8 rounded-[22px] bg-white items-center justify-center shadow-2xl">
                <MaterialCommunityIcons name="speedometer" size={44} color="#000" />
              </View>
              <Text className="text-4xl font-bold text-white tracking-tight mb-3">
                Grid Access
              </Text>
              <Text className="text-base text-white/50 text-center font-medium px-4">
                Connect your race pass or sign in to your pilot profile.
              </Text>
            </Animated.View>

            {/* Premium Segmented Control */}
            <Animated.View 
              entering={FadeInDown.duration(800).delay(400)}
              className="bg-white/5 p-1.5 rounded-2xl mb-10 flex-row border border-white/10 overflow-hidden"
            >
              <Pressable
                onPress={() => toggleAuthMode('ticket')}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={authMode === 'ticket' ? { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } : undefined}
              >
                <Text className={`text-sm font-semibold ${authMode === 'ticket' ? 'text-black' : 'text-white/40'}`}>
                  Ticket Sync
                </Text>
              </Pressable>
              <Pressable
                onPress={() => toggleAuthMode('account')}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={authMode === 'account' ? { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } : undefined}
              >
                <Text className={`text-sm font-semibold ${authMode === 'account' ? 'text-black' : 'text-white/40'}`}>
                  Account
                </Text>
              </Pressable>
            </Animated.View>

            {/* Form Container */}
            <Animated.View 
              layout={Layout.springify()}
              entering={FadeIn.duration(600)}
              className="mb-8"
            >
              {authMode === 'ticket' ? (
                <View key="ticket-form">
                  <View className="bg-white/5 border border-white/10 rounded-2xl mb-6 overflow-hidden">
                    <View className="flex-row items-center px-4 py-3.5">
                      <Feather name="tag" size={20} color={colors.primary} />
                      <TextInput
                        className="flex-1 text-white text-lg font-medium ml-3"
                        value={ticketId}
                        onChangeText={setTicketId}
                        autoCapitalize="characters"
                        placeholder="Ticket ID (e.g. CIRCUIT25)"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        editable={!isLoading}
                      />
                      <Pressable 
                        onPress={handleStartScan}
                        className="bg-white/10 p-2.5 rounded-xl ml-2 active:opacity-70"
                      >
                        <MaterialCommunityIcons name="plus-box" size={22} color="white" />
                      </Pressable>
                    </View>
                  </View>

                  <View className="flex-row items-center px-2 mb-8">
                    <Feather name="help-circle" size={14} color="rgba(255,255,255,0.3)" />
                    <Text className="text-xs text-white/30 ml-2 font-medium">
                      Found on your physical badge or email receipt.
                    </Text>
                  </View>
                </View>
              ) : (
                <View key="account-form">
                  <View className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
                    <View className="flex-row items-center px-4 py-3.5 border-b border-white/5">
                      <Feather name="mail" size={18} color="rgba(255,255,255,0.4)" />
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
                    <View className="flex-row items-center px-4 py-3.5">
                      <Feather name="lock" size={18} color="rgba(255,255,255,0.4)" />
                      <TextInput
                        className="flex-1 text-white text-lg font-medium ml-3"
                        secureTextEntry={!showPassword}
                        placeholder="Password"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        value={password}
                        onChangeText={setPassword}
                        editable={!isLoading}
                      />
                      <Pressable onPress={() => setShowPassword(!showPassword)} className="active:opacity-70">
                        <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="rgba(255,255,255,0.4)" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>

            {/* Footer Actions */}
            <View className="items-center mb-8">
              <Pressable
                className="w-full bg-[#FF3B30] h-14 rounded-2xl items-center justify-center active:opacity-90"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 }}
                onPress={handleSyncAccess}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-bold">
                    {authMode === 'ticket' ? 'Sync Access' : 'Sign In'}
                  </Text>
                )}
              </Pressable>
              
              <Pressable 
                onPress={() => router.push('/(auth)/register')}
                disabled={isLoading}
                className="py-6 active:opacity-70"
              >
                <Text className="text-white/40 text-sm font-medium">
                  Don't have an account? <Text className="text-primary font-bold">Register here</Text>
                </Text>
              </Pressable>
            </View>

            {/* Secondary Actions */}
            <Animated.View 
              entering={FadeInDown.duration(800).delay(600)}
              className="items-center"
            >
              <View className="flex-row items-center w-full my-4">
                <View className="flex-1 h-[0.5px] bg-white/10" />
                <Text className="mx-4 text-xs font-bold text-white/20 uppercase tracking-widest">
                  Secure Access
                </Text>
                <View className="flex-1 h-[0.5px] bg-white/10" />
              </View>

              {/* Native Auth Options */}
              <View className="flex-row w-full gap-x-4 mb-10">
                <Pressable
                  className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/10 h-14 rounded-2xl active:bg-white/10"
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <MaterialCommunityIcons name="apple" size={22} color="white" />
                  <Text className="text-sm font-semibold text-white ml-2">Apple</Text>
                </Pressable>
                <Pressable
                  className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/10 h-14 rounded-2xl active:bg-white/10"
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <MaterialCommunityIcons name="google" size={20} color="white" />
                  <Text className="text-sm font-semibold text-white ml-2">Google</Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
