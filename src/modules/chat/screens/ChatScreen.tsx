import React from 'react';
import { Button, Screen, ScreenHeader } from '~/common/ui';

export default function ChatScreen({ navigation }) {
  return (
    <Screen>
      <ScreenHeader back={true} title="Chat" />
      <Button
        onPress={() => {
          navigation.navigate('ChatDetails');
        }}>
        Go to chat details
      </Button>
      <Button
        top="M"
        onPress={() => {
          navigation.navigate('ChatMembers');
        }}>
        Go to chat members
      </Button>
    </Screen>
  );
}
