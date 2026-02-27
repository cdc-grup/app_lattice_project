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
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRegister } from '../../src/services/auth';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { pendingTicketCode, token } = useAuthStore();
  const register = useRegister();

  useEffect(() => {
    if (token) {
      router.replace('/(tabs)');
    }
  }, [token, router]);

  const handleRegister = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!email || !password || !fullName) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Required Fields', 'All fields are mandatory to create your account.');
      return;
    }

    register.mutate({ email, password, fullName }, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (pendingTicketCode) {
          Alert.alert(
            "Account Created", 
            "Your profile is ready and your ticket has been successfully linked.",
            [{ text: "Continue", onPress: () => router.replace('/(tabs)') }]
          );
        } else {
          router.replace('/(tabs)');
        }
      },
      onError: (error: any) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Registration Error', error.message);
      }
    });
  };

  const isLoading = register.isPending;

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28 }} 
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              entering={FadeIn.duration(400)}
              className="mt-6 -ml-2"
            >
              <TouchableOpacity 
                onPress={() => {
                  Haptics.selectionAsync();
                  router.back();
                }} 
                className="w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10"
              >
                <Feather name="chevron-left" size={28} color="white" />
              </TouchableOpacity>
            </Animated.View>

            {/* Header section matching login */}
            <Animated.View 
              entering={FadeInDown.duration(800).delay(100)}
              className="pt-8 pb-10 items-center"
            >
              <View className="w-20 h-20 mb-8 rounded-[22px] bg-white items-center justify-center shadow-2xl">
                <MaterialCommunityIcons name="account-plus" size={44} color="#000" />
              </View>
              <Text className="text-4xl font-bold text-white tracking-tight mb-3">
                Create Profile
              </Text>
              
              {pendingTicketCode ? (
                <View className="bg-primary/20 px-5 py-2.5 rounded-2xl border border-primary/30 mt-3 flex-row items-center">
                   <Feather name="check-circle" size={16} color={colors.primary} />
                   <Text className="text-white text-sm font-bold ml-2">Ticket Ready to Sync</Text>
                </View>
              ) : (
                <Text className="text-base text-white/50 text-center font-medium px-4">
                  Join the elite crew and access real-time race analytics.
                </Text>
              )}
            </Animated.View>

            {/* Form Container matching login style */}
            <Animated.View 
              layout={Layout.springify()}
              entering={FadeIn.duration(600).delay(300)}
              className="mb-8"
            >
              <View className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
                {/* Full Name Input */}
                <View className="flex-row items-center px-4 py-3.5 border-b border-white/5">
                  <Feather name="user" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput 
                    className="flex-1 text-white text-lg font-medium ml-3"
                    autoCapitalize="words" 
                    placeholder="Full Name"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={fullName}
                    onChangeText={setFullName}
                    editable={!isLoading}
                  />
                </View>

                {/* Email Input */}
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
                
                {/* Password Input */}
                <View className="flex-row items-center px-4 py-3.5">
                  <Feather name="lock" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput 
                    className="flex-1 text-white text-lg font-medium ml-3"
                    secureTextEntry={!showPassword} 
                    placeholder="Create Password"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
                className="w-full"
              >
                <View className="bg-white py-4 rounded-2xl items-center justify-center flex-row shadow-xl">
                  {isLoading ? (
                    <ActivityIndicator color="black" />
                  ) : (
                    <Text className="text-black text-base font-bold">Launch Account</Text>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.duration(800).delay(500)}
              className="items-center pb-12"
            >
              <Pressable 
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push('/(auth)/login');
                }}
              >
                <Text className="text-white/40 text-sm font-medium">
                  Already a member? <Text className="text-primary font-bold">Log in here</Text>
                </Text>
              </Pressable>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
