import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSavedLocations } from '../../hooks/queries/useSavedLocations';
import { colors } from '../../styles/colors';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeBlurView } from '../ui/SafeBlurView';

const GuideItem = ({ title, coords, onPress, isLast }: { title: string, coords: [number, number], onPress?: () => void, isLast?: boolean }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      onPressIn={() => scale.value = withSpring(0.98)}
      onPressOut={() => scale.value = withSpring(1)}
      style={({ pressed }) => [
        styles.markerItem,
        !isLast && styles.markerItemBorder,
      ]}
    >
      <Animated.View style={[styles.markerInfo, animatedStyle]}>
        <View style={styles.iconWrapper}>
          <Feather name="map-pin" size={18} color="#FF453A" />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.markerName} numberOfLines={1}>
            {title || 'Marcador sin nombre'}
          </Text>
          <Text style={styles.markerCoords}>
            {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
          </Text>
        </View>
        <Feather name="chevron-right" size={14} color="rgba(255, 255, 255, 0.2)" />
      </Animated.View>
    </Pressable>
  );
};

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
        </Pressable>
      </View>
      
      <View style={styles.listContent}>
        {displayItems.length > 0 ? (
          <View style={styles.cardContainer}>
            {displayItems.map((feature: any, index: number) => (
              <GuideItem 
                key={feature.properties.id}
                title={feature.properties.label} 
                coords={feature.geometry.coordinates}
                onPress={() => onSelectMarker(feature.geometry.coordinates, feature.properties.id)}
                isLast={index === displayItems.length - 1}
              />
            ))}
          </View>
        ) : (
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800).springify()}
            style={styles.emptyContainer}
          >
            <SafeBlurView intensity={20} style={styles.heroCard}>
              <View style={styles.heroIconCircle}>
                <Feather name="star" size={32} color="#FFD60A" />
              </View>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Tus Sitios Favoritos</Text>
                <Text style={styles.heroSubtitle}>
                  Guarda entradas, zonas de descanso o puntos de encuentro para tenerlos siempre a mano.
                </Text>
              </View>
              <Pressable 
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                style={({ pressed }) => [
                  styles.heroButton,
                  pressed && { opacity: 0.8, scale: 0.98 }
                ]}
              >
                <Text style={styles.heroButtonText}>Empezar a guardar</Text>
              </Pressable>
            </SafeBlurView>
          </Animated.View>
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
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  listContent: {
    gap: 0,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  markerItemBorder: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    paddingVertical: 12,
  },
  heroCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 214, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  heroButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  heroButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
