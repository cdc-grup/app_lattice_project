import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSavedLocations } from '../../hooks/queries/useSavedLocations';
import { colors } from '../../styles/colors';

const GuideItem = ({ title, coords, onPress }: { title: string, coords: [number, number], onPress?: () => void }) => (
  <Pressable 
    onPress={onPress}
    style={({ pressed }) => [
      styles.markerItem,
      pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
    ]}
  >
    <View style={styles.markerInfo}>
      <View style={styles.iconWrapper}>
        <Feather name="map-pin" size={18} color={colors.primary} />
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.markerName} numberOfLines={1}>
          {title || 'Marcador sin nombre'}
        </Text>
        <Text style={styles.markerCoords}>
          {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
        </Text>
      </View>
    </View>
    <Feather name="chevron-right" size={16} color="rgba(255, 255, 255, 0.2)" />
  </Pressable>
);

interface GuidesSectionProps {
  onSeeAll: () => void;
  onSelectMarker: (coords: [number, number], id: number) => void;
}

export const GuidesSection = ({ onSeeAll, onSelectMarker }: GuidesSectionProps) => {
  const { data: savedData, isLoading } = useSavedLocations();

  const displayItems = useMemo(() => {
    if (!savedData?.features) return [];
    return savedData.features.slice(0, 3);
  }, [savedData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Tus lugares</Text>
        <Pressable 
          onPress={onSeeAll}
          style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.seeAllText}>Ver todos</Text>
          <Feather name="chevron-right" size={12} color="rgba(255, 255, 255, 0.2)" />
        </Pressable>
      </View>
      
      <View style={styles.listContent}>
        {displayItems.length > 0 ? (
          displayItems.map((feature: any) => (
            <GuideItem 
              key={feature.properties.id}
              title={feature.properties.label} 
              coords={feature.geometry.coordinates}
              onPress={() => onSelectMarker(feature.geometry.coordinates, feature.properties.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Guarda tus sitios favoritos aquí</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  seeAllText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 2,
  },
  listContent: {
    gap: 8,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  markerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
  },
  markerName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  markerCoords: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 11,
    marginTop: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
