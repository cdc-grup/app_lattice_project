import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { SharedValue, FadeIn, FadeOut, useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMapStore } from '../../store/useMapStore';
import { getCategoryMetadata } from '../../utils/poiUtils';
import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { SearchFilters } from './SearchFilters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapBottomSheetProps {
  searchBar?: React.ReactNode;
  isSearching?: boolean;
  searchResults?: React.ReactNode;
  discoveryContent?: React.ReactNode;
  poiCarousel?: React.ReactNode;
  translateY: SharedValue<number>;
  activeCategoryId: string | null;
  onSelectCategory: (category: string) => void;
}

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => (
  <SafeBlurView intensity={100} tint="dark" style={[style, styles.blurBackground]}>
    <View style={styles.premiumBorder} />
  </SafeBlurView>
);

export const MapBottomSheet = forwardRef<BottomSheet, MapBottomSheetProps>(({ 
  searchBar,
  isSearching,
  searchResults,
  discoveryContent,
  poiCarousel,
  translateY,
  activeCategoryId,
  onSelectCategory,
}: MapBottomSheetProps, ref) => {
  const insets = useSafeAreaInsets();
  const { selectedPoi, deselect, setNavigating } = useMapStore();
  const scale = useSharedValue(1);

  const snapPoints = useMemo(() => [
    insets.bottom + 100,         // Collapsed
    SCREEN_HEIGHT * 0.45,        // Medium
    SCREEN_HEIGHT - insets.top - 20 // Full
  ], [insets.bottom, insets.top]);

  const metadata = useMemo(() => 
    selectedPoi ? getCategoryMetadata(selectedPoi.category) : null
  , [selectedPoi]);

  const driveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderPoiDetail = () => {
    if (!selectedPoi || !metadata) return null;

    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.poiContainer}>
        {/* POI Header - Simplified (removed close button and category label) */}
        <View style={styles.poiHeader}>
          <View style={styles.poiTitleContainer}>
            <Text style={styles.poiTitle} numberOfLines={2}>{selectedPoi.name}</Text>
          </View>
        </View>

        {/* Action Button - Matching input/filter style */}
        <Animated.View style={[styles.driveButtonWrapper, driveButtonStyle]}>
          <Pressable 
            onPressIn={() => scale.value = withSpring(0.96)}
            onPressOut={() => scale.value = withSpring(1)}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setNavigating(true);
            }}
            style={styles.driveButton}
          >
            <Feather name="navigation" size={20} color="white" />
            <Text style={styles.driveButtonText}>IR AHORA</Text>
          </Pressable>
        </Animated.View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather name="users" size={14} color="rgba(255,255,255,0.4)" />
            <Text style={styles.statValue}>Baja</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="clock" size={14} color="rgba(255,255,255,0.4)" />
            <Text style={styles.statValue}>8:30 - 20:00</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="star" size={14} color="#FFD60A" />
            <Text style={styles.statValue}>4.8</Text>
          </View>
        </View>

        {/* Photos */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.photoList}
        >
          {(selectedPoi.images && selectedPoi.images.length > 0 ? selectedPoi.images : [
            'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=800&auto=format&fit=crop'
          ]).map((img, i) => (
            <Image key={i} source={{ uri: img }} style={styles.photo} contentFit="cover" transition={200} />
          ))}
        </ScrollView>

        {selectedPoi.description && (
          <Text style={styles.description}>{selectedPoi.description}</Text>
        )}
      </Animated.View>
    );
  };

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animatedPosition={translateY}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* TOP BAR: Always visible discovery tools (Search & Filters) */}
        <View style={styles.searchContainer}>
          {searchBar}
        </View>
        
        {!isSearching && (
          <View style={styles.filtersWrapper}>
            <SearchFilters 
              activeCategory={activeCategoryId}
              onSelectCategory={onSelectCategory}
              animatedPosition={translateY}
            />
          </View>
        )}

        {/* Persistent Carousel when filtering, even if a POI is selected */}
        {!isSearching && activeCategoryId && poiCarousel}

        {/* BOTTOM CONTENT: Dynamic swap between Guides/Results and POI Details */}
        <View style={styles.contentWrapper}>
          {isSearching 
            ? searchResults 
            : (selectedPoi ? renderPoiDetail() : discoveryContent)
          }
        </View>

        {/* Dynamic spacer to allow scrolling above the keyboard */}
        <View style={{ height: isSearching ? 400 : insets.bottom + 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  blurBackground: {
    backgroundColor: 'rgba(10, 10, 12, 0.98)', // Highly opaque
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  filtersWrapper: {
    paddingVertical: 12,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  // POI Styles
  poiContainer: {
    paddingTop: 8,
  },
  poiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  poiTitleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  poiTitle: {
    color: 'white',
    fontSize: 26,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontFamily: typography.primary.bold,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driveButtonWrapper: {
    marginTop: 20,
  },
  driveButton: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  driveButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: typography.secondary.medium,
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  photoList: {
    marginTop: 20,
    gap: 12,
    paddingRight: 20,
  },
  photo: {
    width: 240,
    height: 150,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 20,
    fontFamily: typography.secondary.regular,
  },
  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    pointerEvents: 'none',
  },
});
