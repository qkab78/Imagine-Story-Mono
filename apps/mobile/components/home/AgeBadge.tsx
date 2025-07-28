import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Text, View } from 'react-native';
import type { AgeBadgeProps } from '@/types/home';

const AgeBadge: React.FC<AgeBadgeProps> = ({ minAge, maxAge }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {minAge}-{maxAge} ans
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default AgeBadge;