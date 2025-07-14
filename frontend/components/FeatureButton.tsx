// components/FeatureButton.tsx
import { View, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

type FeatureButtonProps = {
  icon: string;
  label: string;
  onPress?: () => void;
  className?: string;
};

export default function FeatureButton({
  icon,
  label,
  onPress,
  className = '',
}: FeatureButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-20 h-[100px] items-center justify-start ${className}`}
      activeOpacity={0.8}
    >
      <View className="w-[70px] h-[60px] bg-white rounded-xl shadow-sm items-center justify-center">
        <IconButton icon={icon} size={24} iconColor="#111" />
      </View>
      <Text
        className="mt-[6px] text-center text-[12px] font-semibold text-slate-700"
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

