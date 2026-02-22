import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box } from './Box';

interface POICardProps {
  title: string;
  category: string;
  waitTime: string;
  distance: string;
  isOpen: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
  onShare?: () => void;
}

export const POICard = ({
  title,
  category,
  waitTime,
  distance,
  isOpen,
  onClose,
  onNavigate,
  onShare,
}: POICardProps) => {
  return (
    <View className="bg-black/60 border border-white/20 rounded-[32px] p-5 shadow-2xl backdrop-blur-3xl overflow-hidden">
      <View className="flex-row justify-between items-start">
        <View>
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-primary px-2.5 py-1 rounded-lg">
              <Text className="text-white text-[10px] font-black uppercase tracking-wider">{category}</Text>
            </View>
            <View className="flex-row items-center gap-1.5 ml-1">
              <View className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-destructive'}`} />
              <Text className={`${isOpen ? 'text-green-500' : 'text-destructive'} text-[11px] font-bold`}>
                {isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
          <Text className="text-white text-2xl font-bold tracking-tight">{title}</Text>
          <View className="flex-row items-center gap-1.5 mt-2">
            <Ionicons name="time-outline" size={16} color="#D1D5DB" />
            <Text className="text-white/80 text-sm font-medium">{waitTime} walk ({distance})</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={onClose}
          activeOpacity={0.7}
          className="w-10 h-10 bg-white/10 border border-white/20 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={20} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      {/* POI Preview Images */}
      <View className="flex-row mt-6 gap-3">
        <View className="flex-1 aspect-[4/3] rounded-2xl bg-white/5 overflow-hidden border border-white/10 items-center justify-center">
          <Ionicons name="image-outline" size={24} color="#374151" />
        </View>
        <View className="flex-1 aspect-[4/3] rounded-2xl bg-white/5 overflow-hidden border border-white/10 items-center justify-center">
          <Ionicons name="image-outline" size={24} color="#374151" />
        </View>
        <View className="w-20 aspect-square rounded-2xl bg-white/5 items-center justify-center border border-white/10">
          <Text className="text-white/60 text-sm font-bold">+4 more</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row mt-6 gap-3">
        <TouchableOpacity 
          onPress={onNavigate}
          activeOpacity={0.8}
          className="flex-1 h-14 bg-primary rounded-2xl flex-row items-center justify-center gap-3 shadow-[0_8px_20px_rgba(255,56,46,0.3)]"
        >
          <Ionicons name="navigate" size={20} color="white" />
          <Text className="text-white font-black text-base italic uppercase">Navigate Here</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onShare}
          activeOpacity={0.7}
          className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 items-center justify-center"
        >
          <Ionicons name="share-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default POICard;
