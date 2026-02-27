import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface POIImageGalleryProps {
  images: string[];
}

export const POIImageGallery = React.memo(({ images }: POIImageGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <View className="mt-4">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="flex-row"
        contentContainerStyle={styles.container}
      >
        {images.map((img, index) => (
          <Image
            key={img || index}
            source={{ uri: img }}
            className="w-28 h-20 rounded-xl mr-3 border border-white/5"
            contentFit="cover"
            transition={300}
            accessibilityLabel={`POI Image ${index + 1}`}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
  },
});
