import React from 'react'
import Box from './Box'

type ContainerProps = React.PropsWithChildren<{}>

const Container = ({ children }: ContainerProps) => {
  return (
    <Box marginTop={"xl"} padding={"m"} justifyContent="center" alignItems="center" gap="m">
      {children}
    </Box>
  )
}

export default Container