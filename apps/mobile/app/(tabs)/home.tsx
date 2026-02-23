import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-h1 font-black text-white mb-2">Home</Text>
        <Text className="text-small text-muted text-center">
          Race overview and latest updates will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
