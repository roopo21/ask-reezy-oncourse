
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import ChatHeader from "../components/ChatHeader";
import SearchTabs from "../components/SearchTabs";
import PopularSearches from "../components/PopularSearches";
import BottomInput from "../components/BottomInput";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gradient-to-b from-white to-blue-100 px-4 pt-10">
      <ChatHeader />

      <SearchTabs />

      <ScrollView className="mt-4 flex-1">
        <PopularSearches />
      </ScrollView>

      <BottomInput />
    </View>
  );
}
