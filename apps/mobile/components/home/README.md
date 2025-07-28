# Composants Home Screen - Mon Petit Conteur

Ce dossier contient tous les composants nécessaires pour l'écran d'accueil de l'application "Mon Petit Conteur".

## 🏗️ Architecture

L'écran d'accueil est composé de plusieurs sous-composants modulaires et réutilisables :

### Composants principaux

#### `HomeScreen` 
- **Localisation** : `app/(protected)/home.tsx`
- **Description** : Composant principal qui orchestre l'affichage
- **Responsabilités** : Navigation, gestion des états, coordination des sous-composants

#### `WelcomeHeader`
- **Props** : `WelcomeHeaderProps`
- **Description** : Section d'accueil avec salutation personnalisée et avatar animé
- **Animations** : Avatar avec bounce effect continu

#### `ActionCard`
- **Props** : `ActionCardProps` 
- **Description** : Cartes d'action principale (Créer/Lire des histoires)
- **Design** : Effet glassmorphism avec animations de press

#### `RecentStoriesSection`
- **Props** : `RecentStoriesSectionProps`
- **Description** : Container pour la liste des histoires récentes
- **Gestion** : États vides, loading, liste de StoryItem

#### `StoryItem`
- **Props** : `StoryItemProps`
- **Description** : Item individuel d'histoire avec thumbnail et métadonnées
- **Interactions** : Press, LongPress avec feedback visuel

#### `AgeBadge`
- **Props** : `AgeBadgeProps`
- **Description** : Badge d'âge positionné en absolue
- **Style** : Badge vert sécurisé avec ombre

## 🎨 Design System

### Couleurs
Définies dans `constants/homeStyles.ts` :
- **Background** : Dégradé `#FFF8E1` → `#FFE0F0`
- **Texte principal** : `#2E7D32` (vert foncé)
- **Avatar/Icônes** : Dégradé `#FF6B9D` → `#FFB74D`
- **Cards** : `rgba(255,255,255,0.9)` avec glassmorphism

### Typographie
- **Font** : SF Pro Display (iOS) / Roboto (Android)
- **Tailles** : 12px (meta) → 24px (greeting)
- **Poids** : 400 (regular) → 700 (bold)

### Animations
- **Avatar bounce** : Loop infini, 600ms par cycle
- **Press feedback** : Scale 0.98, 100ms
- **Glassmorphism** : Opacity et backdrop-filter

## 🔧 Utilisation

### Installation des dépendances

```bash
npm install react-native-reanimated expo-linear-gradient
npm install react-native-safe-area-context @react-navigation/native
```

### Import et utilisation

```tsx
import HomeScreen from '@/app/(protected)/home';

// Dans votre navigator
<Stack.Screen 
  name="Home" 
  component={HomeScreen}
  options={{ headerShown: false }}
/>
```

### Utilisation des sous-composants

```tsx
import { WelcomeHeader, ActionCard } from '@/components/home';

<WelcomeHeader user={userData} />
<ActionCard
  title="Créer une histoire"
  description="Invente une nouvelle aventure"
  icon="✨"
  iconGradient={['#FF6B9D', '#FFB74D']}
  onPress={handleCreate}
/>
```

## 🧪 Tests

Les tests sont définis dans `__tests__/HomeScreen.test.tsx` :

```bash
# Lancer les tests
npm test components/home

# Tests avec coverage
npm test -- --coverage components/home
```

### Types de tests
- **Rendering** : Vérification de l'affichage des éléments
- **Interactions** : Press des cartes et navigation
- **Accessibility** : Labels, roles, VoiceOver
- **States** : Loading, empty, error states

## 📱 Responsive Design

L'écran s'adapte automatiquement aux différentes tailles :
- **iPhone SE** (375px) : Layout compact
- **iPhone Pro Max** (414px) : Layout standard
- **iPad** (768px+) : Layout étendu (futur)

## ⚡ Performance

### Optimisations implémentées
- **Memoization** : React.memo sur les sous-composants
- **useCallback** : Handlers de navigation et interactions
- **FlatList** : Rendu optimisé pour les listes de stories
- **Native driver** : Animations 60fps garanties

### Métriques cibles
- **TTI** (Time To Interactive) : < 2s
- **FPS** : 60fps pour toutes les animations
- **Memory** : < 50MB usage peak

## 🌐 Accessibilité

### Features implémentées
- **VoiceOver** : Labels descriptifs pour enfants
- **Touch targets** : 44x44px minimum
- **Contraste** : WCAG AA compliant
- **Dynamic Type** : Support des tailles de police système

### Test d'accessibilité
```bash
# Activer VoiceOver sur simulateur iOS
# Tester la navigation avec gestures
# Vérifier les announcements
```

## 🔄 États de l'écran

### Loading State
- Spinner centré avec message d'encouragement
- Dégradé de background maintenu
- Durée simulée : 1s

### Empty State  
- Message encourageant "Crée ta première histoire"
- Call-to-action vers création
- Illustration friendly

### Error State
- Message d'erreur child-friendly
- Bouton retry avec animation
- Fallback graceful

## 🚀 Prochaines améliorations

### Phase 2
- [ ] Support mode sombre
- [ ] Animations d'entrée staggered
- [ ] Pull-to-refresh personnalisé
- [ ] Recherche en temps réel

### Phase 3
- [ ] Layout iPad optimisé
- [ ] Gestures avancés (swipe, pinch)
- [ ] Offline-first avec sync
- [ ] Analytics intégrés

## 📚 Resources

- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)