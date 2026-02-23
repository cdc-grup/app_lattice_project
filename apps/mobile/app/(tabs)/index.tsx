import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/hooks/useAuthStore';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-h1 text-white mb-4">Welcome, {user?.fullName || 'Racer'}!</Text>
        <Text className="text-body text-muted text-center">
          The grid is waiting for you. This is the Circuit view placeholder.
        </Text>
      </View>
    </SafeAreaView>
  );
}
