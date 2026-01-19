import { useEffect } from 'react';
import { useRouter } from 'expo-router';
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

  useEffect(() => {
    router.push('/stories/creation/welcome');
  }, [router]);

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
