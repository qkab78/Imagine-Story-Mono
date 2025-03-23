import React from 'react'
import Box from './Box'
import { Dimensions } from 'react-native'

type ContainerProps = React.PropsWithChildren<{}>

const { width, height } = Dimensions.get('window')
const HEIGHT = height - 100

const Container = ({ children }: ContainerProps) => {
  return (
    <Box paddingHorizontal={"m"} justifyContent="space-around" alignItems="center" gap="m" height={HEIGHT}>
      {children}
    </Box>
  )
}

export default Container