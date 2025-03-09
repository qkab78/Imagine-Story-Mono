import { Controller } from "react-hook-form"
import { TextInput } from "react-native"

export const Input = ({ name, control, password, editable, multiline, numberOfLines, maxLength, textColor = 'white', keyboardType = "default" }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={{ borderColor: 'gray', borderWidth: 1, color: textColor, borderRadius: 5, padding: 20, width: 300 }}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder={name}
          secureTextEntry={password}
          editable={!!editable}
          multiline={!!multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          keyboardType={keyboardType}
        />
      )}
    />
  )
}