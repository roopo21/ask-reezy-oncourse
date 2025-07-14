import { View, Text, FlatList } from 'react-native';

export default function PastChats() {
  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-2">Past Sessions</Text>
      {/* Replace with real data */}
      <FlatList
        data={[{ id: 1, title: 'Osteology - Flashcards' }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text className="py-2 border-b border-gray-200">{item.title}</Text>
        )}
      />
    </View>
  );
}
