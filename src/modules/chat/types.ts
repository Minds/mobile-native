import {
  GetChatMessagesQuery,
  GetChatRoomQuery,
  GetChatRoomsListQuery,
} from '~/graphql/api';

export type ChatMessage = GetChatMessagesQuery['chatMessages']['edges'][0];

// subset of UserModel
export type ChatMember = GetChatRoomQuery['chatRoom']['members']['edges'][0];

export type ChatRoom = GetChatRoomsListQuery['chatRoomList']['edges'][0];
