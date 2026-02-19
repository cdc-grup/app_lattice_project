import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from "../src/store/useAuthStore";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  const token = useAuthStore((state) => state.token);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = (segments[0] as string) === '(auth)';
    
    if (!token && !inAuthGroup) {
      // router.replace("/(auth)/login"); // Enable when login screen is ready
    } else if (token && inAuthGroup) {
      // router.replace("/");
    }
  }, [token, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="index" />
      </Stack>
    </QueryClientProvider>
  );
}
