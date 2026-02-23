import "../global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_700Bold, 
  Inter_900Black 
} from "@expo-google-fonts/inter";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize QueryClient
const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-Bold": Inter_700Bold,
    "Inter-Black": Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </QueryClientProvider>
  );
}
