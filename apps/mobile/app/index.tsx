import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../src/hooks/useAuthStore";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // Small delay or ensuring mount to avoid navigation context issues
    const timer = setTimeout(() => {
      if (token) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [token, router]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#FF3B30" size="large" />
    </View>
  );
}
