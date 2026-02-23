import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScheduleScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-h1 font-black text-white mb-2">Schedule</Text>
        <Text className="text-small text-muted text-center">
          Race weekend schedule and session times.
        </Text>
      </View>
    </SafeAreaView>
  );
}
