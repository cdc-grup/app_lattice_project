import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { Feather } from '@expo/vector-icons';
import Animated, { SharedValue, useAnimatedStyle, interpolate, Extrapolate, FadeInUp, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIPOI } from '../../types/models/poi';
import { RouteGeoJSON } from '../../types';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useMapStore } from '../../store/useMapStore';
import { useSavedLocations, useSaveLocation, useDeleteSavedLocation } from '../../hooks/queries/useSavedLocations';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCategoryMetadata } from '../../utils/poiUtils';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Hoist Intl for performance (js-hoist-intl)
const durationFormatter = new Intl.NumberFormat('es-ES', {
  style: 'unit',
  unit: 'minute',
  unitDisplay: 'short',
});

const distanceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'unit',
  unit: 'meter',
  unitDisplay: 'short',
});

const kmFormatter = new Intl.NumberFormat('es-ES', {
  style: 'unit',
  unit: 'kilometer',
  unitDisplay: 'short',
  maximumFractionDigits: 1,
});

interface PoiDetailSheetProps {
  poi: UIPOI | null;
  route: RouteGeoJSON | null;
  onClose: () => void;
  translateY: SharedValue<number>;
}

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[style, styles.solidBackground]}>
      <View style={styles.premiumBorder} />
    </View>
  );
};

