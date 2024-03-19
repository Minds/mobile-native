import React from 'react';
import { Icon, Screen } from '~/common/ui';
import MessageList from '../components/MessageList';
import ChatHeader from '../components/ChatHeader';
import { TouchableOpacity } from 'react-native';

export default function ChatScreen({ navigation, route }) {
  const { roomGuid, members } = route.params || {};

  return (
    <Screen safe>
      {members && (
        <ChatHeader
          members={members}
          extra={
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatDetails', { members })}>
              <Icon name="info-circle" size={20} />
            </TouchableOpacity>
          }
        />
      )}
      <MessageList roomGuid={roomGuid} />
    </Screen>
  );
}
