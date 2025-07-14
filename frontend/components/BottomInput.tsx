import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BottomInputProps = {
  onSubmit: (text: string) => void;
};

export default function BottomInput({ onSubmit }: BottomInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask anything..."
          value={text}
          onChangeText={setText}
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="arrow-up" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    color: '#4b5563',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 30,
  },
});
