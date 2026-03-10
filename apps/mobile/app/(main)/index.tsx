import React, { useMemo, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { SearchBar } from '../../src/components/SearchBar';
import { POICard } from '../../src/components/POICard';
import { colors } from '../../src/styles/colors';
import { usePOIs } from '../../src/hooks/queries/usePOIs';
import { useSinglePOI } from '../../src/hooks/queries/useSinglePOI';
import { useCategories } from '../../src/hooks/queries/useCategories';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { useCameraTilt } from '../../src/hooks/useCameraTilt';
import { AROverlay } from '../../src/components/ar/AROverlay';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMapStore } from '../../src/store/useMapStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { MapContent } from '../../src/components/map/MapContent';
import { MapBottomSheet } from '../../src/components/map/MapBottomSheet';
import { QuickActions } from '../../src/components/map/QuickActions';
import { SearchFilters } from '../../src/components/map/SearchFilters';
import { GuidesSection } from '../../src/components/map/GuidesSection';
import { useSavedLocations, useSaveLocation } from '../../src/hooks/queries/useSavedLocations';
import { DIRECT_ACCESS_CATEGORIES } from '../../src/utils/poiUtils';
import { getCategoryMetadata } from '../../src/utils/poiUtils';


// Configure MapLibre
MapLibreGL.setAccessToken(null);
MapLibreGL.Logger.setLogCallback((log) => {
  const msg = typeof log.message === 'string' ? log.message : '';
  if (msg.includes('Failed to obtain last location update') || msg.includes('Last location unavailable')) return true;
  return false;
});

import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  cardContainer: {
    marginTop: 0,
    marginBottom: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  searchResultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchResultIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  searchResultName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  searchResultCat: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 2,
  },
});

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

import { PoiDetailSheet } from '../../src/components/map/PoiDetailSheet';

function MapIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { coords: userCoords, status: locationStatus, requestPermission } = useLocationService();
  
  // Selective selectors to minimize re-renders
  const selectedPoiId = useMapStore(s => s.selectedPoiId);
  const deselect = useMapStore(s => s.deselect);
  const triggerRecenter = useMapStore(s => s.triggerRecenter);
  const currentRoute = useMapStore(s => s.currentRoute);

  const { data: categories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);

  const { isVisible: isARVisible } = useCameraTilt();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const poiDetailSheetRef = useRef<BottomSheet>(null);

  // Position for the main search sheet
  const sheetPosition = useSharedValue(SCREEN_HEIGHT);
  // Position for the POI detail sheet
  const poiSheetPosition = useSharedValue(SCREEN_HEIGHT);

  const { data: savedData } = useSavedLocations();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  const selectPoi = useMapStore(s => s.selectPoi);

  // Active sheet position for the location button to track
  const activePosition = useMemo(() => {
    return selectedPoiId ? poiSheetPosition : sheetPosition;
  }, [selectedPoiId, poiSheetPosition, sheetPosition]);

  // Handle POI selection changes
  React.useEffect(() => {
    if (selectedPoiId) {
      // Show detail sheet, hide search sheet
      poiDetailSheetRef.current?.snapToIndex(0);
      bottomSheetRef.current?.close();
    } else {
      // Show search sheet, hide detail sheet
      poiDetailSheetRef.current?.close();
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [selectedPoiId]);

  const activeTicket = useAuthStore((s: any) => s.activeTicket);
  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return undefined;
    return categories?.find(c => c.id === activeCategoryId)?.category;
  }, [activeCategoryId, categories]);

  const { data: rawPoisData, isLoading } = usePOIs(activeCategory);

  // Filter POIs based on the active ticket
  const poisData = useMemo(() => {
    if (!rawPoisData?.features || !activeTicket) return rawPoisData;

    const filteredFeatures = rawPoisData.features.filter((f: any) => {
      const { category, name } = f.properties;
      
      // Personalize Gates: Only show assigned gate
      if (category === 'gate' && activeTicket.gate) {
        return name.toLowerCase().includes(activeTicket.gate.toLowerCase()) || 
               activeTicket.gate.toLowerCase().includes(name.toLowerCase());
      }
      
      // Personalize Grandstands: Only show assigned zone
      if (category === 'grandstand' && activeTicket.zoneName) {
        return name.toLowerCase().includes(activeTicket.zoneName.toLowerCase()) || 
               activeTicket.zoneName.toLowerCase().includes(name.toLowerCase());
      }

      // Show all other categories (food, medical, etc.) normally
      return true;
    });

    return { ...rawPoisData, features: filteredFeatures };
  }, [rawPoisData, activeTicket]);
  
  // Use useSinglePOI hook for robust single POI fetching (fallback for filters)
  // Fix: Don't call this if the selected ID belongs to a saved location OR if we already have it in poisData
  const { isSelectedSaved, numericPoiId } = useMemo(() => {
    if (!selectedPoiId) return { isSelectedSaved: false, numericPoiId: null };
    
    // Check for explicit 'saved_' prefix from MapContent
    const isPrefixed = selectedPoiId.toString().startsWith('saved_');
    const rawId = isPrefixed ? selectedPoiId.toString().replace('saved_', '') : selectedPoiId;
    const numId = Number(rawId);

    // Also check if this ID (numeric) exists in savedData even if not prefixed
    const existsInSaved = savedData?.features?.some((f: any) => Number(f.properties.id) === numId) || false;

    return { 
      isSelectedSaved: isPrefixed || existsInSaved, 
      numericPoiId: isNaN(numId) ? null : numId 
    };
  }, [selectedPoiId, savedData]);

  const isAlreadyLoaded = useMemo(() => {
    if (!numericPoiId || !poisData?.features) return false;
    return poisData.features.some((f: any) => Number(f.properties.id) === numericPoiId);
  }, [numericPoiId, poisData]);

  const { data: soloPoiData, isLoading: isSoloPoiLoading } = useSinglePOI(
    (isSelectedSaved || isAlreadyLoaded) ? null : numericPoiId
  );

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !poisData?.features) return [];
    const query = searchQuery.toLowerCase();
    return poisData.features.filter((f: any) => 
      f.properties.name?.toLowerCase().includes(query) ||
      f.properties.category?.toLowerCase().includes(query)
    ).slice(0, 5); // Return top 5 matches
  }, [searchQuery, poisData]);

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId || numericPoiId === null) return null;
    
    console.log('[MapIndex] Resolving selection for ID:', selectedPoiId, 'Numeric:', numericPoiId);

    // 1. Try to find it in the current filtered list (fastest)
    if (poisData) {
      const f = poisData.features.find((f: any) => Number(f.properties.id) === numericPoiId);
      if (f) return { ...f.properties, geometry: f.geometry };
    }
    
    // 2. Check in saved locations (Prioritize local saved data)
    if (savedData) {
      const f = savedData.features.find((f: any) => Number(f.properties.id) === numericPoiId);
      if (f) return { ...f.properties, name: f.properties.label, geometry: f.geometry, isSaved: true };
    }

    // 3. Fallback to the single POI fetch results
    if (soloPoiData && Number(soloPoiData.properties.id) === numericPoiId) {
      return { ...soloPoiData.properties, geometry: soloPoiData.geometry };
    }

    return null;
  }, [selectedPoiId, numericPoiId, poisData, soloPoiData, savedData]);

  const handleRecenter = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await requestPermission();
    triggerRecenter();
  }, [requestPermission, triggerRecenter]);

  const handleMapPress = useCallback(() => {
    Keyboard.dismiss();
    
    if (isSearching || searchQuery !== '') {
      setIsSearching(false);
      setSearchQuery('');
      bottomSheetRef.current?.snapToIndex(0);
    }
    
    deselect();
  }, [isSearching, searchQuery, deselect]);

  const rRecenterButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: activePosition.value - SCREEN_HEIGHT - 80 }],
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
          savedLocations={savedData}
          onDeselect={handleMapPress}
        />
        <AROverlay 
          isVisible={isARVisible} 
          onExitAR={() => {}}
        />
        {isLoading ? (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : null}
      </View>

      {/* Floating Recenter Button (Synced) */}
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
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
            className="w-12 h-12 items-center justify-center rounded-full bg-black/60 border border-white/5 shadow-lg"
          >
            <Feather name="navigation" size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      {/* Main Search Bottom Sheet */}
      <MapBottomSheet 
        ref={bottomSheetRef}
        translateY={sheetPosition}
      >
        <View>
          <SearchBar 
            placeholder="Busca sitios, accesos o comida..."
            value={searchQuery}
            onSearch={setSearchQuery} 
            onArPress={() => router.push('/(main)/profile')} 
            onFocus={() => {
              setIsSearching(true);
              bottomSheetRef.current?.snapToIndex(1);
            }}
          />
          {!isSearching && (
            <React.Fragment>
              <SearchFilters 
                animatedPosition={sheetPosition}
                onSelectCategory={(category) => {
                  // 1. If user has a ticket, prioritize their assigned gate/grandstand
                  if (activeTicket) {
                    if (category === 'gate' && activeTicket.gate) {
                      const found = poisData?.features.find((f: any) => 
                        f.properties.category === 'gate' && 
                        (f.properties.name.toLowerCase().includes(activeTicket.gate!.toLowerCase()) || 
                        activeTicket.gate!.toLowerCase().includes(f.properties.name.toLowerCase()))
                      );
                      if (found) {
                        selectPoi(found.properties.id, found.geometry.coordinates);
                        return;
                      }
                    }
                    if (category === 'grandstand' && activeTicket.zoneName) {
                      const found = poisData?.features.find((f: any) => 
                        f.properties.category === 'grandstand' && 
                        (f.properties.name.toLowerCase().includes(activeTicket.zoneName!.toLowerCase()) || 
                        activeTicket.zoneName!.toLowerCase().includes(f.properties.name.toLowerCase()))
                      );
                      if (found) {
                        selectPoi(found.properties.id, found.geometry.coordinates);
                        return;
                      }
                    }
                  }

                  // 2. Default behavior: Find the first POI matching this category
                  if (poisData?.features) {
                    const foundPoi = poisData.features.find((f: any) => f.properties.category === category);
                    if (foundPoi) {
                      selectPoi(foundPoi.properties.id, foundPoi.geometry.coordinates);
                    }
                  }
                }}
              />
            </React.Fragment>
          )}
          <View className="px-4">
            {isSearching || searchQuery.trim() !== '' ? (
              // Search Results
              <View style={styles.cardContainer}>
                {searchResults.length > 0 ? (
                  searchResults.map((f: any, index: number) => {
                    const metadata = getCategoryMetadata(f.properties.category);
                    return (
                      <Pressable 
                        key={f.properties.id}
                        onPress={() => {
                          selectPoi(f.properties.id, f.geometry.coordinates);
                          setSearchQuery(''); 
                          setIsSearching(false);
                        }}
                        style={({ pressed }) => [
                          styles.searchResultItem,
                          index === searchResults.length - 1 && { borderBottomWidth: 0 },
                          pressed && { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                        ]}
                      >
                        <View style={styles.searchResultInfo}>
                          <View style={[styles.searchResultIcon, { backgroundColor: `${metadata.color}15` }]}>
                            <MaterialCommunityIcons name={metadata.icon as any} size={20} color={metadata.color} />
                          </View>
                          <View className="flex-1">
                            <Text style={styles.searchResultName} numberOfLines={1}>{f.properties.name}</Text>
                            <Text style={styles.searchResultCat}>{metadata.label}</Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <View className="py-6 items-center">
                    {searchQuery.trim() !== '' ? (
                      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No se encontraron resultados</Text>
                    ) : (
                      <View className="items-center px-10">
                        <MaterialCommunityIcons name="magnify" size={48} color="rgba(255,255,255,0.1)" />
                        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', marginTop: 12 }}>
                          Escribe para buscar sitios, entradas o servicios
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              // Default Guides Section
              <View>
                <GuidesSection 
                  onSelectMarker={(coords, id) => {
                    selectPoi(`saved_${id}`, coords);
                  }}
                />
              </View>
            )}
            
            <View style={{ height: 20 }} />
          </View>
        </View>
      </MapBottomSheet>

      {/* POI Detail Bottom Sheet */}
      <PoiDetailSheet 
        ref={poiDetailSheetRef}
        poi={selectedPoi}
        route={currentRoute}
        onClose={deselect}
        translateY={poiSheetPosition}
      />
    </View>
  );
}


export default MapIndex;

