import React from 'react'
import Box from './Box'

type ContainerProps = React.PropsWithChildren<{}>

const Container = ({ children }: ContainerProps) => {
  return (
    <Box paddingHorizontal={"m"} justifyContent="space-around" alignItems="center" gap="m">
      {children}
    </Box>
  )
}

export default Container