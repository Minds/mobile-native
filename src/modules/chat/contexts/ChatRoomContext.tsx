import React, { createContext } from 'react';
import { useChatRoomInfoQuery } from '../hooks/useChatRoomInfoQuery';

export type ChatRoomContextType = ReturnType<typeof useChatRoomInfoQuery>;
// Context
const ChatRoomContext = createContext<ChatRoomContextType | null>(null);
export const ChatRoomProvider = ({
  children,
  roomGuid,
}: {
  children: React.ReactNode;
  roomGuid: string;
}) => {
  const chatRoom = useChatRoomInfoQuery(roomGuid);

  return (
    <ChatRoomContext.Provider value={chatRoom}>
      {children}
    </ChatRoomContext.Provider>
  );
};

export const useChatRoomContext = () => {
  const context = React.useContext(ChatRoomContext);
  if (!context) {
    throw new Error(
      'useChatRoomContext must be used within a ChatRoomProvider',
    );
  }
  return context;
};
