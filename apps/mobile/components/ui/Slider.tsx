import { Text } from 'react-native'
import React from 'react'
import { SliderProps, Slider as TamaguiSlider } from "tamagui";
import { Control, useController } from 'react-hook-form'
import { useTheme } from '@shopify/restyle'
import type { Theme } from '@/config/theme'
import Box from './Box'


type SliderInputProps = SliderProps & {
  name: string,
  text: string,
  control: Control<any>
}

const Slider = ({ control, name, text, ...rest }: SliderInputProps) => {
  const theme = useTheme<Theme>();
  const { field } = useController({ name, control });

  return (
    <Box flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={"l"}>
      <TamaguiSlider width={200} size="$4" name="childAge" step={1} min={3} max={10} onValueChange={(value) => field.onChange(value[0])} onBlur={field.onBlur} {...rest}>
        <TamaguiSlider.Track style={{ backgroundColor: theme.colors.primaryCardBackground }}>
          <TamaguiSlider.TrackActive />
        </TamaguiSlider.Track>
        <TamaguiSlider.Thumb size="$2" index={0} circular />
      </TamaguiSlider>
      <Text>{`${field.value} ${text}`}</Text>
    </Box>
  )
}

export default Slider