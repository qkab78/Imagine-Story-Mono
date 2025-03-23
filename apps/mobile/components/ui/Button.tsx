import { TouchableOpacity } from "react-native";
import { backgroundColor, BackgroundColorProps, border, BorderProps, composeRestyleFunctions, spacing, SpacingProps, useRestyle } from "@shopify/restyle";
import { Theme } from "@/config/theme";
import Box from "./Box";
import Text from "./Text";


type RestyleProps = SpacingProps<Theme> & BorderProps<Theme> & BackgroundColorProps<Theme>;

type ButtonProps = RestyleProps & {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const WIDTH = 300;
const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([spacing, border, backgroundColor]);

const Button = ({ onPress, label, disabled, ...rest }: ButtonProps) => {
  const props = useRestyle(restyleFunctions, rest);
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Box {...props} padding="m" borderRadius="m" backgroundColor={"primaryCardBackground"} borderWidth={1} width={WIDTH * .5} justifyContent="center" alignItems="center">
        <Text variant="buttonLabel" color={"textSecondary"}>{label}</Text>
      </Box>
    </TouchableOpacity>
  )
}

export default Button;