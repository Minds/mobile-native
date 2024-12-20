import React, { useCallback, useRef } from 'react';

import Message from './Message';
import { FlatList, StatusBar, StyleSheet } from 'react-native';
import ChatInput from './ChatInput';
import { showMessageMenu } from './MessageMenu';
import {
  useChatRoomMessageContext,
  ChatRoomMessagesProvider,
} from '../contexts/ChatRoomMessageContext';
import { useSetReadReceipt } from '../hooks/useSetReadReceipt';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import sp from '~/services/serviceProvider';

type Props = {
  roomGuid: string;
  isRequest?: boolean;
};

function MessageFlatList({ isRequest }: Props) {
  const { fetchNextPage, send, messages, roomGuid } =
    useChatRoomMessageContext();
  const listRef = useRef<FlatList>(null);
  const setReceipt = useSetReadReceipt();

  const onViewableItemsChanged = useCallback(
    ({ _, viewableItems }: any) => {
      if (viewableItems[0]) {
        setReceipt(roomGuid, viewableItems[0].item.node.guid);
      }
    },
    [roomGuid, setReceipt],
  );

  const sendMessage = useCallback(
    message => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      send(message);
    },
    [send],
  );

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      keyboardVerticalOffset={statusBarHeight}
      style={sp.styles.style.flexContainer}>
      <FlatList
        ref={listRef}
        data={messages}
        onViewableItemsChanged={onViewableItemsChanged}
        maintainVisibleContentPosition={maintainVisibleContentPosition}
        contentContainerStyle={styles.container}
        inverted
        onEndReachedThreshold={1}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={12}
        windowSize={5}
        // @ts-ignore since we don't use the params we ignore the error, fixing it will require an unnecessary memoization
        onEndReached={fetchNextPage}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
      />
      {!isRequest && <ChatInput onSendMessage={sendMessage} />}
    </KeyboardAvoidingView>
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

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 1500,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
