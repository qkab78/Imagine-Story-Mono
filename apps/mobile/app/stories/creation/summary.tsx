import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Summary Screen - Placeholder
 *
 * Écran de résumé avant génération - À implémenter en Phase 7
 */
export default function SummaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Summary Screen - Coming in Phase 7</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  text: {
    fontSize: 18,
    color: '#2F6B4F',
  },
});
