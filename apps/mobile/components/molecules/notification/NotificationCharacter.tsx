import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NotificationBubble } from '@/components/atoms/notification';

const COLORS = {
  primary: '#2F6B4F',
  accent: '#F6C177',
  accentWarm: '#E8A957',
  skin: '#FFD4A3',
  textPrimary: '#1F3D2B',
};

export const NotificationCharacter: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Personnage */}
      <View style={styles.character}>
        {/* Tête */}
        <View style={styles.head}>
          <View style={styles.hair} />
          <View style={styles.eyes}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.smile} />
        </View>
        {/* Bras */}
        <View style={styles.arm} />
      </View>

      {/* Téléphone */}
      <View style={styles.phone} />

      {/* Bulle de notification */}
      <View style={styles.bubbleContainer}>
        <NotificationBubble emojis="👋 📚 ❓" delay={500} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  character: {
    width: 140,
    height: 160,
    borderRadius: 70,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: COLORS.accent,
    position: 'absolute',
    bottom: 0,
    left: 30,
    alignItems: 'center',
    paddingTop: 20,
  },
  head: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.skin,
    borderRadius: 30,
    position: 'relative',
    marginBottom: 8,
  },
  hair: {
    width: 70,
    height: 35,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    position: 'absolute',
    top: -15,
    left: -5,
  },
  eyes: {
    flexDirection: 'row',
    gap: 12,
    position: 'absolute',
    top: 22,
    left: '50%',
    transform: [{ translateX: -14 }],
  },
  eye: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 4,
  },
  smile: {
    width: 20,
    height: 10,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    bottom: 12,
    left: '50%',
    transform: [{ translateX: -10 }],
  },
  arm: {
    width: 30,
    height: 70,
    backgroundColor: COLORS.skin,
    borderRadius: 15,
    position: 'absolute',
    top: 45,
    right: -15,
    transform: [{ rotate: '-30deg' }],
  },
  phone: {
    width: 40,
    height: 60,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 8,
    position: 'absolute',
    right: 15,
    top: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  bubbleContainer: {
    position: 'absolute',
    right: 0,
    top: 35,
  },
});

export default NotificationCharacter;
