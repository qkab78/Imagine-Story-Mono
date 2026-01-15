import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@/components/ui/Text';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: '#1F3D2B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '400',
    color: '#4A6B5A',
    textAlign: 'center',
  },
});

export default EmptyState;
