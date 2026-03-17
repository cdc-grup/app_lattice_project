import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import { SafeBlurView } from '../ui/SafeBlurView';
import * as Haptics from 'expo-haptics';

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}

const ActionButton = ({ icon, label, onPress, color }: ActionButtonProps) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => { scale.value = withSpring(0.9) }}
      onPressOut={() => { scale.value = withSpring(1) }}
      style={styles.actionItem}
    >
      <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
        <SafeBlurView 
          intensity={20} 
          style={[styles.iconCircle, { borderColor: `${color}30` }]}
        >
          <View style={[styles.colorFill, { backgroundColor: color, opacity: 0.1 }]} />
          <Feather name={icon as any} size={24} color={color} />
        </SafeBlurView>
        <Text style={[styles.actionLabel, { color }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

interface SheetFooterActionsProps {
  onFixPin: () => void;
}

export const SheetFooterActions = ({ onFixPin }: SheetFooterActionsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActionButton 
          icon="share-2" 
          label="Enviar" 
          color="#0A84FF"
          onPress={() => console.log('Share location')} 
        />
        <ActionButton 
          icon="map-pin" 
          label="Fijar pin" 
          color="#FF453A"
          onPress={onFixPin} 
        />
        <ActionButton 
          icon="navigation" 
          label="Planear" 
          color="#32D74B"
          onPress={() => console.log('Plan route')} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  colorFill: {
    ...StyleSheet.absoluteFillObject,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  }
});
