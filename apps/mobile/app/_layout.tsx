import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from "../src/store/useAuthStore";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

import { useAppFonts } from "../src/hooks/useAppFonts";
import * as SplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded: fontsLoaded, error: fontError } = useAppFonts();

  const token = useAuthStore((state) => state.token);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if the fonts are loaded and router is ready before navigating
    if (!fontsLoaded || segments === undefined) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    const timeout = setTimeout(() => {
      if (!token && !inAuthGroup) {
        router.replace("/(auth)/login");
      } else if (token && inAuthGroup) {
        router.replace("/");
      }
    }, 1);

    return () => clearTimeout(timeout);
  }, [token, segments, router, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="index" />
      </Stack>
    </QueryClientProvider>
  );
}
