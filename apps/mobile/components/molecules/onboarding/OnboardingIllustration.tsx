import { View, StyleSheet } from 'react-native';
import { IllustrationType } from '@/components/Onboarding/kidSlides';
import { BooksStack } from './illustrations/BooksStack';
import { MagicWand } from './illustrations/MagicWand';
import { ShieldBadge } from './illustrations/ShieldBadge';
import { PhoneWidget } from './illustrations/PhoneWidget';

interface OnboardingIllustrationProps {
  type: IllustrationType;
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({
  type,
}) => {
  const renderIllustration = () => {
    switch (type) {
      case 'books':
        return <BooksStack />;
      case 'wand':
        return <MagicWand />;
      case 'shield':
        return <ShieldBadge />;
      case 'widget':
        return <PhoneWidget />;
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderIllustration()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});

export default OnboardingIllustration;
