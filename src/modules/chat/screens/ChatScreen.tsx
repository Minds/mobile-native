import React from 'react';
import { Icon, Screen } from '~/common/ui';
import MessageList from '../components/MessageList';

import ChatInput from '../components/ChatInput';
import { CheatHeader } from './CheatHeader';
import { useChatQuery } from '../hooks/useChatQuery';
import { TouchableOpacity } from 'react-native';

export default function ChatScreen({ navigation }) {
  const { data } = useChatQuery('1');
  const items = data?.messages || [];
  return (
    <Screen safe>
      {data?.members && (
        <CheatHeader
          members={data?.members}
          extra={
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatDetails')}>
              <Icon name="info-circle" size={20} />
            </TouchableOpacity>
          }
        />
      )}
      <MessageList data={items} />
      <ChatInput onSendMessage={t => console.log('new message', t)} />
    </Screen>
  );
}
