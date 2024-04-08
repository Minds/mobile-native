import React, { createContext } from 'react';
import {
  ChatRoomMembersListQuery,
  useChatRoomMembersListQuery,
} from '../hooks/useChatRoomMembersListQuery';
import { GetChatRoomQuery } from '~/graphql/api';

export type ChatRoomMembersContextType = ChatRoomMembersListQuery & {
  chatRoom: GetChatRoomQuery['chatRoom'];
};

// Context
const ChatRoomMembersContext = createContext<ChatRoomMembersContextType | null>(
  null,
);

export const ChatRoomMembersProvider = ({
  children,
  roomGuid,
  chatRoom,
}: {
  children: React.ReactNode;
  roomGuid: string;
  chatRoom: GetChatRoomQuery['chatRoom'];
}) => {
  const chatRoomMembers: ChatRoomMembersContextType = {
    chatRoom,
    ...useChatRoomMembersListQuery(roomGuid),
  };

  return (
    <ChatRoomMembersContext.Provider value={chatRoomMembers}>
      {children}
    </ChatRoomMembersContext.Provider>
  );
};

export const useChatRoomMembersContext = () => {
  const context = React.useContext(ChatRoomMembersContext);
  if (!context) {
    throw new Error(
      'useChatRoomMembersContext must be used within a ChatRoomMembersProvider',
    );
  }
  return context;
};
