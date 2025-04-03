import { type Control, useController } from "react-hook-form";
import { ArrowDown, ArrowUp } from "lucide-react-native";
import Text from "../ui/Text";

import { Adapt, Select as TamaguiSelect, Sheet, YStack, SelectProps } from "tamagui";

type SelectInputProps = SelectProps & {
  name: string,
  placeholder: string,
  items: Record<string, any>[],
  control: Control<any>,
}
const Select = ({ name, placeholder, items, control }: SelectInputProps) => {
  const { field } = useController({ name, control });

  const handleChange = (value: string) => {
    console.log({ name, control, field, value });
    field.onChange(value);
  }

  return (
    <TamaguiSelect disablePreventBodyScroll onValueChange={handleChange} value={field.value}>
      <TamaguiSelect.Trigger iconAfter={ArrowDown}>
        <TamaguiSelect.Value placeholder={placeholder} />
      </TamaguiSelect.Trigger>

      <Adapt platform="touch">
        <Sheet native modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <TamaguiSelect.Content zIndex={200000}>
        <TamaguiSelect.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ArrowUp size={20} />
          </YStack>
        </TamaguiSelect.ScrollUpButton>
        <TamaguiSelect.Viewport minWidth={200}>
          <TamaguiSelect.Group>
            <TamaguiSelect.Label>
              <Text variant={"body"}>Languages</Text>
            </TamaguiSelect.Label>
            {items.map((item, index) => {
              return (
                <TamaguiSelect.Item key={item.key} index={index} value={item.key}>
                  <TamaguiSelect.ItemText>
                    <Text variant={"body"}>{item.value}</Text>
                  </TamaguiSelect.ItemText>
                </TamaguiSelect.Item>
              )
            }
            )}
          </TamaguiSelect.Group>
        </TamaguiSelect.Viewport>
        <TamaguiSelect.ScrollDownButton />
      </TamaguiSelect.Content>
    </TamaguiSelect>
  )
}

export default Select