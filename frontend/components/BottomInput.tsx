// components/BottomInput.tsx
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomInput() {
  return (
    <View className="flex-row items-center px-4 py-2 bg-white rounded-full mb-4">
      <TextInput
        placeholder="Ask anything..."
        className="flex-1 px-3 py-2 text-base text-gray-700"
      />
      <TouchableOpacity className="ml-2 bg-blue-500 p-2 rounded-full">
        <Ionicons name="arrow-up" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
