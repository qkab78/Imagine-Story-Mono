import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import HomeScreen from '../HomeScreen';
import { Stack } from 'expo-router';

// Mock des dépendances
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useSharedValue: () => ({ value: 0 }),
  useAnimatedStyle: () => ({}),
  withTiming: (value: any) => value,
  withRepeat: (value: any) => value,
  withSequence: (value: any) => value,
  runOnJS: (fn: any) => fn,
}));

// Mock du hook useHomeScreen
jest.mock('../../../hooks/useHomeScreen', () => ({
  useHomeScreen: () => ({
    user: {
      id: '1',
      name: 'Emma',
      avatar: 'test-avatar',
      age: 6,
    },
    recentStories: [
      {
        id: '1',
        title: 'Test Story',
        emoji: '🐉',
        duration: 5,
        genre: 'Test',
        createdAt: new Date(),
      },
    ],
    isLoading: false,
    isRefreshing: false,
    refreshData: jest.fn(),
    markStoryAsRead: jest.fn(),
  }),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Stack>{children}</Stack>
);

describe('HomeScreen', () => {
  it('renders correctly with user data', async () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    // Vérifier que les éléments principaux sont présents
    await waitFor(() => {
      expect(getByText('Bonjour Emma ! 👋')).toBeTruthy();
      expect(getByText('Prête pour une nouvelle aventure ?')).toBeTruthy();
      expect(getByText('Créer une histoire')).toBeTruthy();
      expect(getByText('Lire une histoire')).toBeTruthy();
      expect(getByText('✨ Histoires récentes')).toBeTruthy();
    });
  });

  it('handles action card press', async () => {
    const { getByTestId } = render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    const createStoryCard = getByTestId('create-story-card');
    fireEvent.press(createStoryCard);

    // Ici vous pourriez vérifier que la navigation a été appelée
    // avec les bons paramètres
  });

  it('displays age badge correctly', () => {
    const { getByText } = render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    expect(getByText('3-8 ans')).toBeTruthy();
  });

  it('shows recent stories', () => {
    const { getByText } = render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    expect(getByText('Test Story')).toBeTruthy();
  });
});

describe('HomeScreen Accessibility', () => {
  it('has proper accessibility labels', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    expect(getByLabelText(/Créer une histoire/)).toBeTruthy();
    expect(getByLabelText(/Lire une histoire/)).toBeTruthy();
  });

  it('supports VoiceOver navigation', () => {
    const { getAllByRole } = render(
      <TestWrapper>
        <HomeScreen />
      </TestWrapper>
    );

    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});