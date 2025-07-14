// components/ChatHeader.tsx
import { View, Text } from "react-native";

export default function ChatHeader() {
  return (
    <View className="mb-4">
      <Text className="text-xl font-medium text-gray-700">Ask Rezzy</Text>
      <Text className="text-2xl font-bold mt-1">Hey Dr. Vibhu 👋</Text>
      <Text className="text-xl font-semibold text-gray-800">How can I help?</Text>
    </View>
  );
}
