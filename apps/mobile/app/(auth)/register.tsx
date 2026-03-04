import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useRegister } from '../../src/services/auth';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { pendingTicketCode, token, registrationRequired, prefilledEmail } = useAuthStore();
  const register = useRegister();

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  useEffect(() => {
    if (token) {
      router.replace('/(main)');
    }
  }, [token, router]);

  const handleRegister = async () => {
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
            [{ text: "Continue", onPress: () => router.replace('/(main)') }]
          );
        } else {
          router.replace('/(main)');
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
    <AuthLayout 
      showBack 
      onBack={() => {
        useAuthStore.getState().clearRegistrationData();
        router.back();
      }}
    >
      {/* Header section matching login */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100)}
        className="pt-8 pb-10 items-center"
      >
        <View className="w-20 h-20 mb-8 rounded-[22px] bg-white items-center justify-center shadow-2xl">
          <MaterialCommunityIcons name="account-plus" size={44} color="#000" />
        </View>
        <Text className="text-4xl font-bold text-white tracking-tight mb-3">
          {registrationRequired ? 'Finish Profile' : 'Create Profile'}
        </Text>
        
        {registrationRequired ? (
          <View className="bg-primary/20 px-5 py-2.5 rounded-2xl border border-primary/30 mt-3 flex-row items-center">
             <Feather name="check-circle" size={16} color={colors.primary} />
             <Text className="text-white text-sm font-bold ml-2">Ticket Scanned! Set Password</Text>
          </View>
        ) : pendingTicketCode ? (
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

      {/* Form Container */}
      <Animated.View 
        layout={Layout.springify()}
        entering={FadeIn.duration(600).delay(300)}
        className="mb-8"
      >
        <View className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
          {/* Full Name Input */}
          <View className="flex-row items-center px-4 py-4 border-b border-white/5">
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
          <View className="flex-row items-center px-4 py-4 border-b border-white/5">
            <Feather name="mail" size={18} color="rgba(255,255,255,0.4)" />
            <TextInput 
              className="flex-1 text-white text-lg font-medium ml-3"
              keyboardType="email-address" 
              autoCapitalize="none" 
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading && !registrationRequired}
            />
          </View>
          
          {/* Password Input */}
          <View className="flex-row items-center px-4 py-4">
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
            <Pressable onPress={() => setShowPassword(!showPassword)} className="active:opacity-70">
              <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="rgba(255,255,255,0.4)" />
            </Pressable>
          </View>
        </View>

        <PremiumButton 
          onPress={handleRegister} 
          label="Launch Account" 
          isLoading={isLoading} 
          variant="secondary"
        />
      </Animated.View>

      {/* Footer */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(500)}
        className="items-center pb-12"
      >
        <Pressable 
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/(auth)/login');
          }}
          className="active:opacity-70"
        >
          <Text className="text-white/40 text-sm font-medium">
            Already a member? <Text className="text-primary font-bold">Log in here</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthLayout>
  );
}
