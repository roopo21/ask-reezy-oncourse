// components/ChatHeader.tsx
import { View, Text } from "react-native";
import { homeStyles } from "../styles/HomeStyles";
import RezzyHeader from "./RezzyHeader";

export default function ChatHeader() {
  return (
    <View className="mb-4">
    <RezzyHeader/>
      <Text style={homeStyles.helloText}>Hey Dr. Vibhu 👋</Text>
      <Text style={homeStyles.helloText}>How can I help?</Text>
    </View>
  );
}
