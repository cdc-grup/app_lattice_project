import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as LucideIcons from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSyncTicket, useLogin } from '../../src/services/auth';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
export default function LoginScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [authMode, setAuthMode] = useState<'ticket' | 'account'>('ticket');
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (token) {
      router.replace('/(tabs)');
    }
  }, [token, router]);
  const [ticketId, setTicketId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const syncTicket = useSyncTicket();
  const login = useLogin();

  const handleSyncAccess = () => {
    if (authMode === 'ticket') {
      if (!ticketId) {
        Alert.alert('Error', 'Please enter a ticket ID');
        return;
      }

      syncTicket.mutate(ticketId, {
        onSuccess: () => {
          console.log('Syncing access for ticket:', ticketId);
          router.replace('/');
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
            console.log('Login successful for:', email);
            router.replace('/');
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
      setTicketId(data);
      syncTicket.mutate(data, {
        onSuccess: () => {
          console.log('Syncing access for ticket block:', data);
          router.replace('/');
        },
        onError: (error: any) => {
          Alert.alert('Sync Failed', error.message);
        }
      });
    } else {
      Alert.alert('Invalid QR', 'No valid code found.');
    }
  };

  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // In a real application, you'd use a native barcode scanning library to read the static image.
      // Here, we simulate reading a ticket code 'CIRCUIT25' as a placeholder action.
      setTicketId('CIRCUIT25');
      syncTicket.mutate('CIRCUIT25', {
        onSuccess: () => {
          console.log('Syncing access for gallery ticket: CIRCUIT25');
          router.replace('/');
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
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <SafeAreaView className="flex-1 justify-between p-6">
          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="absolute top-4 left-0 z-10 w-10 h-10 items-center justify-center"
            >
              <LucideIcons.ArrowLeft size={24} color="white" strokeWidth={2} />
            </TouchableOpacity>
            <View className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
              <Text className="text-white font-bold">Scan QR Ticket</Text>
            </View>
            <View className="w-12 h-12" />
          </View>
          
          <View className="items-center mb-10">
            <View className="w-64 h-64 border-2 border-primary rounded-3xl bg-transparent" />
            <Text className="text-white text-center mt-6 bg-black/50 px-4 py-2 rounded-full">
              Align QR code within the frame
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1" edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="pt-20 pb-8 items-center">
              <View className="w-16 h-16 mb-6 rounded-2xl bg-primary items-center justify-center shadow-lg shadow-primary/50">
                <LucideIcons.Car size={40} color="white" />
              </View>
              <Text className="text-h1 font-black text-white text-center mb-2">
                Welcome to the Grid
              </Text>
              <Text className="text-small text-muted text-center">
                Sync your pass or login to access race data.
              </Text>
            </View>

            {/* Auth Mode Selector */}
            <View className="bg-black/20 p-1 rounded-2xl mb-8 flex-row border border-white/10">
              <TouchableOpacity
                onPress={() => setAuthMode('ticket')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'ticket' ? 'bg-primary' : ''}`}
              >
                <Text
                  className={`text-small font-medium ${authMode === 'ticket' ? 'text-white' : 'text-muted'}`}
                >
                  Fast Ticket Sync
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode('account')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'account' ? 'bg-primary' : ''}`}
              >
                <Text
                  className={`text-small font-medium ${authMode === 'account' ? 'text-white' : 'text-muted'}`}
                >
                  Account Sync
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className={authMode === 'account' ? 'bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 backdrop-blur-lg' : 'mb-8'}>
              {authMode === 'ticket' ? (
                <View>
                  <View className="mb-6">
                    <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                      Ticket ID
                    </Text>
                    <View className="flex-row items-center border-b border-slate-700 py-1">
                      <TextInput
                        className="flex-1 text-white text-lg py-2"
                        value={ticketId}
                        onChangeText={setTicketId}
                        autoCapitalize="characters"
                        placeholder="EX: CIRCUIT25"
                        placeholderTextColor="#4b5563"
                        editable={!isLoading}
                      />
                      <TouchableOpacity className="p-1" disabled={isLoading} onPress={handleStartScan}>
                        <LucideIcons.QrCode size={24} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="flex-row items-start bg-primary/10 border border-primary/20 p-3 rounded-xl mb-8">
                    <LucideIcons.Info
                      size={16}
                      color="#FF3B30"
                      className="mt-0.5 mr-2"
                    />
                    <Text className="text-tiny text-primary/80 flex-1 leading-relaxed">
                      Use the 8-digit code found on your physical pass or email confirmation.
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleStartScan}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className="w-full aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-[32px] items-center justify-center p-6 relative overflow-hidden"
                  >
                    {/* Viewfinder Corners */}
                    <View className="absolute top-5 left-5 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl opacity-80" />
                    <View className="absolute top-5 right-5 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl opacity-80" />
                    <View className="absolute bottom-5 left-5 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl opacity-80" />
                    <View className="absolute bottom-5 right-5 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl opacity-80" />
                    
                    {/* Center Icon & Copy */}
                    {isLoading ? (
                      <ActivityIndicator size="large" color="#FF3B30" className="mb-6" />
                    ) : (
                      <>
                        <View className="items-center mb-10">
                          <LucideIcons.Ticket size={64} color={colors.primary} strokeWidth={1.5} className="mb-4" />
                        </View>
                        <Text className="text-white font-bold">SYNC ACCESS</Text>
                      </>
                    )}
                    
                    <Text className="text-white font-black text-2xl mb-2 text-center tracking-tight">
                      Scan QR Code
                    </Text>
                    
                    <Text className="text-muted text-center text-sm leading-relaxed px-2">
                      Tap anywhere in the frame to scan your printed QR code or digital pass to sync instantly.
                    </Text>
                  </TouchableOpacity>

                  {/* Secondary CTA */}
                  <TouchableOpacity 
                    onPress={handlePickImage}
                    disabled={isLoading}
                    className="mt-6 flex-row items-center justify-center py-2 px-6"
                    activeOpacity={0.6}
                  >
                    <LucideIcons.ImagePlus size={20} color="#9ca3af" className="mr-2" />
                    <Text className="text-muted font-medium text-base">
                      Upload from Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View className="mb-6">
                    <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                      Email Address
                    </Text>
                    <TextInput
                      className="border-b border-slate-700 text-white text-lg py-3"
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
                    <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                      Password
                    </Text>
                    <TextInput
                      className="border-b border-slate-700 text-white text-lg py-3"
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
                    className="bg-primary py-4 px-6 rounded-xl items-center justify-center shadow-lg shadow-primary/40 active:translate-y-px"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold">LOGIN TO ACCOUNT</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Footer Actions */}
            <View className="items-center gap-y-6">
              <TouchableOpacity className="flex-row items-center" disabled={isLoading}>
                <Text className="text-small text-muted mr-1">Need help finding your ticket?</Text>
                <LucideIcons.ArrowRight size={16} color="#FF3B30" />
              </TouchableOpacity>

              <View className="flex-row items-center w-full py-4 mt-4">
                <View className="flex-1 h-[1px] bg-slate-800" />
                <Text className="text-tiny mx-4 text-slate-500 uppercase tracking-widest">
                  Or continue with
                </Text>
                <View className="flex-1 h-[1px] bg-slate-800" />
              </View>

              <View className="flex-row w-full gap-x-4">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/5 py-3 rounded-xl"
                  disabled={isLoading}
                >
                  <LucideIcons.Apple size={20} color="white" className="mr-2" />
                  <Text className="text-small font-medium text-white">Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/5 py-3 rounded-xl"
                  disabled={isLoading}
                >
                  <LucideIcons.Chrome size={20} color="white" className="mr-2" />
                  <Text className="text-small font-medium text-white">Google</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
