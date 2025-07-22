import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';
import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface MagicalFormFieldProps {
  children: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

const MagicalFormField: React.FC<MagicalFormFieldProps> = ({
  children,
  label,
  icon,
  error,
}) => {
  const theme = useTheme<Theme>();
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withSpring(1, { duration: 1000 });
  }, []);

  const fieldStyle = useAnimatedStyle(() => {
    const shimmerOpacity = interpolate(shimmer.value, [0, 1], [0.8, 1]);
    
    return {
      opacity: shimmerOpacity,
      transform: [{ scale: scale.value }],
    };
  });

  const handleFocus = () => {
    scale.value = withSpring(1.02);
  };

  const handleBlur = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={fieldStyle}>
      <Box
        backgroundColor="white"
        borderRadius="l"
        padding="m"
        marginVertical="s"
        style={[
          styles.fieldContainer,
          { 
            shadowColor: theme.colors.black,
            borderColor: error ? theme.colors.error : theme.colors.magicPurple || '#E8D5FF',
          }
        ]}
      >
        {/* Label with icon */}
        <Box flexDirection="row" alignItems="center" marginBottom="s">
          {icon && <Box marginRight="s">{icon}</Box>}
          <Text variant="body" fontWeight="600" color="textPrimary">
            {label}
          </Text>
        </Box>

        {/* Form field */}
        <Box onTouchStart={handleFocus} onTouchEnd={handleBlur}>
          {children}
        </Box>

        {/* Error message */}
        {error && (
          <Box marginTop="s">
            <Text variant="formError" color="error" fontSize={12}>
              {error}
            </Text>
          </Box>
        )}
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
});

export default MagicalFormField;