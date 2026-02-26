import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSyncTicket, useLogin } from '../../src/services/auth';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
import { LinearGradient } from 'expo-linear-gradient';

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

  const syncTicket = useSyncTicket();
  const login = useLogin();

  useEffect(() => {
    if (token) {
      router.replace('/(tabs)');
    }
  }, [token, router]);

  const handleSyncAccess = () => {
    if (authMode === 'ticket') {
      if (!ticketId) {
        Alert.alert('Error', 'Please enter a ticket ID');
        return;
      }

      // Automatically format it as JSON with a mock email for manual ID entry testing
      const payload = JSON.stringify({ code: ticketId, email: `local_${ticketId.toLowerCase()}@example.com` });

      syncTicket.mutate(payload, {
        onSuccess: () => {
          router.replace('/(tabs)');
        },
        onError: (error: any) => {
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
            router.replace('/(tabs)');
          },
          onError: (error: any) => {
            Alert.alert('Login Failed', error.message);
          },
        }
      );
    }
  };

  const isLoading = syncTicket.isPending || login.isPending;

  const handleStartScan = async () => {
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
            <TouchableOpacity onPress={() => setIsScanning(false)} className="bg-black/50 w-10 h-10 items-center justify-center rounded-full">
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <View className="bg-black/50 px-4 py-2 rounded-full">
              <Text className="text-white font-bold">Scan QR Ticket</Text>
            </View>
            <View className="w-10" />
          </View>
          <View className="items-center mb-20">
            <View className="w-64 h-64 border-2 border-primary rounded-3xl" />
            <Text className="text-white text-center mt-6 bg-black/50 px-4 py-2 rounded-full">
              Align QR code within the frame
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0A0A0B]">
      <StatusBar style="light" />
      
      {/* Background Decor */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
        <View className="absolute bottom-40 -right-20 w-80 h-80 bg-red-900/10 rounded-full blur-[80px]" />
      </View>

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View className="pt-16 pb-8 items-center">
              <LinearGradient
                colors={['#FF3B30', '#E03028']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-16 h-16 mb-6 rounded-2xl items-center justify-center shadow-lg shadow-primary/40"
              >
                <Feather name="shield" size={32} color="white" />
              </LinearGradient>
              <Text className="text-h1 font-black text-white text-center mb-2">
                Welcome to the Grid
              </Text>
              <Text className="text-small text-slate-400 text-center">
                Sync your pass or login to access race data.
              </Text>
            </View>

            {/* Auth Mode Selector */}
            <View className="bg-white/5 p-1 rounded-2xl mb-8 flex-row border border-white/5">
              <TouchableOpacity
                onPress={() => setAuthMode('ticket')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'ticket' ? 'bg-primary' : ''}`}
              >
                <Text className={`text-small font-bold ${authMode === 'ticket' ? 'text-white' : 'text-slate-400'}`}>
                  Fast Ticket Sync
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode('account')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'account' ? 'bg-primary' : ''}`}
              >
                <Text className={`text-small font-bold ${authMode === 'account' ? 'text-white' : 'text-slate-400'}`}>
                  Account Sync
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-10 shadow-2xl">
              {authMode === 'ticket' ? (
                <View>
                  <View className="relative mb-6">
                    <Text className="text-tiny font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Enter Ticket ID
                    </Text>
                    <View className="flex-row items-center border-b border-slate-700 py-2">
                      <TextInput
                        className="flex-1 text-white text-lg font-medium"
                        value={ticketId}
                        onChangeText={setTicketId}
                        autoCapitalize="characters"
                        placeholder="EX: CIRCUIT25"
                        placeholderTextColor="#4b5563"
                        editable={!isLoading}
                      />
                      <TouchableOpacity onPress={handleStartScan} className="p-2">
                        <MaterialCommunityIcons name="qrcode-scan" size={24} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="flex-row items-start bg-primary/10 border border-primary/20 p-4 rounded-xl mb-8">
                    <Feather name="info" size={16} color={colors.primary} className="mt-0.5 mr-3" />
                    <Text className="text-tiny text-primary/80 flex-1 leading-relaxed font-medium">
                      Use the 8-digit code found on your physical pass or email confirmation.
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleSyncAccess}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className="w-full"
                  >
                    <LinearGradient
                      colors={['#FF3B30', '#E03028']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      className="py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-primary/30"
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <>
                          <Feather name="zap" size={18} color="white" className="mr-2" />
                          <Text className="text-white font-black tracking-widest">SYNC ACCESS</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View className="mb-6">
                    <Text className="text-tiny font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Email Address
                    </Text>
                    <TextInput
                      className="border-b border-slate-700 text-white text-lg py-3 font-medium"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="user@example.com"
                      placeholderTextColor="#4b5563"
                      value={email}
                      onChangeText={setEmail}
                      editable={!isLoading}
                    />
                  </View>
                  <View className="mb-8">
                    <Text className="text-tiny font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Password
                    </Text>
                    <TextInput
                      className="border-b border-slate-700 text-white text-lg py-3 font-medium"
                      secureTextEntry
                      placeholder="••••••••"
                      placeholderTextColor="#4b5563"
                      value={password}
                      onChangeText={setPassword}
                      editable={!isLoading}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleSyncAccess}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#FF3B30', '#E03028']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      className="py-4 rounded-xl items-center justify-center shadow-lg shadow-primary/30"
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white font-black tracking-widest">LOGIN TO ACCOUNT</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Footer Actions */}
            <View className="items-center gap-y-6">
              
              {authMode === 'account' && (
                <TouchableOpacity 
                  onPress={() => router.push('/(auth)/register')}
                  disabled={isLoading}
                  className="py-2"
                >
                  <Text className="text-slate-400">
                    Don't have an account? <Text className="text-primary font-bold">Register here</Text>
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity className="flex-row items-center py-2" disabled={isLoading}>
                <Text className="text-small text-slate-400 mr-2">Need help finding your ticket?</Text>
                <Feather name="arrow-right" size={16} color={colors.primary} />
              </TouchableOpacity>

              <View className="flex-row items-center w-full my-2">
                <View className="flex-1 h-[1px] bg-slate-800" />
                <Text className="text-tiny mx-4 text-slate-500 font-bold uppercase tracking-widest">
                  Or continue with
                </Text>
                <View className="flex-1 h-[1px] bg-slate-800" />
              </View>

              <View className="flex-row w-full gap-x-4">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/10 py-3.5 rounded-xl active:bg-white/10"
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons name="apple" size={20} color="white" className="mr-2" />
                  <Text className="text-small font-bold text-white">Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/10 py-3.5 rounded-xl active:bg-white/10"
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons name="google" size={20} color="white" className="mr-2" />
                  <Text className="text-small font-bold text-white">Google</Text>
                </TouchableOpacity>
              </View>

              {/* AR Status */}
              <View className="mt-4 flex-row items-center px-4 py-2 rounded-full bg-white/5 border border-white/5 mb-8">
                <Feather name="box" size={16} color={colors.primary} className="mr-2" />
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  AR Experience Ready
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
