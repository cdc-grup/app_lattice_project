import React from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Pressable, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../styles/colors';

interface AuthLayoutProps {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
  isScrollable?: boolean;
  transparent?: boolean;
}

export const AuthLayout = ({ 
  children, 
  step, 
  totalSteps = 3, 
  onBack, 
  showBack = false,
  isScrollable = true,
  transparent = false
}: AuthLayoutProps) => {
  const navigationRow = (
    <View className="z-50 mb-2">
      {/* Progress Bar at the top */}
      {step ? (
        <View className="flex-row gap-x-2 mb-6 mt-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View 
              key={i} 
              className={`h-1.5 rounded-full flex-1 ${step >= i + 1 ? 'bg-[#FF3B30]' : 'bg-white/10'}`} 
            />
          ))}
        </View>
      ) : null}

      {/* Button Row below */}
      <View className="h-12 justify-center">
        {showBack ? (
          <Pressable 
            onPress={() => {
              Haptics.selectionAsync();
              if (onBack) onBack();
            }}
            hitSlop={20}
            className="w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 active:opacity-70 active:scale-90"
          >
            <Feather name="chevron-left" size={28} color="white" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${transparent ? '' : 'bg-[#050505]'}`}>
      <StatusBar style="light" />
      {!transparent && (
        <LinearGradient 
          colors={[colors.background, colors.black]} 
          style={StyleSheet.absoluteFill}
        />
      )}
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className="flex-1"
        >
          <View className="flex-1 px-7">
            {navigationRow}
            
            {isScrollable ? (
              <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>
            ) : (
              <View className="flex-1">
                {children}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
