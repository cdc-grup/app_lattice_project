import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { colors } from '../styles/colors';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onArPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Find grandstands, food...',
  onSearch,
  onArPress,
}) => {
  return (
    <View className="flex-row items-center gap-3 px-4 pt-12">
      <View
        className="flex-1 flex-row items-center bg-surface/80 px-4 h-12 rounded-full border border-white/10"
        style={{ backdropFilter: 'blur(10px)' }} // NativeWind handles some blur, but let's stick to safe styles
      >
        <LucideIcons.Search size={20} color={colors.muted} strokeWidth={2} />
        <TextInput
          className="flex-1 ml-2 text-white font-medium text-sm pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          onChangeText={onSearch}
        />
        <TouchableOpacity>
          <LucideIcons.Mic size={20} color={colors.muted} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onArPress}
        className="w-12 h-12 items-center justify-center rounded-full border border-transparent"
        style={{
          backgroundColor: 'rgba(24, 24, 27, 0.8)', // surface/80
          borderColor: 'rgba(255, 255, 255, 0.1)', // white/10
        }}
      >
        <LucideIcons.Camera size={22} color="white" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};
