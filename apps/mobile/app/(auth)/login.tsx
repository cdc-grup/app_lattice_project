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
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSyncTicket, useLogin } from '../../src/services/auth';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';

export default function LoginScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  
  // Estados
  const [authMode, setAuthMode] = useState<'ticket' | 'account'>('ticket');
  const [isScanning, setIsScanning] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hooks de Cámara y Auth
  const [permission, requestPermission] = useCameraPermissions();
  const syncTicket = useSyncTicket();
  const login = useLogin();

  const isLoading = syncTicket.isPending || login.isPending;

  useEffect(() => {
    if (token) {
      router.replace('/(tabs)');
    }
  }, [token]);

  const handleStartScan = async () => {
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
        onError: (error: any) => Alert.alert('Sync Failed', error.message)
      });
    }
  };

  const handleSyncAccess = () => {
    if (authMode === 'ticket') {
      if (!ticketId) return Alert.alert('Error', 'Please enter a ticket ID');
      syncTicket.mutate(ticketId, {
        onError: (error: any) => Alert.alert('Sync Failed', error.message),
      });
    } else {
      if (!email || !password) return Alert.alert('Error', 'Email and password are required');
      login.mutate({ email, password }, {
        onError: (error: any) => Alert.alert('Login Failed', error.message),
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
      const code = 'CIRCUIT25';
      setTicketId(code);
      syncTicket.mutate(code, {
        onError: (error: any) => Alert.alert('Sync Failed', error.message)
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
          <TouchableOpacity 
            onPress={() => setIsScanning(false)} 
            className="w-10 h-10 items-center justify-center bg-black/40 rounded-full"
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View className="items-center mb-10">
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
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1" edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View className="pt-20 pb-8 items-center">
              <View className="w-16 h-16 mb-6 rounded-2xl bg-primary items-center justify-center shadow-lg shadow-primary/50">
                <Feather name="truck" size={40} color="white" />
              </View>
              <Text className="text-h1 font-black text-white text-center mb-2">Welcome to the Grid</Text>
              <Text className="text-small text-muted text-center">Sync your pass or login to access race data.</Text>
            </View>

            {/* Auth Mode Selector */}
            <View className="bg-black/20 p-1 rounded-2xl mb-8 flex-row border border-white/10">
              <TouchableOpacity
                onPress={() => setAuthMode('ticket')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'ticket' ? 'bg-primary' : ''}`}
              >
                <Text className={`text-small font-medium ${authMode === 'ticket' ? 'text-white' : 'text-muted'}`}>Fast Ticket Sync</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode('account')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'account' ? 'bg-primary' : ''}`}
              >
                <Text className={`text-small font-medium ${authMode === 'account' ? 'text-white' : 'text-muted'}`}>Account Sync</Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className={authMode === 'account' ? 'bg-white/5 border border-white/10 p-6 rounded-3xl mb-8' : 'mb-8'}>
              {authMode === 'ticket' ? (
                <View>
                  <View className="mb-6">
                    <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">Ticket ID</Text>
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
                        <Feather name="maximize" size={24} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleStartScan}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    className="w-full aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-[32px] items-center justify-center p-6 relative overflow-hidden"
                  >
                    <View className="absolute top-5 left-5 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl opacity-80" />
                    <View className="absolute top-5 right-5 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl opacity-80" />
                    <View className="absolute bottom-5 left-5 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl opacity-80" />
                    <View className="absolute bottom-5 right-5 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl opacity-80" />
                    
                    {isLoading ? (
                      <ActivityIndicator size="large" color="#FF3B30" />
                    ) : (
                      <View className="items-center">
                        <Feather name="tag" size={64} color={colors.primary} className="mb-4" />
                        <Text className="text-white font-black text-2xl mb-2 text-center">Scan QR Code</Text>
                        <Text className="text-muted text-center text-sm px-2">Tap to scan instantly</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handlePickImage} disabled={isLoading} className="mt-6 flex-row items-center justify-center">
                    <Feather name="image" size={20} color="#9ca3af" className="mr-2" />
                    <Text className="text-muted font-medium">Upload from Gallery</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TextInput
                    className="border-b border-slate-700 text-white text-lg py-3 mb-6"
                    placeholder="Email Address"
                    placeholderTextColor="#4b5563"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                  />
                  <TextInput
                    className="border-b border-slate-700 text-white text-lg py-3 mb-8"
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#4b5563"
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={handleSyncAccess}
                    disabled={isLoading}
                    className="bg-primary py-4 rounded-xl items-center"
                  >
                    {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">LOGIN TO ACCOUNT</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Footer */}
            <View className="items-center mt-4">
              <View className="flex-row items-center w-full mb-8">
                <View className="flex-1 h-[1px] bg-slate-800" />
                <Text className="text-tiny mx-4 text-slate-500 uppercase">Or continue with</Text>
                <View className="flex-1 h-[1px] bg-slate-800" />
              </View>
              <View className="flex-row w-full gap-x-4">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/10 py-3 rounded-xl">
                  <Feather name="smartphone" size={20} color="white" />
                  <Text className="ml-2 text-white">Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/10 py-3 rounded-xl">
                  <Feather name="chrome" size={20} color="white" />
                  <Text className="ml-2 text-white">Google</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}