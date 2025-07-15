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
                onPress={() => router.push({
                    pathname: '/quiz',
                    params: {
                        random: 'true',
                        query: 'Give me some random medical concepts', // or empty
                        mode: 'question', // 'question' or 'flashcard' if needed temporarily
                    },
                })} // replace with  actual route
            />
            <FeatureButton
                icon="cards"
                label="Flashcards"
                onPress={() => router.push({
                    pathname: '/quiz',
                    params: {
                        random: 'true',
                        query: 'Give me some random medical concepts', // or empty
                        mode: 'flashcard', // 'question' or 'flashcard' if needed temporarily
                    },
                })} // replace with  actual route
            />
        </View>
    );
}
