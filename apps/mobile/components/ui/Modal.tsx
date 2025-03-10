import { View, Text } from 'react-native'
import React, { PropsWithChildren } from 'react'
import { Button, Dialog, ScrollView, Unspaced, XStack } from 'tamagui'
import { CircleXIcon } from 'lucide-react-native'

const Modal = ({ children }: PropsWithChildren) => {
  return (
    <Dialog modal>
    <Dialog.Trigger asChild>
      <Button>Lire</Button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay
        key="overlay"
        backgroundColor="$shadow6"
        animation="slow"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Dialog.Content
        elevate
        key="content"
        animateOnly={['transform', 'opacity']}
        animation={[
          'quicker',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        gap="$4"
      >
        <XStack height={350} width={'100%'} paddingVertical={20}>
          {children}
        </XStack>

        <Unspaced>
          <Dialog.Close asChild>
            <Button
              position="absolute"
              top="$3"
              right="$3"
              size="$2"
              circular
            >
              <CircleXIcon color={'black'} />
            </Button>
          </Dialog.Close>
        </Unspaced>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog>
  )
}

export default Modal