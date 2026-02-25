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
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRegister } from '../../src/services/auth';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const { pendingTicketCode, token } = useAuthStore();
  const register = useRegister();

  useEffect(() => {
    if (token) {
      router.replace('/(tabs)');
    }
  }, [token, router]);

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Tots els camps són obligatoris.');
      return;
    }

    register.mutate({ email, password, fullName }, {
      onSuccess: () => {
        if (pendingTicketCode) {
          Alert.alert(
            "Registrat amb èxit", 
            "El teu compte s'ha creat i l'entrada s'ha associat correctament.",
            [{ text: "Continuar", onPress: () => router.replace('/(tabs)') }]
          );
        } else {
          router.replace('/(tabs)');
        }
      },
      onError: (error: any) => {
        Alert.alert('Error de Registre', error.message);
      }
    });
  };

  const isLoading = register.isPending;

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
            
            <TouchableOpacity onPress={() => router.back()} className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            {/* Header */}
            <View className="pt-8 pb-8 items-center">
              <LinearGradient
                colors={['#FF3B30', '#E03028']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-16 h-16 mb-6 rounded-2xl items-center justify-center shadow-lg shadow-primary/40"
              >
                <Feather name="user-plus" size={32} color="white" />
              </LinearGradient>
              <Text className="text-h1 font-black text-white text-center mb-2">
                Join the Grid
              </Text>
              
              {pendingTicketCode ? (
                <View className="bg-primary/20 px-4 py-2 rounded-xl border border-primary/30 mt-2 flex-row items-center">
                   <Feather name="tag" size={16} color={colors.primary} className="mr-2" />
                   <Text className="text-white text-sm font-bold">Ticket Pending Sync</Text>
                </View>
              ) : (
                <Text className="text-small text-slate-400 text-center px-4">
                  Create an account to unlock full race experience and persistent data.
                </Text>
              )}
            </View>

            {/* Form Content */}
            <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 shadow-2xl">
              
              <View className="mb-6">
                <Text className="text-tiny font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Full Name
                </Text>
                <TextInput 
                  className="border-b border-slate-700 text-white text-lg py-3 font-medium"
                  autoCapitalize="words" 
                  placeholder="Joan Gausí"
                  placeholderTextColor="#4b5563"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                />
              </View>

              <View className="mb-6">
                <Text className="text-tiny font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Email Address
                </Text>
                <TextInput 
                  className="border-b border-slate-700 text-white text-lg py-3 font-medium"
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  placeholder="usuari@exemple.com"
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
                onPress={handleRegister}
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
                    <Text className="text-white font-black tracking-widest">CREATE ACCOUNT</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              disabled={isLoading}
              className="items-center pb-12"
            >
              <Text className="text-slate-400">
                Already have an account? <Text className="text-primary font-bold">Log in</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
