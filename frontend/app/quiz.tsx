import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions } from 'react-native';
import { getMockedQuiz } from '../utils/api';
import MultipleChoiceQuestion from '../components/QuestionCard';
import FlashcardCard from '../components/FlashCard';
import BottomInput from '../components/BottomInput';
import { router, useLocalSearchParams } from 'expo-router';
import QuizViewer from '../components/QuizViewer'; // extract this separately
import RezzyHeader from '../components/RezzyHeader';

export default function QuizScreen() {
  const { width, height } = Dimensions.get('window');
  
  const { query, mode } = useLocalSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [llmResponse, setLlmResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let itemIdx = 0;
    let chunkIdx = 0;
    let streamed: any[] = [];
    let streamedText = '';

    const fetchData = async () => {
      console.log(mode);
      const res = await getMockedQuiz(mode , query);

      // Stream text response
      const textInterval = setInterval(() => {
        if (chunkIdx >= res.llmChunks.length) {
          clearInterval(textInterval);
          return;
        }
        streamedText += res.llmChunks[chunkIdx];
        setLlmResponse(streamedText);
        chunkIdx++;
      }, 500);

      // Stream questions/flashcards
      const itemInterval = setInterval(() => {
        if (itemIdx >= res.content.length) {
          clearInterval(itemInterval);
          setLoading(false);
          return;
        }
        streamed = [...streamed, res.content[itemIdx]];
        setItems([...streamed]);
        itemIdx++;
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1}}>
            <Image
              source={require('../assets/background.png')}
              style={[styles.backgroundImage, { opacity: 0.5, width, height}]}
            />

    <View style={{ flex: 1, padding: 16 }}>
      {/* User Query Bubble */}
      <View style={styles.userQueryBubble}>
        <Text style={styles.userQueryText}>{query}</Text>
      </View>

      {/* Streaming Answer Bubble */}
      <RezzyHeader/>
      <View style={[styles.bubble, styles.botBubble]}>

        <Text style={styles.llmText}>{llmResponse}</Text>
        {loading && <ActivityIndicator size="small" />}
      </View>

      {/* Quiz Viewer (Prev/Next flashcard or questions) */}
      {items.length > 0 && <QuizViewer items={items} mode={mode as 'question'|'flashcard'} />}

      <BottomInput
        onSubmit={(query) => {
          router.push({ pathname: '/quiz', params: { query, mode } });
        }}
      />
    </View>
      
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
userQueryBubble: {
  backgroundColor: '#3b82f6', // Blue background
  padding: 12,
  borderRadius: 16,
  maxWidth: '85%',
  alignSelf: 'flex-end', // Aligns to the right
  marginBottom: 12,
},
userQueryText: {
  color: '#fff', // White text for contrast
  fontSize: 16,
},
  bubble: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 16,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1d5db',
  },
  queryText: {
    fontSize: 16,
    color: '#111827',
  },
  llmText: {
    fontSize: 15,
    color: '#1f2937',
  },
    backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
});
