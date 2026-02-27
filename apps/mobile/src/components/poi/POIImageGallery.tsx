import React from 'react';
import { View, ScrollView } from 'react-native';
import { Image } from 'expo-image';

interface POIImageGalleryProps {
  images: string[];
}

export const POIImageGallery = ({ images }: POIImageGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <View className="mt-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            className="w-28 h-20 rounded-xl mr-3 border border-white/5"
            contentFit="cover"
            transition={300}
          />
        ))}
      </ScrollView>
    </View>
  );
};
