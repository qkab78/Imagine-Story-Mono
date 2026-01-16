import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AgeBadgeProps {
  ageRange: string;
}

export const AgeBadge: React.FC<AgeBadgeProps> = ({ ageRange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ageRange}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 24,
    backgroundColor: '#2F6B4F',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 50,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
});

export default AgeBadge;
