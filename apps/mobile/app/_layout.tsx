import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeModules } from 'react-native';
import { useAppFonts } from '../src/hooks/useAppFonts';
import '../global.css';

const queryClient = new QueryClient();

// Catch unhandled promise rejections that might cause crashes (like KeepAwake failure)
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
    if (error?.message?.includes('keep awake') || error?.message?.includes('KeepAwake')) {
      console.warn('[KeepAwake] Suppressed activation error:', error.message);
      return;
    }
    originalHandler(error, isFatal);
  });
}

export default function RootLayout() {
  const { loaded, error } = useAppFonts();

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="light" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
