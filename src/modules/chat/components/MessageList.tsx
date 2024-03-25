import React, { useCallback, useRef } from 'react';

import Message from './Message';
import { FlatList, StyleSheet } from 'react-native';
import ChatInput from './ChatInput';
import { showMessageMenu } from './MessageMenu';
import {
  useChatRoomMessageContext,
  ChatRoomMessagesProvider,
} from '../contexts/ChatRoomMessageContext';

type Props = {
  roomGuid: string;
  isRequest?: boolean;
};

function MessageFlatList({ isRequest }: Props) {
  const { query, send, messages } = useChatRoomMessageContext();
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
        windowSize={5}
        // @ts-ignore since we don't use the params we ignore the error, fixing it will require an unnecessary memoization
        onEndReached={query.fetchNextPage}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
      />
      {!isRequest && <ChatInput onSendMessage={sendMessage} />}
    </>
  );
}

const renderMessage = ({ item }) => {
  return <Message message={item} onLongPress={showMessageMenu} />;
};

/**
 * Message list component
 */
const MessageList = (props: Props) => {
  return (
    <ChatRoomMessagesProvider roomGuid={props.roomGuid}>
      <MessageFlatList {...props} />
    </ChatRoomMessagesProvider>
  );
};

export default MessageList;

const maintainVisibleContentPosition = {
  autoscrollToTopThreshold: 50,
  minIndexForVisible: 1,
};

const keyExtractor = item => item.node.guid;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
