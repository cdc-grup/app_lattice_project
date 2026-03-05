import React, { useMemo, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { SearchBar } from '../../src/components/SearchBar';
import { POICard } from '../../src/components/POICard';
import { colors } from '../../src/styles/colors';
import { usePOIs } from '../../src/hooks/queries/usePOIs';
import { useCategories } from '../../src/hooks/queries/useCategories';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { useCameraTilt } from '../../src/hooks/useCameraTilt';
import { AROverlay } from '../../src/components/ar/AROverlay';
import { Feather } from '@expo/vector-icons';
import { useMapStore } from '../../src/store/useMapStore';
import { MapContent } from '../../src/components/map/MapContent';
import { MapBottomSheet } from '../../src/components/map/MapBottomSheet';
import { QuickActions } from '../../src/components/map/QuickActions';
import { GuidesSection } from '../../src/components/map/GuidesSection';
import { SheetFooterActions } from '../../src/components/map/SheetFooterActions';
import { DIRECT_ACCESS_CATEGORIES } from '../../src/utils/poiUtils';

// Configure MapLibre
MapLibreGL.setAccessToken(null);
MapLibreGL.Logger.setLogCallback((log) => {
  const msg = typeof log.message === 'string' ? log.message : '';
  if (msg.includes('Failed to obtain last location update') || msg.includes('Last location unavailable')) return true;
  return false;
});

const styles = StyleSheet.create({
  mapContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  map: { flex: 1 },
  overlay: { 
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 90,
  },
  filtersContainer: { paddingHorizontal: 16 },
});

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function MapIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { coords: userCoords, status: locationStatus, requestPermission } = useLocationService();
  const { selectedPoiId, deselect, triggerRecenter, selectPoi } = useMapStore();
  const { data: categories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);

  const { isVisible: isARVisible } = useCameraTilt();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Keep track of the bottom sheet's true absolute Y position on screen (0 = top of screen)
  // We initialize it to where the collapsed state roughly is so it doesn't jump
  // Collapsed height = insets.bottom + 85. So position is SCREEN_HEIGHT - collapsedHeight
  const sheetPosition = useSharedValue(SCREEN_HEIGHT - (insets.bottom + 85));

  // Auto-snap when POI selection changes
  React.useEffect(() => {
    if (selectedPoiId) {
      bottomSheetRef.current?.snapToIndex(1); // Halfway
    } else {
      bottomSheetRef.current?.snapToIndex(0); // Collapsed
    }
  }, [selectedPoiId]);

  const activeCategory = useMemo(() => {
    return categories?.find(c => c.id === activeCategoryId)?.category;
  }, [activeCategoryId, categories]);

  const { data: poisData, isLoading } = usePOIs(activeCategory);

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId || !poisData) return null;
    const f = poisData.features.find((f: any) => f.properties.id === selectedPoiId);
    if (!f) return null;
    return {
      ...f.properties,
      geometry: f.geometry,
      distance: '350m',
      time: '5 min'
    };
  }, [selectedPoiId, poisData]);

  const handleRecenter = useCallback(async () => {
    await requestPermission();
    triggerRecenter();
  }, [requestPermission, triggerRecenter]);

  // Sync Recenter Button with Bottom Sheet
  // sheetPosition returns the exact Y pixel relative to the screen top where the sheet starts.
  // By using translateY = sheetPosition.value - SCREEN_HEIGHT, we get the offset relative to the bottom edge.
  // Add a -16 pixel padding so it sits just above the line of the bottom sheet.
  const rRecenterButtonStyle = useAnimatedStyle(() => {
    // sheetPosition.value is absolute Y (decreases as it moves UP)
    // We want the button to stay at (sheetPosition - offset)
    return {
      transform: [{ translateY: sheetPosition.value - SCREEN_HEIGHT - 80 }],
    };
  });

  return (
    <View className="flex-1 overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Map Content (Full Screen) */}
      <View style={StyleSheet.absoluteFill}>
        <MapContent 
          userCoords={userCoords}
          locationStatus={locationStatus}
          poisGeoJSON={poisData}
          onDeselect={deselect}
        />
        <AROverlay 
          isVisible={isARVisible} 
          onExitAR={() => {}}
        />
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
      </View>

      {/* Floating Recenter Button (Synced) */}
      {/* Anchor at 0 (bottom of screen) - translateY will lift it above the sheet */}
      <Animated.View 
        pointerEvents="box-none" 
        style={[
          styles.overlay, 
          { bottom: 0 }, 
          rRecenterButtonStyle
        ]}
      >
        <View pointerEvents="auto" className="items-end px-4 mb-4">
          <Pressable 
            onPress={handleRecenter}
            className="w-12 h-12 items-center justify-center rounded-full active:opacity-70 bg-black/60 border border-white/5 shadow-lg"
          >
            <Feather name="navigation" size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      <MapBottomSheet 
        ref={bottomSheetRef}
        translateY={sheetPosition}
      >
        <View className="px-4">
          {/* SearchBar */}
          <SearchBar onArPress={() => router.push('/(main)/profile')} />
          
          {!selectedPoi && (
            <>
              {/* Apple Maps Quick Actions (Sitios) */}
              <QuickActions />
              
              {/* Apple Maps Guides (Tus guías) */}
              <GuidesSection />

              {/* Apple Maps Footer Actions */}
              <SheetFooterActions />
            </>
          )}

          {/* Details Card */}
          {selectedPoi && (
            <Animated.View entering={FadeInDown} className="mt-4">
              <POICard poi={selectedPoi} onClose={deselect} onNavigate={() => {}} onSelect={selectPoi} noFloat />
              {/* Extra spacing when showing a card */}
              <View style={{ height: 100 }} />
            </Animated.View>
          )}

          {/* Bottom padding to allow scrolling past everything */}
          <View style={{ height: 100 }} />
        </View>
      </MapBottomSheet>
    </View>
  );
}


export default MapIndex;

