import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FlashcardCard({ front, back }: any) {
  const [flipped, setFlipped] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={() => setFlipped(!flipped)}>
      <Text style={styles.text}>{flipped ? back : front}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  text: { fontSize: 16, textAlign: 'center' },
});
