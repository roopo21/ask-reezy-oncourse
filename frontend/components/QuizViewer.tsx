import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MultipleChoiceQuestion from './QuestionCard';
import FlashcardCard from './FlashCard';

type QuizViewerProps = {
  items: any[];
  mode: 'question' | 'flashcard';
};

export default function QuizViewer({ items, mode }: QuizViewerProps) {
  console.warn(mode);
  // mode = 'question';
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentItem = items[currentIndex];

  return (
    <View style={styles.container}>
      {/* Render either question or flashcard */}
      <View style={styles.cardContainer}>
        {mode === 'question' ? (
<MultipleChoiceQuestion key={currentItem.question} {...currentItem} />
        ) : (
          <FlashcardCard {...currentItem} />
        )}
      </View>

      {/* Pagination Controls */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.disabled]}
          onPress={goPrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.counter}>
          {currentIndex + 1} / {items.length}
        </Text>

        <TouchableOpacity
          style={[styles.navButton, currentIndex === items.length - 1 && styles.disabled]}
          onPress={goNext}
          disabled={currentIndex === items.length - 1}
        >
          <Text style={styles.navText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  cardContainer: {
    marginBottom: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
  },
  counter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  disabled: {
    backgroundColor: '#9ca3af',
  },
});
