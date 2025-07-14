// components/SearchOptions.tsx
import { View } from 'react-native';
import FeatureButton from './FeatureButton';
import { useRouter } from 'expo-router';

export default function SearchOptions() {
  const router = useRouter();

  return (
    <View className="flex-row justify-start gap-6 mt-6">
      <FeatureButton
        icon="magnify"
        label="Find PYQs"
        onPress={() => router.push('/pyqs')} // replace with  actual route
      />
      <FeatureButton
        icon="cards"
        label="Flashcards"
        onPress={() => router.push('/flashcards')} // replace with  actual route
      />
    </View>
  );
}
