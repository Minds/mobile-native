import React, { useCallback, useRef } from 'react';

import Message from './Message';
import { FlatList, StyleSheet } from 'react-native';
import { useChatRoomMessagesQuery } from '../hooks/useChatRoomMessagesQuery';
import ChatInput from './ChatInput';

const renderMessage = ({ item }) => {
  return <Message message={item} />;
};

export default function MessageList({ roomGuid }) {
  const { query, send, messages } = useChatRoomMessagesQuery(roomGuid);
  const listRef = useRef<FlatList>(null);

  const sendMessage = useCallback(
    message => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      send(message);
    },
    [send],
  );

  return (
    <>
      <FlatList
        ref={listRef}
        data={messages}
        maintainVisibleContentPosition={maintainVisibleContentPosition}
        contentContainerStyle={styles.container}
        inverted
        onEndReachedThreshold={1}
        initialNumToRender={12}
        onEndReached={() => {
          query.fetchNextPage();
        }}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
      />
      <ChatInput onSendMessage={sendMessage} />
    </>
  );
}

const maintainVisibleContentPosition = {
  autoscrollToTopThreshold: 50,
  minIndexForVisible: 1,
};

const keyExtractor = item => item.node.id;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
