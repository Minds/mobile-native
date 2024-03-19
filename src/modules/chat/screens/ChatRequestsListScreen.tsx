import React from 'react';
import { Screen, ScreenHeader } from '~/common/ui';

export default function ChatRequestsListScreen() {
  return (
    <Screen safe>
      <ScreenHeader back={true} title="Chat Requests" />
    </Screen>
  );
}
