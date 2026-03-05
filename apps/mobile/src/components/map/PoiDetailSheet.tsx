import React, { useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import Animated, { SharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIPOI } from '../../types/models/poi';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface PoiDetailSheetProps {
  poi: UIPOI | null;
  onClose: () => void;
  translateY: SharedValue<number>;
}

const CustomBackground = ({ style, animatedIndex }: BottomSheetBackgroundProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(28, 28, 30, ${interpolate(
        animatedIndex.value,
        [-1, 0, 1, 2],
        [0.4, 0.7, 0.85, 0.95],
        Extrapolate.CLAMP
      )})`,
    };
  });

  return (
    <Animated.View style={[style, styles.blurBackground, animatedStyle]}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
};

export const PoiDetailSheet = forwardRef<BottomSheet, PoiDetailSheetProps>(({ 
  poi, 
  onClose,
  translateY 
}, ref) => {
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => [
    insets.bottom + 280, // Collapsed
    SCREEN_HEIGHT - insets.top - 40 // Expanded
  ], [insets.bottom, insets.top]);

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
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerIcon}>
            <Feather name="share" size={20} color="#007AFF" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title} numberOfLines={1}>{poi.name}</Text>
            <Text style={styles.subtitle}>{poi.category}</Text>
          </View>
          <Pressable onPress={onClose} style={[styles.headerIcon, styles.closeIcon]}>
            <Feather name="x" size={20} color="white" />
          </Pressable>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable style={styles.driveButton}>
              <Feather name="navigation" size={20} color="white" />
              <Text style={styles.driveButtonText}>11 min</Text>
            </Pressable>
            <Pressable style={styles.circleButton}>
              <Feather name="phone" size={20} color="#007AFF" />
              <Text style={styles.circleButtonText}>Llamar</Text>
            </Pressable>
            <Pressable style={styles.circleButton}>
              <Feather name="globe" size={20} color="#007AFF" />
              <Text style={styles.circleButtonText}>Sitio web</Text>
            </Pressable>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Horario</Text>
              <Text style={[styles.infoValue, { color: '#FF9500' }]}>Abre pronto</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>15 valoraciones</Text>
              <View style={styles.ratingRow}>
                <Feather name="thumbs-up" size={14} color="white" />
                <Text style={styles.infoValue}> 67 %</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Acepta</Text>
              <View style={styles.paymentRow}>
                <Feather name="credit-card" size={14} color="white" />
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distancia</Text>
              <View style={styles.distRow}>
                <Feather name="navigation-2" size={14} color="white" style={{ transform: [{ rotate: '45deg' }] }} />
                <Text style={styles.infoValue}> 3,5 km</Text>
              </View>
            </View>
          </View>

          {/* Photos */}
          <View style={styles.photosSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.photoPlaceholder} />
              ))}
            </ScrollView>
          </View>
        </BottomSheetScrollView>

        {/* Floating Toolbar */}
        <View style={[styles.toolbar, { bottom: insets.bottom + 20 }]}>
          <Pressable style={styles.toolbarItem}><Feather name="plus" size={20} color="white" /></Pressable>
          <Pressable style={styles.toolbarItem}><Feather name="star" size={20} color="white" /></Pressable>
          <Pressable style={styles.toolbarItem}><Feather name="thumbs-up" size={20} color="white" /></Pressable>
          <Pressable style={styles.toolbarItem}><Feather name="more-horizontal" size={20} color="white" /></Pressable>
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  blurBackground: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
    width: 36,
    height: 5,
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  driveButton: {
    flex: 1.5,
    backgroundColor: '#007AFF',
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  driveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  circleButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  circleButtonText: {
    color: '#007AFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
  },
  infoItem: {
    width: '25%',
    alignItems: 'center',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photosSection: {
    marginTop: 20,
  },
  photoPlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginRight: 12,
  },
  toolbar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 54,
    backgroundColor: 'rgba(40, 40, 42, 0.9)',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toolbarItem: {
    padding: 10,
  }
});
