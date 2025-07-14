// components/SearchTabs.tsx
import { View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";

export default function SearchTabs() {
  const [activeTab, setActiveTab] = useState<"PYQs" | "Flashcards">("PYQs");

  return (
    <View className="flex-row bg-gray-100 p-1 rounded-full mt-4">
      {["PYQs", "Flashcards"].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab as any)}
          className={`flex-1 items-center py-2 rounded-full ${
            activeTab === tab ? "bg-white shadow" : ""
          }`}
        >
          <Text className={`font-medium ${activeTab === tab ? "text-black" : "text-gray-500"}`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
