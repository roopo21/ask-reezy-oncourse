import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MultipleChoiceQuestion({ question, options, correct_answer }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question}</Text>
      {options.map((opt: string) => {
        const isSelected = selected === opt;
        const isCorrect = opt === correct_answer;
        const isWrong = isSelected && !isCorrect;

        return (
          <TouchableOpacity
            key={opt}
            onPress={() => setSelected(opt)}
            disabled={!!selected}
            style={[
              styles.option,
              isCorrect && selected ? styles.correct : null,
              isWrong ? styles.wrong : null,
            ]}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 12, padding: 16, backgroundColor: '#fff', borderRadius: 10 },
  question: { fontSize: 16, marginBottom: 10, fontWeight: '600' },
  option: { padding: 12, marginVertical: 6, borderRadius: 6, backgroundColor: '#eee' },
  optionText: { fontSize: 14 },
  correct: { backgroundColor: '#b5f7b0' },
  wrong: { backgroundColor: '#f7b0b0' },
});
