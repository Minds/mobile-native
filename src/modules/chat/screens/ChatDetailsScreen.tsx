import React from 'react';
import { Button, Screen, ScreenHeader } from '~/common/ui';

export default function ChatDetailsScreen({ navigation }) {
  return (
    <Screen>
      <ScreenHeader back={true} title="Chat detail" />

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
