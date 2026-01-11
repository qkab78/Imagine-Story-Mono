import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

interface StoryListLayoutProps {
  children: React.ReactNode;
  gradientColors?: [string, string];
}

export const StoryListLayout: React.FC<StoryListLayoutProps> = ({
  children,
  gradientColors = [colors.backgroundOrange, colors.backgroundPink],
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default StoryListLayout;
