import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

export interface POI {
  id: string;
  name: string;
  type: string;
  status: 'open' | 'closed';
  distance: string;
  time: string;
  images: string[];
}

interface POICardProps {
  poi: POI | null;
  onClose: () => void;
  onNavigate: () => void;
}

export const POICard: React.FC<POICardProps> = ({ poi, onClose, onNavigate }) => {
  if (!poi) return null;

  return (
    <View className="mx-4 mb-4 bg-surface/90 rounded-3xl p-4 border border-white/10 shadow-2xl">
      <View className="flex-row justify-between items-start">
        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <View className="bg-primary/20 px-2 py-0.5 rounded">
              <Text className="text-primary text-[10px] font-black uppercase tracking-wider">
                {poi.type}
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className={`w-1.5 h-1.5 rounded-full mr-1 ${poi.status === 'open' ? 'bg-green-400' : 'bg-red-400'}`} />
              <Text className="text-white text-[10px] font-medium">
                {poi.status === 'open' ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
          
          <Text className="text-white font-black text-lg mb-0.5">{poi.name}</Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="timer-outline" size={14} color={colors.muted} />
            <Text className="text-muted text-xs ml-1">
              {poi.time} walk ({poi.distance})
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={onClose}
          className="w-8 h-8 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <MaterialCommunityIcons name="close" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <View className="mt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {poi.images.map((img, index) => (
            <Image 
              key={index}
              source={{ uri: img }}
              className="w-28 h-20 rounded-xl mr-3 border border-white/5"
              resizeMode="cover"
            />
          ))}
          {/* Mock "+4 more" item */}
          <View className="w-20 h-20 bg-white/5 rounded-xl items-center justify-center">
            <Text className="text-muted text-xs font-bold">+4 more</Text>
          </View>
        </ScrollView>
      </View>

      <View className="mt-4 flex-row gap-3">
        <TouchableOpacity 
          onPress={onNavigate}
          className="flex-1 bg-primary h-12 flex-row items-center justify-center rounded-xl"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons name="navigation" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Navigate Here</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="w-12 h-12 items-center justify-center border rounded-xl border-transparent"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <MaterialCommunityIcons name="share-variant" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
