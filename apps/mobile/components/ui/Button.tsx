import { TouchableOpacity, Dimensions } from "react-native";
import { backgroundColor, BackgroundColorProps, border, BorderProps, composeRestyleFunctions, spacing, SpacingProps, useRestyle } from "@shopify/restyle";
import { Theme } from "@/config/theme";
import Box from "./Box";
import Text from "./Text";
import { LucideIcon } from "lucide-react-native";


type RestyleProps = SpacingProps<Theme> & BorderProps<Theme> & BackgroundColorProps<Theme>;

type ButtonProps = RestyleProps & {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  textColor?: keyof Theme["colors"];
  bgColor?: keyof Theme["colors"];
  Icon?: LucideIcon;
}

const { width } = Dimensions.get("window")
const WIDTH = width * .5;
const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([spacing, border, backgroundColor]);

const Button = ({ onPress, label, disabled, textColor, bgColor, Icon, ...rest }: ButtonProps) => {
  const props = useRestyle(restyleFunctions, rest);
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Box {...props} padding="m" borderRadius="m" backgroundColor={bgColor || "primaryCardBackground"} width={WIDTH} justifyContent="center" alignItems="center" flexDirection={"row"} gap={"s"}>
        {Icon && <Icon size={20} color={textColor || "black"} />}
        <Text variant="buttonLabel" color={textColor || "textPrimary"}>{label}</Text>
      </Box>
    </TouchableOpacity>
  )
}

export default Button;