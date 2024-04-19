import React, { createContext } from 'react';
import { useChatRoomMessagesQuery } from '../hooks/useChatRoomMessagesQuery';

export type ChatRoomMessagesContextType = ReturnType<
  typeof useChatRoomMessagesQuery
>;
// Context
const ChatRoomMessagesContext =
  createContext<ChatRoomMessagesContextType | null>(null);
export const ChatRoomMessagesProvider = ({
  children,
  roomGuid,
}: {
  children: React.ReactNode;
  roomGuid: string;
}) => {
  const chatRoomMessages = useChatRoomMessagesQuery(roomGuid);

  return (
    <ChatRoomMessagesContext.Provider value={chatRoomMessages}>
      {children}
    </ChatRoomMessagesContext.Provider>
  );
};

export const useChatRoomMessageContext = () => {
  const context = React.useContext(ChatRoomMessagesContext);

  if (!context) {
    throw new Error(
      'useChatRoomMessageContext must be used within a ChatRoomMessagesProvider',
    );
  }
  return context;
};
