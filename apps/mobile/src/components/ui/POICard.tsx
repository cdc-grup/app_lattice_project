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
    <Box variant="glass" className="p-4 shadow-2xl backdrop-blur-3xl">
      <View className="flex-row justify-between items-start">
        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <View className="bg-primary/20 px-2 py-0.5 rounded">
              <Text className="text-primary text-[10px] font-black uppercase">{category}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
              <Text className={`${isOpen ? 'text-green-400' : 'text-red-400'} text-[10px] font-medium`}>
                {isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
          <Text className="text-white text-lg font-bold">{title}</Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text className="text-muted text-xs font-medium">{waitTime} • {distance}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={onClose}
          className="w-8 h-8 bg-white/5 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Placeholder for POI Preview Images */}
      <View className="flex-row mt-4 gap-3">
        <View className="w-28 h-20 rounded-xl bg-white/10 overflow-hidden border border-white/5 items-center justify-center">
          <Ionicons name="image-outline" size={24} color="rgba(255,255,255,0.2)" />
        </View>
        <View className="w-28 h-20 rounded-xl bg-white/10 overflow-hidden border border-white/5 items-center justify-center">
          <Ionicons name="image-outline" size={24} color="rgba(255,255,255,0.2)" />
        </View>
        <View className="w-20 h-20 rounded-xl bg-white/5 items-center justify-center border border-white/5">
          <Text className="text-muted text-xs font-bold">+4</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row mt-4 gap-3">
        <TouchableOpacity 
          onPress={onNavigate}
          className="flex-1 h-12 bg-primary rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-primary/30"
        >
          <Ionicons name="navigate" size={18} color="white" />
          <Text className="text-white font-bold text-sm">Navigate Here</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onShare}
          className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 items-center justify-center"
        >
          <Ionicons name="share-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Box>
  );
};

export default POICard;
