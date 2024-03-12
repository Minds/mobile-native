import React from 'react';
import { Screen, ScreenHeader } from '~/common/ui';

export default function ChatMembersScreen() {
  return (
    <Screen safe>
      <ScreenHeader back={true} title="Chat Members" />
    </Screen>
  );
}
