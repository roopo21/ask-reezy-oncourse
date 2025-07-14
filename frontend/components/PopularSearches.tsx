// components/PopularSearches.tsx
import { View, Text, TouchableOpacity } from "react-native";

// avoiding this for now 
const searches = [
  "What bone articulates with the femur?",
  "Which bones are part of the body for NEET-PG?",
  "Which bone serves the purpose of childbirth?",
];

export default function PopularSearches() {
  return (
    <View className="mt-4">
      <Text className="text-gray-500 text-sm mb-2">POPULAR SEARCHES</Text>
      {searches.map((s, index) => (
        <TouchableOpacity key={index} className="p-3 bg-white rounded-lg mb-2 shadow-sm">
          <Text className="text-gray-800">{s}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
