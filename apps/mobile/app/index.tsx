import { useEffect, useState } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../src/hooks/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const token = useAuthStore((state) => state.token);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationState?.key) {
      setIsReady(true);
    }
  }, [navigationState?.key]);

  useEffect(() => {
    if (isReady) {
      if (token) {
        router.replace('/(main)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }
  }, [isReady, token, router]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#FF3B30" size="large" />
    </View>
  );
}
