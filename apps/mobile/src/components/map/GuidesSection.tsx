import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.45;

const GuideCard = ({ title, sublabel, icon }: { title: string, sublabel: string, icon: any }) => (
  <View style={[styles.card, { width: CARD_WIDTH }]} className="rounded-3xl overflow-hidden mr-4">
    <LinearGradient
      colors={['#333', '#1a1a1a']}
      style={StyleSheet.absoluteFill}
    />
    <View className="flex-1 items-center justify-center pt-8 pb-4">
      <View style={styles.iconContainer}>
         <Feather name="star" size={50} color="#FFD60A" />
      </View>
    </View>
    <View className="px-4 pb-4">
      <Text className="text-white text-base font-bold">{title}</Text>
      <Text className="text-gray-400 text-xs">{sublabel}</Text>
    </View>
  </View>
);

export const GuidesSection = () => {
  return (
    <View className="mt-4 mb-8">
      <View className="flex-row items-center mb-4 px-1">
        <Text className="text-white text-xl font-bold">Tus guías</Text>
        <Feather name="chevron-right" size={20} color="#666" className="ml-1" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <GuideCard 
          title="Favoritos" 
          sublabel="0 sitios" 
          icon="star" 
        />
        {/* Placeholder for more guides */}
        <View 
          style={[styles.card, { width: CARD_WIDTH, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444' }]} 
          className="rounded-3xl items-center justify-center mr-4"
        >
          <Feather name="plus" size={30} color="#666" />
          <Text className="text-gray-500 text-xs mt-2">Nueva guía</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  }
});
