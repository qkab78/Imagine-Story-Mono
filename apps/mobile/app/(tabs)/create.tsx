import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Tab "Créer" - Navigue vers le workflow de création
 *
 * Ce composant sert de pont entre le tab bar et le workflow de création
 * qui se trouve en dehors des tabs pour avoir une expérience plein écran.
 *
 */
export default function CreateTab() {
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    // Only navigate when the tab is actually focused (user clicked on it)
    if (isFocused) {
      router.push('/stories/creation/welcome');
    }
  }, [isFocused, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2F6B4F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F1',
  },
});
