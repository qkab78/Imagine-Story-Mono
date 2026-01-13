import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Settings Screen - Placeholder
 *
 * Écran de paramètres (langue, âge, chapitres) - À implémenter en Phase 4
 */
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen - Coming in Phase 4</Text>
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
