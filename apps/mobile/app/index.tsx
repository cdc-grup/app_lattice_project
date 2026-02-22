import "./../global.css";
import React, { useState } from "react";
import { View, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { Ionicons } from "@expo/vector-icons";

// UI Components
import { SearchBar } from "../src/components/ui/SearchBar";
import { FilterChip } from "../src/components/ui/FilterChip";
import { POICard } from "../src/components/ui/POICard";
import { BottomNav } from "../src/components/ui/BottomNav";

// Config - Custom "Digital Non-Real" HUD Style
const HUD_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
    },
  },
  layers: [
    {
      id: "osm-layer",
      type: "raster",
      source: "osm",
      paint: {
        "raster-opacity": 0.2, // Stylized low-opacity for "non-real" feel
        "raster-brightness-max": 0.3,
        "raster-saturation": -1, // Monochrome/Greyscale for digital feel
      },
    },
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#0F0F10", // Match app background
      },
    },
  ],
};

const CIRCUIT_CENTER = [2.2612, 41.5701];

export default function MapScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Food");
  const [showPOI, setShowPOI] = useState(true);

  // Memoize style object to prevent re-renders of the MapView
  const circuitStyle = React.useMemo(() => HUD_STYLE, []);

  const categories = React.useMemo(() => [
    { label: "Grandstands", icon: "map" as const },
    { label: "Food", icon: "restaurant" as const },
    { label: "Parking", icon: "car" as const },
    { label: "Cart", icon: "cart" as const },
    { label: "Toilets", icon: "water" as const },
  ], []);

  // Center coordinate memoization
  const centerCoordinate = React.useMemo(() => CIRCUIT_CENTER, []);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      
      {/* MapLibre Layer - Custom Digital Aesthetic */}
      <View className="absolute inset-0">
        <MapLibreGL.MapView
          style={{ flex: 1 }}
          mapStyle={circuitStyle}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <MapLibreGL.Camera
            defaultSettings={{
              centerCoordinate: centerCoordinate,
              zoomLevel: 14,
            }}
          />
        </MapLibreGL.MapView>
      </View>

      {/* UI Overlays - Dynamic Digital HUD */}
      <SafeAreaView className="flex-1 pointer-events-none" edges={['top']}>
        
        {/* Top Section: Intelligent Search */}
        <View className="px-4 pt-4 pointer-events-auto">
          <SearchBar onARToggle={() => console.log('AR Navigation Requested')} />
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {categories.map((cat) => (
              <FilterChip
                key={cat.label}
                label={cat.label}
                icon={cat.icon}
                isActive={selectedCategory === cat.label}
                onPress={() => setSelectedCategory(cat.label)}
              />
            ))}
          </ScrollView>
        </View>

        <View className="flex-1" />

        {/* Floating Digital Controls */}
        <View className="absolute right-4 bottom-72 gap-3 pointer-events-auto">
          <TouchableOpacity className="w-10 h-10 bg-black/60 rounded-full items-center justify-center border border-white/10 backdrop-blur-md shadow-lg">
            <Ionicons name="layers-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-black/60 rounded-full items-center justify-center border border-white/10 backdrop-blur-md shadow-lg">
            <Ionicons name="locate" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stylized Information Layer */}
        {showPOI && (
          <View className="px-4 mb-4 pointer-events-auto">
            <POICard 
              title="Paddock Club Grill"
              category="Food Court"
              waitTime="5 min"
              distance="350m"
              isOpen={true}
              onClose={() => setShowPOI(false)}
              onNavigate={() => console.log('Navigating...')}
            />
          </View>
        )}

        {/* Global Navigation */}
        <View className="pointer-events-auto">
          <BottomNav />
        </View>

      </SafeAreaView>
    </View>
  );
}