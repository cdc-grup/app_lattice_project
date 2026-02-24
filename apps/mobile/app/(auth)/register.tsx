import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get the pending ticket code from the store
  const { pendingTicketCode, token, setAuth, setPendingTicketCode, claimTicket } = useAuthStore();

  React.useEffect(() => {
    if (token) {
      router.replace('/(tabs)');
    }
  }, [token]);

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Tots els camps són obligatoris.');
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.31.4.242:3000';
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, ticket_code: pendingTicketCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.user_friendly_message || data?.error?.message || 'Error al registrar-se');
      }

      // Success
      setAuth(data.token, data.user);
      
      // Clear pending
      if (pendingTicketCode) {
        setPendingTicketCode(null);
        Alert.alert(
          "Registrat amb èxit", 
          "El teu compte s'ha creat i l'entrada s'ha associat correctament.",
          [{ text: "Continuar", onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        router.replace('/(tabs)');
      }

    } catch (e: any) {
      Alert.alert('Error de Registre', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1" edges={['bottom', 'left', 'right', 'top']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-0 z-10 w-10 h-10 items-center justify-center">
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            {/* Header */}
            <View className="items-center mb-8 mt-12">
              <MaterialCommunityIcons name="account-plus" size={48} color={colors.primary} className="mb-4" />
              <Text className="text-h2 font-black text-white text-center mb-2">
                Crea un compte
              </Text>
              
              {pendingTicketCode ? (
                <View className="bg-primary/20 px-4 py-2 rounded-xl border border-primary/30 mt-2 flex-row items-center">
                   <MaterialCommunityIcons name="ticket-confirmation" size={16} color={colors.primary} className="mr-2" />
                   <Text className="text-white text-sm font-medium">Entrada Pendent d'Associar</Text>
                </View>
              ) : (
                <Text className="text-small text-muted text-center">
                  Uneix-te per gaudir al màxim del Circuit.
                </Text>
              )}
            </View>

            {/* Form Content */}
            <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 backdrop-blur-lg">
              
              <View className="mb-6">
                <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                  Nom Complet
                </Text>
                <TextInput 
                  className="border-b border-slate-700 text-white text-lg py-3"
                  autoCapitalize="words" 
                  placeholder="Joan Gausí"
                  placeholderTextColor="#4b5563"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                />
              </View>

              <View className="mb-6">
                <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                  Correu Electrònic
                </Text>
                <TextInput 
                  className="border-b border-slate-700 text-white text-lg py-3"
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
                <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                  Contrasenya
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
                onPress={handleRegister}
                disabled={isLoading}
                className="bg-primary py-4 px-6 rounded-xl items-center justify-center shadow-lg shadow-primary/40 active:translate-y-px"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold">
                    REGISTRAR-SE
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              disabled={isLoading}
              className="items-center py-4"
            >
              <Text className="text-muted">Ja tens un compte? <Text className="text-primary font-bold">Inicia Sessió</Text></Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
