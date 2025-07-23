import React from 'react'
import Box from '../ui/Box';
import Text from '../ui/Text';
import Button from '../ui/Button';
import { Theme } from '@/config/theme';

type SubSlideProps = {
  subTitle: string;
  onPress: () => void;
  slideColor: keyof Theme["colors"];
  isLast?: boolean;
}

const SubSlide = ({ subTitle, slideColor, isLast, onPress }: SubSlideProps) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal={"l"} gap={"l"}>
      <Text variant="body" style={{ textAlign: "justify" }}>{subTitle}</Text>
      <Button backgroundColor={slideColor} textColor={isLast ? "white" : "textPrimary"} onPress={onPress} label={isLast ? "Get Started" : "Next"} />
    </Box>
  )
}

export default SubSlide