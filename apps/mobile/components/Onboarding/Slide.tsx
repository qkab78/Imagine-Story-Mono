import { useTheme } from "@shopify/restyle";
import Box from "../ui/Box"
import Text from "../ui/Text"
import { Dimensions } from "react-native"
import { Theme } from "@/config/theme";
import { View } from "tamagui";

type SlideProps = {
  label: string;
  right?: boolean;
}

const { width, height } = Dimensions.get('window');

export const SLIDER_HEIGHT = height * 0.61;

const Slide = ({ label, right }: SlideProps) => {
  const theme = useTheme<Theme>();

  return (
    <Box
      width={width}
      alignItems="center"
      gap={"xl"}
    >
      <View style={{
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        width,
        transform: [
          { translateY: (SLIDER_HEIGHT - 100) / 2 },
          { translateX: right ? width / 2 - 50 : -width / 2 + 50 },
          { rotate: right ? "-90deg" : "90deg" },
        ],
      }}>
        <Text variant="title" style={{
          fontSize: 70,
          color: theme.colors.textPrimary,
          textAlign: "center",
          lineHeight: 80,
        }}>{label}</Text>
      </View>
    </Box>
  )
}

export default Slide