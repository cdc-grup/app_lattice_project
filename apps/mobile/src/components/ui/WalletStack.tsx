import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ticket } from '../../types/models/auth';
import { TicketCard } from './TicketCard';

const { height } = Dimensions.get('window');
const STACK_OFFSET = 60;
const EXPANDED_OFFSET = 180;

interface WalletStackProps {
  tickets: Ticket[];
}

export const WalletStack: React.FC<WalletStackProps> = ({ tickets }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandProgress = useSharedValue(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    expandProgress.value = withSpring(isExpanded ? 0 : 1, {
      damping: 15,
      stiffness: 100,
    });
  };

  if (tickets.length === 0) return null;

  return (
    <View style={[styles.container, { height: isExpanded ? tickets.length * (EXPANDED_OFFSET + 50) : 450 }]}>
      {tickets.map((ticket, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const translateY = interpolate(
            expandProgress.value,
            [0, 1],
            [index * STACK_OFFSET, index * EXPANDED_OFFSET],
            Extrapolate.CLAMP
          );

          const scale = interpolate(
            expandProgress.value,
            [0, 1],
            [1 - (tickets.length - 1 - index) * 0.05, 1],
            Extrapolate.CLAMP
          );

          const rotateX = interpolate(
            expandProgress.value,
            [0, 1],
            [index === tickets.length - 1 ? 0 : -10, 0],
            Extrapolate.CLAMP
          );

          return {
            transform: [
              { translateY },
              { scale },
              { perspective: 1000 },
              { rotateX: `${rotateX}deg` }
            ],
            zIndex: index,
          };
        });

        return (
          <Pressable 
            key={ticket.id || ticket.code} 
            onPress={toggleExpand}
            style={styles.pressable}
          >
            <Animated.View style={[styles.cardWrapper, animatedStyle]}>
              <TicketCard ticket={ticket} index={index} />
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  pressable: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});
