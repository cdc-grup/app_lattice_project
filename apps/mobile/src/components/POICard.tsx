import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

export interface POI {
  id: string;
  name: string;
  description?: string;
  type: string;
  status?: string;
  crowdLevel: 'low' | 'moderate' | 'high' | 'blocked';
  isWheelchairAccessible: boolean;
  hasPriorityLane: boolean;
  distance?: string;
  time?: string;
  images?: string[];
}

interface POICardProps {
  poi: POI | null;
  onClose: () => void;
  onNavigate: () => void;
}

const getCrowdColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'text-green-400';
    case 'moderate':
      return 'text-yellow-400';
    case 'high':
    case 'blocked':
      return 'text-red-400';
    default:
      return 'text-white';
  }
};

const getCrowdLabel = (level: string) => {
  switch (level) {
    case 'low':
      return 'Low crowds';
    case 'moderate':
      return 'Moderate crowds';
    case 'high':
      return 'High crowds';
    case 'blocked':
      return 'Access blocked';
    default:
      return 'Crowd status unknown';
  }
};

export const POICard: React.FC<POICardProps> = ({ poi, onClose, onNavigate }) => {
  if (!poi) return null;

  const showImages = ['grandstand', 'restaurant', 'shop'].includes(poi.type.toLowerCase());

  return (
    <View className="mx-4 mb-4 bg-surface/90 rounded-3xl p-4 border border-white/10 shadow-2xl">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <View className="flex-row flex-wrap items-center gap-2 mb-2">
            <View className="bg-primary/20 px-2 py-0.5 rounded">
              <Text className="text-primary text-[10px] font-black uppercase tracking-wider">
                {poi.type}
              </Text>
            </View>

            <View className="flex-row items-center border border-white/10 px-2 py-0.5 rounded bg-white/5">
              <View
                className={`w-1.5 h-1.5 rounded-full mr-1 ${getCrowdColor(poi.crowdLevel).replace('text-', 'bg-')}`}
              />
              <Text className={`text-[10px] font-medium ${getCrowdColor(poi.crowdLevel)}`}>
                {getCrowdLabel(poi.crowdLevel)}
              </Text>
            </View>

            {poi.isWheelchairAccessible && (
              <View className="bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                <Feather name="user" size={12} color="#60A5FA" />
              </View>
            )}

            {poi.hasPriorityLane && (
              <View className="bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                <Feather name="star" size={12} color="#FBBF24" />
              </View>
            )}
          </View>

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
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <Feather name="x" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {showImages && poi.images && poi.images.length > 0 && (
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
          </ScrollView>
        </View>
      )}

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
          <Feather name="navigation" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Navigate Here</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-12 h-12 items-center justify-center border rounded-xl border-transparent"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Feather name="bookmark" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
