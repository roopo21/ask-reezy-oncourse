import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Option = {
  text: string;
  is_correct: boolean;
};

type Props = {
  question: string;
  options: Option[];
  answer?: string; // optional fallback
};

export default function MultipleChoiceQuestion({ question, options, answer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null);
  }, [question]);

  // Determine correct answer (either from options or fallback)
  const correctOption = options.find(opt => opt.is_correct);
  const correctAnswerText = correctOption?.text || answer || '';

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question}</Text>

      {options.map((opt) => {
        const isSelected = selected === opt.text;
        const isCorrect = opt.text === correctAnswerText;
        const isWrong = isSelected && !isCorrect;

        return (
          <TouchableOpacity
            key={opt.text}
            onPress={() => setSelected(opt.text)}
            disabled={!!selected}
            style={[
              styles.option,
              isCorrect && selected ? styles.correct : null,
              isWrong ? styles.wrong : null,
            ]}
          >
            <Text style={styles.optionText}>{opt.text}</Text>
          </TouchableOpacity>
        );
      })}

      {selected && (
        <Text style={styles.feedback}>
          {selected === correctAnswerText
            ? '✅ Correct!'
            : `❌ Incorrect. Correct answer: ${correctAnswerText}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#111827',
  },
  option: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 14,
    color: '#1f2937',
  },
  correct: {
    backgroundColor: '#d1fae5',
  },
  wrong: {
    backgroundColor: '#fee2e2',
  },
  feedback: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
});
