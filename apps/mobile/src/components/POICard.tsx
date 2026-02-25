import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

import { getCategoryMetadata } from '../utils/poiUtils';
import { UIPOI } from '../types/models/poi';
import { POIBadges } from './poi/POIBadges';
import { POIActions } from './poi/POIActions';

interface POICardProps {
  poi: UIPOI | null;
  onClose: () => void;
  onNavigate: () => void;
  onSelect: (id: number, coords: number[]) => void;
}

import { theme } from '../styles/theme';

import { POIImageGallery } from './poi/POIImageGallery';

export const POICard = React.memo(({ poi, onClose, onNavigate, onSelect }: POICardProps) => {
  if (!poi) return null;

  const metadata = getCategoryMetadata(poi.category);
  const showImages = ['grandstand', 'restaurant', 'shop'].includes(poi.category.toLowerCase());

  return (
    <TouchableOpacity
      onPress={() => onSelect(poi.id, poi.geometry.coordinates)}
      activeOpacity={0.9}
      className="mx-4 mb-4 bg-surface/90 rounded-3xl p-4 border border-white/10 shadow-2xl"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <POIBadges 
            category={poi.category}
            crowdLevel={poi.crowdLevel}
            isWheelchairAccessible={poi.isWheelchairAccessible}
            hasPriorityLane={poi.hasPriorityLane}
            icon={metadata.icon}
          />

          <Text className="text-white font-black text-lg mb-1">{poi.name}</Text>
          {poi.description ? (
            <Text className="text-muted text-xs leading-relaxed mb-2" numberOfLines={2}>
              {poi.description}
            </Text>
          ) : null}

          {(poi.time || poi.distance) && (
            <View className="flex-row items-center">
              <Feather name="clock" size={14} color={colors.muted} />
              <Text className="text-muted text-xs ml-1">
                {poi.time ? `${poi.time} walk` : ''} {poi.distance ? `(${poi.distance})` : ''}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.glass.low }}
        >
          <Feather name="x" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {showImages && poi.images && <POIImageGallery images={poi.images} />}

      <POIActions onNavigate={onNavigate} />
    </TouchableOpacity>
  );
});



