import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { getCategoryMetadata } from '../../utils/poiUtils';
import { typography } from '../../styles/typography';
import { UIPOI } from '../../types/models/poi';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

interface POICarouselCardProps {
  poi: UIPOI;
  onPress: () => void;
  index: number;
}

const POICarouselCard = ({ poi, onPress, index }: POICarouselCardProps) => {
  const metadata = getCategoryMetadata(poi.category);
  const imageUrl = (poi.images && poi.images.length > 0) 
    ? poi.images[0] 
    : 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop';

  return (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).duration(500).springify()}
      style={styles.cardWrapper}
    >
      <Pressable 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
        ]}
      >
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.cardImage} 
          contentFit="cover"
          transition={200}
        />
        
        {/* Gradient Overlay Placeholder via Background Color */}
        <View style={styles.overlay} />

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View 
              style={[styles.categoryBadge, { backgroundColor: `${metadata.color}CC` }]}
            >
              <MaterialCommunityIcons name={metadata.icon as any} size={12} color="white" />
              <Text style={styles.categoryText}>{metadata.label}</Text>
            </View>
            
            <View style={styles.distanceBadge}>
              <Feather name="map-pin" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.distanceText}>300m</Text>
            </View>
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.poiName} numberOfLines={1}>{poi.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Feather name="users" size={12} color="#30D158" />
                <Text style={[styles.statText, { color: '#30D158' }]}>Baja</Text>
              </View>
              <View style={styles.dot} />
              <View style={styles.statItem}>
                <Feather name="star" size={12} color="#FFD60A" />
                <Text style={styles.statText}>4.8</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

interface POICarouselProps {
  pois: UIPOI[];
  onSelectPoi: (poi: UIPOI) => void;
}

export const POICarousel = ({ pois, onSelectPoi }: POICarouselProps) => {
  if (!pois || pois.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {pois.map((poi, index) => (
          <POICarouselCard 
            key={poi.id} 
            poi={poi} 
            index={index}
            onPress={() => onSelectPoi(poi)} 
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 180,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.5,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  distanceText: {
    color: 'white',
    fontSize: 10,
    fontFamily: typography.secondary.medium,
  },
  bottomInfo: {
    gap: 4,
  },
  poiName: {
    color: 'white',
    fontSize: 18,
    fontFamily: typography.primary.bold,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: typography.secondary.bold,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
