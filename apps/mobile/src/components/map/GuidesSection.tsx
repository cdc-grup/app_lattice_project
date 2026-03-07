import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSavedLocations } from '../../hooks/queries/useSavedLocations';

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
  const { data: savedData, isLoading } = useSavedLocations();

  const guides = useMemo(() => {
    if (!savedData?.features) return [];
    
    // Group by label to simulate "guides"
    const groups: Record<string, any[]> = {};
    savedData.features.forEach((f: any) => {
      const label = f.properties.label || 'Otros';
      if (!groups[label]) groups[label] = [];
      groups[label].push(f);
    });

    return Object.entries(groups).map(([label, items]) => ({
      title: label,
      count: items.length,
      icon: label.toLowerCase().includes('comida') ? 'coffee' : 'map-pin',
      color: label.toLowerCase().includes('favoritos') ? '#FF3B30' : '#30D158'
    }));
  }, [savedData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#FF3B30" />
      </View>
    );
  }

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
        {guides.length > 0 ? (
          guides.map((guide, idx) => (
            <GuideItem 
              key={idx}
              title={guide.title} 
              sublabel={`${guide.count} sitio${guide.count > 1 ? 's' : ''}`} 
              icon={guide.icon} 
              color={guide.color} 
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes guías guardadas</Text>
          </View>
        )}
        
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
  emptyContainer: {
    width: 200,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
