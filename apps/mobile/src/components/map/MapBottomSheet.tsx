import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';
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

  const snapPoints = useMemo(() => [
    insets.bottom + 100,         // Collapsed
    SCREEN_HEIGHT * 0.45,        // Medium
    SCREEN_HEIGHT - insets.top - 20 // Full
  ], [insets.bottom, insets.top]);

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

        {/* Persistent Carousel when filtering */}
        {!isSearching && activeCategoryId && poiCarousel}

        {/* BOTTOM CONTENT: Guides/Results */}
        <View style={styles.contentWrapper}>
          {isSearching ? searchResults : discoveryContent}
        </View>

        {/* Dynamic spacer to allow scrolling above the keyboard */}
        <View style={{ height: isSearching ? 400 : insets.bottom + 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

MapBottomSheet.displayName = 'MapBottomSheet';

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
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  poiTitle: {
    color: 'white',
    fontSize: 22,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  poiSubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontFamily: typography.secondary.medium,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    height: 90,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  actionCardPrimary: {
    backgroundColor: colors.primary,
  },
  actionCardLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontFamily: typography.secondary.bold,
    marginTop: 4,
  },
  actionCardValue: {
    color: 'white',
    fontSize: 15,
    fontFamily: typography.primary.bold,
    marginTop: 2,
  },
  photoList: {
    marginTop: 8,
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
