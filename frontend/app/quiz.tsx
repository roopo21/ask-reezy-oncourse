import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions, Alert } from 'react-native';
import BottomInput from '../components/BottomInput';
import { router, useLocalSearchParams } from 'expo-router';
import QuizViewer from '../components/QuizViewer'; // extract this separately
import RezzyHeader from '../components/RezzyHeader';
import { yellow100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { io } from 'socket.io-client';


export default function QuizScreen() {
  const { width, height } = Dimensions.get('window');
  
  const { query, mode } = useLocalSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [llmResponse, setLlmResponse] = useState('');
  const [loading, setLoading] = useState(true);

useEffect(() => {
  console.warn('✅ Initiating socket connection to server');

  const socket = io('http://192.168.100.121:3000', {
    transports: ['websocket'],
  });

  // Reset state
  setLlmResponse('');
  setItems([]);
  setLoading(true);

  // Connection established
  socket.on('connect', () => {
    console.warn('✅ Connected to socket server');
    socket.emit('query', { query, type: mode });
  });

  socket.on('connect_error', (err) => {
    console.warn('❌ Connection error:', err);
    setLoading(false);
  });

  let responseBuffer = '';
  let inJsonPhase = false;
  const splitMarker = mode === 'question' ? 'MCQs:' : 'Flashcards:';

  socket.on('stream', (chunk) => {
    // Clean chunk of weird chars
    const cleanChunk = chunk.replace(/[^\x20-\x7E\s]/g, '');

    responseBuffer += cleanChunk;

    if (inJsonPhase) return;

    // Check if JSON part has started
    if (responseBuffer.includes(splitMarker)) {
      inJsonPhase = true;

      const [chatPart] = responseBuffer.split(splitMarker);

      const cleanedChat = chatPart
        .split('\n')
        .filter((line) => !line.trim().toLowerCase().startsWith('Answer:'))
        .join('\n')
        .trim();

      setLlmResponse(cleanedChat);
    } else {
      // Stream full lines or coherent parts (not per-char)
      const lastNewline = cleanChunk.lastIndexOf('\n');
      const streamChunk = lastNewline !== -1
        ? cleanChunk.slice(0, lastNewline + 1)
        : cleanChunk;

      setLlmResponse((prev) => prev + streamChunk);
    }
  });

  socket.on('end', () => {
    console.warn('🎉 Stream ended');

    if (inJsonPhase) {
      const parts = responseBuffer.split(splitMarker);
      let itemsPart = parts[1]?.trim() || '';

      // Only take up to last closing bracket to avoid junk
      const lastIndex = itemsPart.lastIndexOf(']');
      if (lastIndex !== -1) {
        itemsPart = itemsPart.slice(0, lastIndex + 1);
      }

      try {
        const parsed = JSON.parse(itemsPart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          console.warn('⚠️ Parsed items are not an array');
        }
      } catch (err) {
        console.warn('⚠️ Could not parse JSON:', err, '\nRaw JSON:', itemsPart);
      }
    }

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
