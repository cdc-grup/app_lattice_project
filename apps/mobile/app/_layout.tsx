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
    // Check if the router is ready before navigating
    // segments can be empty on first load
    if (segments === undefined) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // Use a small timeout to ensure the layout has mounted
    const timeout = setTimeout(() => {
      if (!token && !inAuthGroup) {
        router.replace("/(auth)/login");
      } else if (token && inAuthGroup) {
        router.replace("/");
      }
    }, 1);

    return () => clearTimeout(timeout);
  }, [token, segments, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="index" />
      </Stack>
    </QueryClientProvider>
  );
}
