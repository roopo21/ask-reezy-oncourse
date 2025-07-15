import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions, Alert } from 'react-native';
import { getMockedQuiz } from '../utils/api';
import MultipleChoiceQuestion from '../components/QuestionCard';
import FlashcardCard from '../components/FlashCard';
import BottomInput from '../components/BottomInput';
import { router, useLocalSearchParams } from 'expo-router';
import QuizViewer from '../components/QuizViewer'; // extract this separately
import RezzyHeader from '../components/RezzyHeader';
import { yellow100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { io } from 'socket.io-client';


export default function QuizScreen() {
  const { width, height } = Dimensions.get('window');
  
  const { query } = useLocalSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [llmResponse, setLlmResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'question' | 'flashcard'>('question');


useEffect(() => {
  console.warn('✅ Initiating socket connection to server');

  const socket = io('http://192.168.100.121:3000', {
    transports: ['websocket'],
  });

  setLlmResponse('');
  setLoading(true);

  socket.on('connect', () => {
    console.warn('✅ Connected to socket server');
    socket.emit('query', { query, type: mode });
  });

  socket.on('json', (parsedItems) => {
    console.warn('✅ Received structured items (MCQs or Flashcards)', parsedItems);
      if (parsedItems?.[0]?.question) {
    setMode('question');
  } else if (parsedItems?.[0]?.front) {
    setMode('flashcard');
  } else {
    console.warn('⚠️ Could not infer mode — defaulting to "question"');
    setMode('question');
  }
    setItems(parsedItems);
  });


  socket.on('connect_error', (err) => {
    console.warn('❌ Connection error:', err);
    setLoading(false);
  });

let streamingQueue = '';
let isStreaming = false;

const streamCharacters = (text: string) => {
  streamingQueue += text;

  if (isStreaming) return; // already streaming

  isStreaming = true;
  const streamNext = () => {
    if (streamingQueue.length > 0) {
      const nextChar = streamingQueue[0];
      streamingQueue = streamingQueue.slice(1);
      setLlmResponse((prev) => prev + nextChar);
      setTimeout(streamNext, 12);
    } else {
      isStreaming = false;
    }
  };
  streamNext();
};

socket.on('stream', (chunk) => {
  if (typeof chunk === 'string' && chunk.trim() && chunk !== 'undefined') {
    streamCharacters(chunk);
  } else {
    console.warn('❌ Ignored invalid chunk:', chunk);
  }
});

  socket.on('end', () => {
    console.warn('🎉 Stream ended');
    setLoading(false);
    socket.disconnect();
  });

  socket.on('error', (err) => {
    console.error('🔥 socket error:', err);
    setLoading(false);
  });

  return () => {
    socket.disconnect();
  };
}, [query]);




  return (
<SafeAreaView style={{ flex: 1 }}>
            <Image
              source={require('../assets/background.png')}
    style={[styles.backgroundImage, { opacity: 0.5, width, height }]}
            />

  {/* Main content */}
  <View style={{ flex: 1 }}>
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* User Query Bubble */}
      <View style={styles.userQueryBubble}>
        <Text style={styles.userQueryText}>{query}</Text>
      </View>

      <RezzyHeader />

      {/* LLM Streaming Response */}
      <View style={[styles.bubble, styles.botBubble]}>
        <Text style={styles.llmText}>{llmResponse}</Text>
        {loading && <ActivityIndicator size="small" />}
      </View>

      {/* MCQs / Flashcards */}
      {items.length > 0 && (
        <QuizViewer items={items} mode={mode as 'question' | 'flashcard'} />
      )}
    </ScrollView>

    {/* Bottom input stays fixed below */}
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
  scrollContainer: {
  padding: 16,
  paddingBottom: 100, // Enough space to not collide with BottomInput
},
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
