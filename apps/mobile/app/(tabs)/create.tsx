import { Redirect } from 'expo-router';

/**
 * Tab "Créer" - Redirige vers le workflow de création
 *
 * Ce composant sert de pont entre le tab bar et le workflow de création
 * qui se trouve en dehors des tabs pour avoir une expérience plein écran.
 */
export default function CreateTab() {
  return <Redirect href="/stories/creation/welcome" />;
}
