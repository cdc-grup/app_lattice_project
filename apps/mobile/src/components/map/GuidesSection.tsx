import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSavedLocations } from '../../hooks/queries/useSavedLocations';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface GuidesSectionProps {
  onSelectMarker: (coords: [number, number], id: number) => void;
}

export const GuidesSection = ({ onSelectMarker }: GuidesSectionProps) => {
  const { isLoading } = useSavedLocations();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  // Favorites section removed as requested. 
  // This component can now be used for future "Guides" or "Recommendations"
  // For now, we return null or a placeholder to keep it scalable.
  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800).springify()}
        style={styles.emptyContainer}
      >
        <Text style={styles.emptyTitle}>Explora el Recinto</Text>
        <Text style={styles.emptySubtitle}>
          Encuentra los mejores puntos de interés, servicios y accesos filtrando por categorías.
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  loadingContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontFamily: typography.secondary.medium,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
});
