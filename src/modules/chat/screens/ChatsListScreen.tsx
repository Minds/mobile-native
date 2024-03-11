import React from 'react';
import { Button, Screen, ScreenHeader } from '~/common/ui';

export default function ChatsListScreen({ navigation }: any) {
  return (
    <Screen>
      <ScreenHeader back={false} title="Chats" />
      <Button
        onPress={() => {
          navigation.navigate('ChatRequestsList');
        }}>
        Go to chat requests
      </Button>
      <Button
        top="M"
        onPress={() => {
          navigation.push('ChatStack');
        }}>
        Go to chat
      </Button>
    </Screen>
  );
}
