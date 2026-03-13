import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSavedLocations } from '../../hooks/queries/useSavedLocations';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface GuidesSectionProps {
  onSelectMarker: (coords: [number, number], id: number) => void;
  onSeeAll?: () => void;
}

export const GuidesSection = ({ onSelectMarker, onSeeAll }: GuidesSectionProps) => {
  const { data: savedData, isLoading } = useSavedLocations();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const hasSaved = savedData?.features && savedData.features.length > 0;

  return (
    <View style={styles.container}>
      {hasSaved ? (
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Tus Marcadores</Text>
          <Pressable onPress={onSeeAll} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </Pressable>
        </View>
      ) : null}

      {!hasSaved ? (
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800).springify()}
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyTitle}>Explora el Recinto</Text>
          <Text style={styles.emptySubtitle}>
            Encuentra los mejores puntos de interés, servicios y accesos filtrando por categorías.
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.savedList}>
          {savedData.features.slice(0, 3).map((f: any) => (
            <Pressable 
              key={f.properties.id} 
              style={styles.savedItem}
              onPress={() => onSelectMarker(f.geometry.coordinates, f.properties.id)}
            >
              <View style={styles.savedIconCircle}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD60A" />
              </View>
              <Text style={styles.savedLabel} numberOfLines={1}>{f.properties.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  seeAllBtn: {
    padding: 4,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: typography.secondary.bold,
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
  savedList: {
    gap: 8,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  savedIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 214, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedLabel: {
    color: 'white',
    fontSize: 14,
    fontFamily: typography.secondary.medium,
    flex: 1,
  }
});
