import { type Control, useController } from "react-hook-form";
import { TextInput as RNTextInput, TextInputProps } from "react-native";
import Box from "../ui/Box";
import { Check, type LucideIcon, X } from "lucide-react-native";
import { useTheme } from "@shopify/restyle";
import { theme, Theme } from "@/config/theme";

interface FormInputProps extends TextInputProps {
  name: string,
  placeholder: string,
  control: Control<any>,
  Icon: LucideIcon
  showPassword?: boolean
  multiline?: boolean
  numberOfLines?: number

}
const SIZE = theme.borderRadii.m * 2;
const ICON_SIZE = SIZE * .75;
const HEIGHT = SIZE * 2.5;
const TEXT_AREA_HEIGHT = 100;

const TextInput = ({ name, control, Icon, placeholder, multiline, numberOfLines, showPassword }: FormInputProps) => {
  const theme = useTheme<Theme>();
  const { field, fieldState } = useController({ name, control });
  const { onChange, onBlur, value } = field
  const { isTouched, invalid } = fieldState;

  const borderColor = !isTouched ? "black" : invalid ? "error" : "success";
  const color = theme.colors[borderColor];

  return (
    <Box height={multiline ? TEXT_AREA_HEIGHT : HEIGHT} flexDirection="row" justifyContent="space-between" padding={"s"} alignItems="center" gap={"s"} borderColor={borderColor} borderRadius={"m"}>
      <Box flexDirection={"row"} gap={"s"} alignItems="center">
        <Icon color={invalid ? theme.colors.error : color} />
        <RNTextInput
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          secureTextEntry={name === "password" && !showPassword}
          underlineColorAndroid="transparent"
          placeholderTextColor={color}
          style={{ color }}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </Box>
      {isTouched && (
        <Box height={SIZE} width={SIZE} justifyContent="center" alignItems="center" borderColor={borderColor} borderWidth={1} borderRadius={"m"}>
          {isTouched && invalid ? (
            <X color={theme.colors.error} size={ICON_SIZE} />
          ) : (
            <Check color={theme.colors.success} size={ICON_SIZE} />
          )}
        </Box>
      )}
    </Box>
  )
}

export default TextInput;