export const PoiDetailSheet = React.forwardRef<BottomSheet, PoiDetailSheetProps>(({ 
  poi, 
  route,
  onClose,
  translateY 
}, ref) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const setNavigating = useMapStore(s => s.setNavigating);
  const { data: savedData } = useSavedLocations();
  const saveLocation = useSaveLocation();
  const deleteLocation = useDeleteSavedLocation();
  const scale = useSharedValue(1);

  const metadata = React.useMemo(() => getCategoryMetadata(poi?.category), [poi?.category]);

  const driveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    width: '100%',
  }));

  const isSaved = React.useMemo(() => {
    if (!savedData?.features || !poi) return false;
    return savedData.features.some((f: any) => 
      f.properties.label === poi.name || 
      (Math.abs(f.geometry.coordinates[0] - poi.geometry.coordinates[0]) < 0.0001 &&
       Math.abs(f.geometry.coordinates[1] - poi.geometry.coordinates[1]) < 0.0001)
    );
  }, [savedData, poi]);

  // Check if the current POI *is* a saved marker (different from just being "in favorites")
  const isSelectedSaved = React.useMemo(() => {
    if (!savedData?.features || !poi) return false;
    // If it comes from savedData, it will match by ID (saved marker ID != POI ID usually)
    // But in MapIndex we pass the marker as a POI object
    return savedData.features.some((f: any) => Number(f.properties.id) === Number(poi.id));
  }, [savedData, poi]);

  const snapPoints = React.useMemo(() => [
    insets.bottom + 260, // Collapsed
    SCREEN_HEIGHT - insets.top - 40 // Expanded
  ], [insets.bottom, insets.top]);

  const formattedDuration = React.useMemo(() => {
    if (!route?.properties.durationEstimate) return '--';
    const mins = Math.round(route.properties.durationEstimate / 60);
    return durationFormatter.format(mins || 1);
  }, [route]);

  const formattedDistance = React.useMemo(() => {
    if (!route?.properties.distance) return '--';
    const dist = route.properties.distance;
    return dist >= 1000 
      ? kmFormatter.format(dist / 1000)
      : distanceFormatter.format(dist);
  }, [route]);

  const handleToggleSave = () => {
    console.log('[PoiDetailSheet] Toggle save pressed for:', poi?.name);
    if (!poi) return;
    if (isSaved) {
      const savedItem = savedData.features.find((f: any) => f.properties.label === poi.name);
      if (savedItem) {
        console.log('[PoiDetailSheet] Deleting saved location:', savedItem.properties.id);
        deleteLocation.mutate(savedItem.properties.id);
      }
    } else {
      console.log('[PoiDetailSheet] Saving new location:', poi.name);
      saveLocation.mutate({
        label: poi.name,
        latitude: poi.geometry.coordinates[1],
        longitude: poi.geometry.coordinates[0],
      });
    }
  };

  if (!poi) return null;

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animatedPosition={translateY}
      enablePanDownToClose
      onClose={onClose}
    >
      <View style={styles.container}>
        {/* Maps Style Header */}
        <View style={styles.header}>
          <Animated.View 
            entering={FadeInUp.delay(100).duration(800).springify().damping(20)}
            style={styles.headerTitleContainer}
          >
            <View className="flex-row items-center mb-1">
              <View 
                className="px-2 py-0.5 rounded-full flex-row items-center mr-2"
                style={{ backgroundColor: `${metadata.color}20` }}
              >
                <MaterialCommunityIcons name={metadata.icon as any} size={12} color={metadata.color} />
                <Text style={[styles.categoryBadgeText, { color: metadata.color }]}>
                  {metadata.label.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.title} numberOfLines={1}>{poi.name}</Text>
          </Animated.View>
          <View style={styles.headerActions}>
            <Pressable 
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
              }} 
              style={({ pressed }) => [styles.headerIcon, styles.closeIcon, pressed && { opacity: 0.7 }]}
            >
              <Feather name="x" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {/* Action Buttons - Moved to top for visibility */}
            <Animated.View 
              entering={FadeInUp.delay(200).duration(800).springify()}
              style={driveButtonStyle}
            >
              <Pressable 
                onPressIn={() => scale.value = withSpring(0.96)}
                onPressOut={() => scale.value = withSpring(1)}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setNavigating(true);
                }}
                style={[styles.driveButton, { backgroundColor: metadata.color }]}
              >
                <View style={styles.driveButtonContent}>
                  <View style={styles.driveButtonIconContainer}>
                    <Feather name="navigation" size={24} color="white" />
                  </View>
                  <View style={styles.driveButtonTextContainer}>
                    <Text style={styles.driveButtonTitle}>ESTA A {formattedDistance}</Text>
                    <Text style={styles.driveButtonSubtitle}>Indicaciones • {formattedDuration}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.7)" style={{ marginLeft: 'auto' }} />
                </View>
              </Pressable>
            </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(300).duration(800).springify()}
            style={styles.statsRow}
          >
            <SafeBlurView intensity={20} style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: `${poi.crowdLevel === 'low' ? '#30D15820' : '#FF950020'}` }]}>
                <Feather 
                  name="users" 
                  size={16} 
                  color={poi.crowdLevel === 'low' ? '#30D158' : '#FF9500'} 
                />
              </View>
              <Text style={styles.statLabel}>Ocupación</Text>
              <Text style={[styles.statValue, { color: poi.crowdLevel === 'low' ? '#30D158' : '#FF9500' }]}>
                {poi.crowdLevel === 'low' ? 'Baja' : 'Media'}
              </Text>
            </SafeBlurView>

            <SafeBlurView intensity={20} style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: '#A2C2E120' }]}>
                <Feather name="clock" size={16} color="#A2C2E1" />
              </View>
              <Text style={styles.statLabel}>Apertura</Text>
              <Text style={styles.statValue}>8:30 AM</Text>
            </SafeBlurView>

            <SafeBlurView intensity={20} style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: '#C197D620' }]}>
                <Feather name="star" size={16} color="#C197D6" />
              </View>
              <Text style={styles.statLabel}>Popular</Text>
              <Text style={styles.statValue}>4.8 / 5</Text>
            </SafeBlurView>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(800).springify()}>
            <View style={styles.photosSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                {(poi.images && poi.images.length > 0 ? poi.images : [
                  'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=800&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop'
                ]).map((img, i) => (
                  <Image 
                    key={i} 
                    source={{ uri: img }} 
                    style={styles.photoContainer}
                    contentFit="cover"
                    transition={200}
                  />
                ))}
              </ScrollView>
            </View>
          </Animated.View>

          {poi.description && (
            <Animated.Text 
              entering={FadeInUp.delay(500).duration(800).springify()}
              style={styles.descriptionText}
            >
              {poi.description}
            </Animated.Text>
          )}

          {/* User Specific Note if applicable */}
          {user?.avoidStairs && !poi.isWheelchairAccessible && (
            <View className="mt-6 flex-row items-center p-4 bg-[#E10600]/10 rounded-2xl border border-[#E10600]/20">
              <Feather name="alert-circle" size={20} color="#E10600" />
              <Text className="ml-3 text-[#E10600] font-semibold flex-1">
                Atención: Este sitio puede no ser accesible según tus preferencias de movilidad.
              </Text>
            </View>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  solidBackground: {
    backgroundColor: '#1C1C1E', // Match profile wizard background
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Matches w-12 h-1.5 bg-white/20
    width: 48,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 20,
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  statValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
  driveButton: {
    borderRadius: 18,
    overflow: 'hidden',
    width: '100%',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    marginTop: 12,
  },
  driveButtonContent: {
    height: 72,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  driveButtonIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driveButtonTextContainer: {
    marginLeft: 14,
  },
  driveButtonTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  driveButtonSubtitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginTop: -2,
  },
  photosSection: {
    marginTop: 28,
  },
  photoContainer: {
    width: 280,
    height: 180,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    pointerEvents: 'none',
  },
});
