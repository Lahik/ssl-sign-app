import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function LargeButton({ text, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1f7ae0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});