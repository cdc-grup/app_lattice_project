import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GuideItem = ({ title, sublabel, icon, color }: { title: string, sublabel: string, icon: string, color?: string }) => (
  <Pressable 
    style={({ pressed }) => [
      styles.guideItem,
      pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }
    ]}
  >
    <View style={styles.guideIconWrapper}>
      <View style={[styles.iconIndicator, { backgroundColor: color || '#FFFFFF' }]} />
      <Feather name={icon as any} size={26} color="white" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.guideTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.guideSublabel}>{sublabel}</Text>
    </View>
  </Pressable>
);

export const GuidesSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Tus guías</Text>
        <Pressable style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}>
          <Text style={styles.seeAllText}>Ver todas</Text>
          <Feather name="chevron-right" size={12} color="rgba(255, 255, 255, 0.2)" />
        </Pressable>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        <GuideItem 
          title="Para visitar" 
          sublabel="2 sitios" 
          icon="map-pin" 
          color="#30D158" 
        />
        <GuideItem 
          title="Restaurantes" 
          sublabel="5 sitios" 
          icon="coffee" 
          color="#5E5CE6" 
        />
        <GuideItem 
          title="Viajes" 
          sublabel="12 sitios" 
          icon="briefcase" 
          color="#FF9F0A" 
        />
        
        <Pressable 
          style={({ pressed }) => [
            styles.newGuideButton,
            pressed && { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
          ]}
        >
          <Feather name="plus" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.newGuideText}>Nueva guía</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  seeAllText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 2,
  },
  scrollContent: {
    paddingRight: 20,
  },
  guideItem: {
    width: 140,
    marginRight: 12,
  },
  guideIconWrapper: {
    width: '100%',
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
    overflow: 'hidden',
  },
  iconIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  textContainer: {
    paddingLeft: 4,
  },
  guideTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  guideSublabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 2,
  },
  newGuideButton: {
    width: 140,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  newGuideText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
});
